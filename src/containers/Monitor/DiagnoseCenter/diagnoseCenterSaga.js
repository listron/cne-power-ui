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

// 交互确认: 
// √1. tab切换 => 以默认值请求事件列表, 清空所有上一个页面搜索条件和定时请求, 开启下一个页面得定时请求;  
// √2. 告警级别点击 => 重新请求列表, 清空下方所有搜索条件, 停止定时请求;
// √3. 筛选条件点击 => 重新请求列表, 停止定时请求;
// √4. 归档点击 => 重新请求列表, 停止定时请求; 其他条件清空
// √5. 刷新按钮点击 => 以当前筛选条件请求列表, 条件不变
// √6. 排序点击 => 重新请求列表, 停止当前定时请求
// √7. 分析点击 =>停止当前定时请求, 单独开启分析页面;


function* easyPut(actionName, payload){
  yield put({
    type: diagnoseCenterAction[actionName],
    payload,
  });
}

function* getEventstatus(){ // 获取事件状态
  try {
    const url = `${APIBasePath}${monitor.getEventstatus}`;
    const response = yield call(request.get, url);
    // if (response.code === '10000') {
      // yield call(easyPut, 'fetchSuccess', { eventstatus: response.data || [] });
      yield call(easyPut, 'fetchSuccess', { eventstatus: [{
        statusCode: 112,
        statusName: '状态一种',
      }, {
        statusCode: 123,
        statusName: '二种',
      }, {
        statusCode: 321,
        statusName: '三兄弟',
      }]});
    // } else { throw response.message; }
  } catch (error) {
    message.error(`事件状态获取失败, ${error}`);
    yield call(easyPut, 'changeStore', { eventstatus: [] });
  }
}

function* getEventtypes({ payload = {} }) { // 获取事件类型
  //payload: { eventType: 1告警事件/2诊断事件/3数据事件, deviceTypeCode }
  const eventTypeInfo = ['alarmEventtypes', 'diagnEventtypes', 'dataEventtypes'];
  const { eventType } = payload;
  try {
    const url = `${APIBasePath}${monitor.getEventtypes}`;
    const response = yield call(request.get, url, { params: payload });
    // if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        // [eventTypeInfo[eventType - 1]]: response.data || [],
        [eventTypeInfo[eventType - 1]]: [1, 2, 3, 4].map(e => ({
          eventCode: e * e,
          eventName: `类型${e}`,
          deviceTypeCode: e * (e + 1),
          deviceTypeName: `设备${e*2}类型名`,
        })),
      });
    // } else { throw response.message; }
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
    try {
      const url = `${APIBasePath}${monitor.getDiagnoseList}`;
      yield call(easyPut, 'changeStore', { diagnoseListLoading: true });
      const { listParams, listPage } = yield select(state => state.monitor.diagnoseCenter);
      // const response = yield call(request.get, url, { params: {
      //   ...listParams,
      //   ...listPage,
      //   ...payload,
      // }});
      // if (response.code === '10000') {
        yield call(easyPut, 'fetchSuccess', {
          // diagnoseListData: response.data.list.map(e => ({ ...e, key: e.diagWarningId })) || [],
          // totalNum: response.data.total || 0,
          // summaryInfo: response.data.summary || {},
          diagnoseUpdateTime: moment().format('YYYY-MM-DD HH:mm'), // 更新表格数据时间
          diagnoseListData: [1, 2, 3].map(e => ({
            key: `M${e}M${e * e}M${e ** e}`,
            diagWarningId: `M${e}M${e * e}M${e ** e}`,
            eventCode: e * e,
            eventName: `事件${e}`,
            statusCode: `状态${e + 10}`,
            statusName: `${e + 12}状态`,
            warningLevel: e,
            pointCode: `M${e}MM${e * e}MMM${e ** e}`,
            pointValueDesc: `${e * e}${Math.random()}`,
            deviceTypeCode: `${e}M设备类型`,
            deviceTypeName: `${e}M设备类型`,
            stationCode: `${e}电站code`,
            stationName: `${e}M电站名称`,
            deviceFullcode: `M${e}MM${e * e}MMM${e ** e}`,
            deviceName: `设备名${e}M${e * e}M${e ** e}`,
            beginTime: `2019-0${e}-${e}${e}`,
            warningDuration: e ** e,
            warningFrequency: e ** e + e * e + e,
          })),
          totalNum: 87,
          summaryInfo: {
            total: 1137 + Math.ceil(Math.random() * 1000),
            level1: 100 + Math.ceil(Math.random() * 100),
            level2: 200 + Math.ceil(Math.random() * 200),
            level3: 300 + Math.ceil(Math.random() * 300),
            level4: 400 + Math.ceil(Math.random() * 400),
          },
          diagnoseListLoading: false,
        });
      // } else { throw response.message; }
    } catch (error) {
      message.error(`事件列表获取失败, ${error}`);
      yield call(easyPut, 'changeStore', {
        diagnoseListData: [],
        totalNum: 0,
        summaryInfo: {},
        diagnoseListLoading: false,
      });
    }
}

function* circlingQueryList({ payload = {} }){ // 启动10s周期调用列表
  circleTimer = yield fork(getDiagnoseList, { payload });
  yield delay(2000);
  if (circleTimer) {
    circleTimer = yield fork(circlingQueryList, { payload });
  }
}

function* stopCircleQueryList(){ // 停止10s周期调用列表
  if (circleTimer) {
    yield cancel(circleTimer);
  }
}

function* getEventsAnalysis({ payload = {} }) { // 诊断分析
  //payload: { diagWarningId: 告警id, deviceFullcode, interval数据时间间隔1-10分钟/2-5秒, date日期, eventCode事件类型编码 }
  try {
    // const { diagWarningId, deviceFullcode, eventCode, beginTime } = payload;
    // const params = {
    //   diagWarningId,
    //   deviceFullcode,
    //   eventCode,
    //   date: beginTime,
    // };
    // analysisEvent = ({ diagWarningId, deviceFullcode, beginTime, eventCode}) => {
    //   this.props.getEventsAnalysis({
    //     diagWarningId, deviceFullcode, eventCode,
    //     date: beginTime,
    //   });
    // }
    // const url = `${APIBasePath}${monitor.getEventsAnalysis}`;
    // const response = yield call(request.get, url, { params });
    // if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        showAnalysisPage: true,
        analysisEvent: payload,
        eventAnalysisInfo: {
          period: [{
            beginTime: '2018-01-01',
            endTime: '2018-01-02',
          }, {
            beginTime: '2018-01-04',
            endTime: '2018-01-05',
          }],
          data: {
            time: ['2018-01-01', '2018-01-02', '2018-01-03', '2018-01-04', '2018-01-05', '2018-01-06'],
            pointData: [4, 5, 6].map(e => ({
              deviceFullCode: `M${e}M${e * e}`,
              deviceName: `M${e}M${e * e}`,
              pointCode: `M${e}M${e * e}`,
              pointName: `测点${e * e}${e * 7}`,
              value: [1, 2, 3, 4, 5, 6].map(e => [
                e + 1, e * 2, e * 7, e * e, e * (e + 1), e * 9,
              ]),
            })),
          },
          chartType: 1, // 1折线, 2比值
        },
      // eventAnalysisInfo: response.data || {},
      });
    // } else { throw response.message; }
  } catch (error) {
    message.error(`告警事件分析结果获取失败, ${error}`);
    yield call(easyPut, 'changeStore', {
      eventAnalysisInfo: {},
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

