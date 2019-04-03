import { call, put, takeLatest, fork, cancel, race } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import Path from '../../../../constants/path';
import { allStationAction } from './allStationAction.js';
import { message } from 'antd';
import moment from 'moment';
let realtimeInterval = null;

function* getMonitorStation(action) {//获取所有/风/光电站信息
  const { payload } = action;
  const utcTime = moment.utc().format();
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType + '/' + utcTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      if (payload.stationType === '2') { // 全部的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { allMonitorStation: response.data.data || {}, },
        });
      }
      if (payload.stationType === '0') { // 风电的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { windMonitorStation: response.data.data || {} }
        });
      }
      if (payload.stationType === '1') { // 光伏的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { pvMonitorStation: response.data.data || {} }
        });
      }
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    let nameArr = ["windMonitorStation", "pvMonitorStation", "allMonitorStation"][payload.stationType];
    payload[nameArr]={};
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload,
    });
  }
}

function* getRealtimeData(action) {
  const { firtQuery = true } = action;
  if (firtQuery) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: true }
    })
  }
  yield fork(getMonitorStation, action);
  yield delay(10000); // 阻塞10秒
  realtimeInterval = yield fork(getRealtimeData, { ...action, firtQuery: false });
}

function* stopRealtimeData() { // 停止数据定时请求并清空数据
  if (realtimeInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        // allMonitorStation: {},
        // windMonitorStation: {},
        // pvMonitorStation: {},
      }
    })
    yield cancel(realtimeInterval);
  }
}

export function* watchStationMonitor() {
  yield takeLatest(allStationAction.getMonitorStation, getMonitorStation);
  yield takeLatest(allStationAction.stopRealtimeData, stopRealtimeData);
  yield takeLatest(allStationAction.getRealtimeData, getRealtimeData);
}

