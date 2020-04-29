import { call, put, takeLatest, select, fork, cancel, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '@utils/request';
import { message } from 'antd';
import moment from 'moment';
import path from '@path';
import { diagnoseCenterAction } from './diagnoseCenterReducer';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;


let circleTimer = null; // 循环任务标识

function* easyPut(actionName, payload){
  yield put({
    type: diagnoseCenterAction[actionName],
    payload,
  });
}

function* getEventstatus(){ // 获取事件状态
  try {
    const url = `${APIBasePath}${monitor.getEventstatus}`;
    const response = yield call(request.get, url, { params: { statusType: 0 }}); // 0全部 1活动 2已归档
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { allEventsStatus: response.data || [] });
    } else { throw response.message; }
  } catch (error) {
    message.error(`事件状态获取失败, ${error}`);
    yield call(easyPut, 'changeStore', { allEventsStatus: [] });
  }
}

function* getEventtypes({ payload = {} }) { // 获取事件类型
  //payload: { eventType: 1告警事件/2诊断事件/3数据事件, deviceTypeCode }
  const eventTypeInfo = ['alarmEventtypes', 'diagnEventtypes', 'dataEventtypes'];
  const { eventType } = payload;
  try {
    const url = `${APIBasePath}${monitor.getEventtypes}`;
    const response = yield call(request.get, url, { params: payload });
    if (response.code === '10000') {
      const result = [], codeSet = new Set();
      response.data.forEach(e => { // 基于eventCode去重, 防止设备类型的误干扰。
        if (!codeSet.has(e.eventCode)) {
          codeSet.add(e.eventCode);
          result.push(e);
        }
      });
      yield call(easyPut, 'fetchSuccess', {
        [eventTypeInfo[eventType - 1]]: result || [],
      });
    } else { throw response.message; }
  } catch (error) {
    message.error(`事件类型信息获取失败, ${error}`);
    yield call(easyPut, 'changeStore', {
      [eventTypeInfo[eventType - 1]]: [],
    });
  }
}

function* getDiagnoseList({ payload = {}}) { // 获取诊断中心列表
    // payload = { eventType: 1, // 1告警事件, 2诊断事件, 3数据事件;
    // finished: 0, // 1归档事件, 0非归档事件
    // stationCode: null, // 电站编码
    // deviceTypeCode: null, // 设备类型编码
    // eventCode: null, // 标准事件编码
    // eventStatus: null, // 事件状态编码
    // eventLevel: null, // 事件级别
    // pageNum: 1, // 页码
    // pageSize: 20, // 页容量
    // sortField: '', // 排序字段
    // sortMethod: 'desc', // 排序方式 asc升序 + desc降序 }
    const { hideLoading, ...rest } = payload || {};
    try {
    const url = `${APIBasePath}${monitor.getDiagnoseList}`;
      if (!hideLoading) {
        yield call(easyPut, 'changeStore', { diagnoseListLoading: true });
      }
      const { listParams, listPage } = yield select(state => state.monitor.diagnoseCenter);
      const response = yield call(request.post, url, {
        ...listParams,
        ...listPage,
        ...rest,
      });
      if (response.code === '10000') {
        const { list, total, summary } = response.data || {};
        yield call(easyPut, 'fetchSuccess', {
          diagnoseListError: false,
          diagnoseListData: list ? list.map(e => ({ ...e, key: e.diagWarningId })) : [],
          totalNum: total || 0,
          summaryInfo: summary || {},
          diagnoseUpdateTime: moment().format('YYYY-MM-DD HH:mm'), // 更新表格数据时间
          diagnoseListLoading: false,
        });
      } else { throw response.message; }
    } catch (error) {
      message.error(`事件列表获取失败, ${error}`);
      yield call(easyPut, 'changeStore', {
        diagnoseListData: [],
        diagnoseListError: true,
        totalNum: 0,
        summaryInfo: {},
        diagnoseListLoading: false,
      });
    }
}

function* circlingQueryList({ payload }){ // 启动10s周期调用列表
  const { hideLoading, waiting, ...rest } = payload || {};
  if (waiting) {
    yield delay(10000);
  }
  yield fork(getDiagnoseList, { payload: { ...rest, hideLoading } });
  circleTimer = yield fork(circlingQueryList, {
    payload: {
      ...rest,
      hideLoading: true,
      waiting: true,
    },
  });
}

function* stopCircleQueryList(){ // 停止10s周期调用列表
  if (circleTimer) {
    yield cancel(circleTimer);
  }
}

function * editEventsStatus({ payload }) { // 忽略 删除事件
  const url = `${APIBasePath}${monitor.editEventsStatus}`;
      // payload : {diagWarningIds: string[], type: 1忽略 2删除 }
  try {
    const { diagWarningIds, diagWarningId, isLinkage, type } = payload || {};
    const params = { diagWarningIds, type};
    const response = yield call(request.delete, url, { ...params });
    if (response.code === '10000') {
      const statusChangeNum = parseInt(response.data, 10) || 0;
      let statusChangeText = '';
      if (diagWarningIds.length === statusChangeNum) {// 情形一. 所有操作项, 均操作成功;
        statusChangeText = '';
      } else if (diagWarningIds.length > statusChangeNum && statusChangeNum > 0) { // 2. 选中操作项中，有部分操作成功，部分状态已变化
        statusChangeText = `当前选择事件中有${statusChangeNum}条事件已发生状态变更, 其余事件操作成功`;
      } else if (statusChangeNum === 0) { // 3. 选中操作项中，所有状态已经更变
        statusChangeText = isLinkage ? '事件状态已变更, 刷新页面' : '当前选择事件发生状态变更, 将刷新页面';
      }
      yield call(easyPut, 'fetchSuccess', {
        selectedRows: [],
        statusChangeText,
      });
      const { listParams, listPage } = yield select(state => state.monitor.diagnoseCenter);
      if(isLinkage){ // 联动决策-操作
        yield fork(getLinkageList, { payload: { diagWarningId }});
      }else{
        yield fork(getDiagnoseList, { payload: { ...listParams, ...listPage } });
      }
    } else { throw response.message; }
  } catch (error) {
    message.error(`操作失败, ${error}`);
  }
}

