import { call, put, takeLatest, fork, cancel, race } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import Path from '../../../../constants/path';
import { allStationAction } from './allStationAction.js';
import { message } from 'antd';
import moment from 'moment';
let realtimeInterval = null;
let realChartsInterval = null;
let realPowerInterval = null;

const baseurl = Path.basePaths.APIBasePath;
function* getMonitorStation(action) {//获取所有/风/光电站信息
  const { payload } = action;
  const utcTime = moment.utc().format();
  const url = baseurl + Path.APISubPaths.monitor.getStationType + payload.stationType + '/' + utcTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      if (payload.stationType === '2') { // 全部的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { allMonitorStation: response.data.data || {}, loading: false },
        });
      }
      if (payload.stationType === '0') { // 风电的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { windMonitorStation: response.data.data || {}, loading: false }
        });
      }
      if (payload.stationType === '1') { // 光伏的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { pvMonitorStation: response.data.data || {}, loading: false }
        });
      }
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    let nameArr = ["windMonitorStation", "pvMonitorStation", "allMonitorStation"][payload.stationType];
    payload[nameArr] = {};
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload,
    });
  }
}

function* getWindMonitorStation(action) {//获取所有/风/光电站信息
  const { payload } = action;
  const utcTime = moment.utc().format();
  const url = baseurl + Path.APISubPaths.monitor.getWindStation + '/' + utcTime;
  // const stationType = 0;
  // const url = baseurl + Path.APISubPaths.monitor.getStationType + stationType + '/' + utcTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: { windMonitorStation: response.data.data || {}, loading: false }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    let nameArr = ["windMonitorStation", "pvMonitorStation", "allMonitorStation"][payload.stationType];
    payload[nameArr] = {};
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { windMonitorStation: {}, loading: false }
    });
  }
}

function* getRealMonitorData(action) {
  const { firtQuery = true, payload } = action;
  if (firtQuery) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: true }
    })
  }
  if (payload.stationType === '0') {
    yield fork(getWindMonitorStation, action);
  } else {
    yield fork(getMonitorStation, action);
  }
  yield delay(10000); // 阻塞10秒
  realtimeInterval = yield fork(getRealMonitorData, { ...action, firtQuery: false });
}

function* stopRealMonitorData() { // 停止数据定时请求并清空数据
  if (realtimeInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: false }
    })
    yield cancel(realtimeInterval);
  }
}


//获取出力图数据
function* getCapabilityDiagram(action) {
  const { startTime, endTime } = action;
  const url = `${baseurl + Path.APISubPaths.monitor.getWindCapability}/${startTime}/${endTime}`
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          capabilityData: response.data.data || [],
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        capabilityData: [],
      }
    });
  }
}

//获取理论发电量 实际发电量数据
function* getMonitorPower(action) {
  const { payload } = action;
  const { intervalTime, startTime, endTime } = payload;
  const url = `${baseurl + Path.APISubPaths.monitor.getWindMonitorPower}/${intervalTime}/${startTime}/${endTime}/${-1}`;
  // const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getMonitorPower + 350 + '/' + payload.startTime + '/' + payload.endTime + '/' + payload.intervalTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          powerData: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: [],
      }
    });
  }
}

// 等效小时数
function* getMonitorScatter(action) {
  const localDate = moment().format('YYYY-MM-DD');
  const url = `${baseurl + Path.APISubPaths.monitor.getWindScatter}/${localDate}}`
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          scatterData: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: [],
      }
    });
  }
}


function* getRealChartsData(action) { // 获取出力图和日等效利用小时散点数
  const { payload } = action;
  const { capability } = payload;
  yield fork(getCapabilityDiagram, { ...capability });
  yield fork(getMonitorScatter);
  yield delay(3600000); // 阻塞1小时
  // yield delay(10000); // 阻塞10秒
  realChartsInterval = yield fork(getRealChartsData, action);
}

function* getRealMonitorPower(action) {
  realPowerInterval = yield fork(getMonitorPower, action);
  yield delay(3600000); // 阻塞1小时
  // yield delay(10000); // 阻塞10秒
  realPowerInterval = yield fork(getRealMonitorPower, action);
}

function* stopRealCharstData(action) {
  const { payload } = action;
  if (realChartsInterval) {
    yield cancel(realChartsInterval);
  }
  if (payload === 'power' && realPowerInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: []
      }
    })
    yield cancel(realPowerInterval);
  }
}



export function* watchStationMonitor() {
  yield takeLatest(allStationAction.getMonitorStation, getMonitorStation);
  yield takeLatest(allStationAction.stopRealMonitorData, stopRealMonitorData);
  yield takeLatest(allStationAction.getRealMonitorData, getRealMonitorData);
  yield takeLatest(allStationAction.getRealMonitorPower, getRealMonitorPower);
  yield takeLatest(allStationAction.getRealChartsData, getRealChartsData);
  yield takeLatest(allStationAction.stopRealCharstData, stopRealCharstData);
}

