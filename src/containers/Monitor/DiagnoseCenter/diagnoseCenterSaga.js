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
      // yield call(easyPut, 'fetchSuccess', { allEventsStatus: [{
      //   statusCode: 112,
      //   statusName: '状态一种',
      // }, {
      //   statusCode: 123,
      //   statusName: '二种',
      // }, {
      //   statusCode: 321,
      //   statusName: '三兄弟',
      // }]});
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
        // [eventTypeInfo[eventType - 1]]: [1, 2, 3, 4].map(e => ({
        //   eventCode: e * e,
        //   eventName: `类型${e}`,
        //   deviceTypeCode: e * (e + 1),
        //   deviceTypeName: `设备${e*2}类型名`,
        // })),
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

function* getEventsAnalysis({ payload = {} }) { // 诊断分析
  //payload: { diagWarningId: 告警id, deviceFullcode, interval数据时间间隔1-10分钟/2-5秒, date日期, eventCode事件类型编码eventType: 1告警事件2诊断事件3数据事件 }
  try {
    const { diagWarningId, deviceFullcode, eventCode, beginTime, interval } = payload;
    const { pageKey } = yield select(state => state.monitor.diagnoseCenter);
    const eventType = ['alarm', 'diagnose', 'data'].indexOf(pageKey) + 1;
    const url = `${APIBasePath}${monitor.getEventsAnalysis}`;
    yield call(easyPut, 'changeStore', { eventAnalysisLoading: true, showAnalysisPage: true});
    const response = yield call(request.get, url, { params: {
      diagWarningId,
      deviceFullcode,
      eventCode,
      eventType,
      interval, // 1: 十分钟, 2: 5秒, 3: 1分钟
      date: moment(beginTime).format('YYYY-MM-DD'),
    }});
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        eventAnalysisLoading: false,
        analysisEvent: payload,
        // eventAnalysisInfo: {
        //   period: [],
        //   data: [1, 2, 3, 4, 5].map(e => ({
        //     name: `设备${e}`,
        //     gen: Math.random() * 100,
        //     theoryGen: Math.random() * 200 + 100,
        //     diff: Math.random(),
        //   })),
        //   chartType: 2, // 1折线, 2比值
        // },
        eventAnalysisInfo: { ...response.data, deviceFullcode } || { deviceFullcode },
      });
    } else { throw response.message; }
  } catch (error) {
    message.error(`告警事件分析结果获取失败, ${error}`);
    yield call(easyPut, 'changeStore', {
      eventAnalysisInfo: {},
      eventAnalysisLoading: false,
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
}