function* getEventsAnalysis({ payload = {} }) { // 诊断分析
  //payload: { diagWarningId: 告警id, deviceFullcode, interval数据时间间隔1-10分钟/2-5秒/3-1分钟, date日期, eventCode事件类型编码eventType: 1告警事件2诊断事件3数据事件, fromPath: 从别页直接进入告警中心分析标识, }
  /**
   * fromPath: 从路径(消缺)跳转过来 => 无其他信息，需要基于分析的结果作为页面显示介质
   */
  try {
    const { diagWarningId, deviceFullcode, eventCode, beginTime, interval, fromPath, analysisPageLoading } = payload;
    const { pageKey } = yield select(state => state.monitor.diagnoseCenter);
    const eventType = ['alarm', 'diagnose', 'data'].indexOf(pageKey) + 1;
    const url = `${APIBasePath}${monitor.getEventsAnalysis}`;
    yield call(easyPut, 'changeStore', { isChartLoading: true }); // chart图表loading
    // 1. 外部路径直接跳转分析 => 路径(diagWarningId,deviceFullcode), 将返回结果(response.data.warning)初始化reducer;
    const params = { diagWarningId, deviceFullcode };
    if (!fromPath) { // 2. 正常诊断中心点击分析请求
      params.eventCode = eventCode;
      params.eventType = ['alarm', 'diagnose', 'data'].indexOf(pageKey) + 1;
      params.interval = interval;
      params.date = moment(beginTime).format('YYYY-MM-DD');
    }
    const response = yield call(request.get, url, { params });
    if (response.code === '10000') {
      const pointData = response.data.chartType === 1 ? response.data.data.pointData : response.data.data; // 测点数据结果
      const isEmptyData = !!(pointData.find(e => (response.data.chartType === 1 ? e.value.length : e.length) > 0)); // 是否空数据
      const tmpStoreInfo = { // 要产生的必要store输出。
        analysisPageLoading: false,
        isChartLoading: false,
        analysisEvent: payload,
        eventAnalysisInfo: { ...response.data, deviceFullcode } || { deviceFullcode },
      };
      if (fromPath) { // 路径跳转需额外添加的数据参数;
        const { listParams } = yield select(state => state.monitor.diagnoseCenter);
        const { warning } = response.data || {};
        tmpStoreInfo.pageKey = ['alarm', 'diagnose', 'data'][warning.eventType - 1] || 'alarm';
        tmpStoreInfo.analysisEvent = {
          interval: response.data.interval,
          ...payload,
          ...warning,
        };
        tmpStoreInfo.listParams = { ...listParams, eventType: warning.eventType };
        yield fork(circlingQueryList, {
          payload: { eventType: warning.eventType },
        });
      }
      if (isEmptyData) { // 空数据 - 弹出提示
        tmpStoreInfo.showEmptyDataTip = true;
      }
      const autoIntervalAnalysis = analysisPageLoading && interval === 2 && isEmptyData && (eventType === 1 || eventCode === 'NB1035');
      // 从列表跳入分析页面(autoIntervalAnalysis:true)时: 若interval为5秒+数据为空+事件类型为零电流'NB1035'或者是告警事件时，需继续自动请求10分钟
      yield call(easyPut, 'fetchSuccess', tmpStoreInfo);
      if (autoIntervalAnalysis) {
        yield fork(getEventsAnalysis, { payload: { ...payload, interval: 1, analysisPageLoading: false } });
      }
    } else { throw response.message; }
  } catch (error) {
    message.error(`告警事件分析结果获取失败, ${error}`);
    yield call(easyPut, 'changeStore', {
      eventAnalysisInfo: {},
      analysisPageLoading: false,
      isChartLoading: false,
    });
  }
}

function * getLinkageList({payload = {}}){ // 诊断分析-线型图-联动决策
  const diagWarningId = payload.diagWarningId;
  const url = `${APIBasePath}${monitor.getLinkageList}/${diagWarningId}`;
  try{
    yield call(easyPut, 'changeStore', { linkageListLoading: true });
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        linkageListData: response.data || [],
        linkageListLoading: false,
        linkageListError: true,
      });
    } else { throw response.message; }
  } catch(error){
    message.error(`事件列表获取失败, ${error}`);
    yield call(easyPut, 'changeStore', {
      linkageListLoading: false,
      linkageListError: false,
    });
  }
}

export function* watchDiagnoseCenter() {
  yield takeLatest(diagnoseCenterAction.getEventstatus, getEventstatus);
  yield takeEvery(diagnoseCenterAction.getEventtypes, getEventtypes);
  yield takeLatest(diagnoseCenterAction.getDiagnoseList, getDiagnoseList);
  yield takeLatest(diagnoseCenterAction.circlingQueryList, circlingQueryList);
  yield takeLatest(diagnoseCenterAction.stopCircleQueryList, stopCircleQueryList);
  yield takeLatest(diagnoseCenterAction.getEventsAnalysis, getEventsAnalysis);
  yield takeLatest(diagnoseCenterAction.editEventsStatus, editEventsStatus);
  yield takeLatest(diagnoseCenterAction.getLinkageList, getLinkageList);
}

