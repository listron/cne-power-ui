import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction.js';
function* getAllMonitorStation(action) {//获取所有电站信息
  const { payload } = action;
  //console.log(payload);
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
  //console.log(url);
  //const url = '/mock/v3/monitor/stations/stationType';
  try {
    yield put({ type: allStationAction.ALL_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, payload);
    console.log(response, 10000, '全部');

    yield put({
      type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
      payload: {
        allMonitorStation: response.data.data || {},
      },
    });
  } catch (e) {
    console.log(e);
  }
}
function* getWindMonitorStation(action) {//获取风电站信息
  const { payload } = action;
  //const url = '/mock/v3/monitor/stations/stationType';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
  try {
    yield put({ type: allStationAction.WIND_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, payload);
    console.log(response, 10000, '风电');
    yield put({
      type: allStationAction.GET_WIND_MONITORSTATION_FETCH_SUCCESS,
      payload: {
        windMonitorStation: response.data.data,
      },
    });
  } catch (e) {
    console.log(e);
  }
}
function* getPvMonitorStation(action) {//获取光伏电站信息
  const { payload } = action;
  //const url = '/mock/v3/monitor/stations/stationType';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;

  try {
    yield put({ type: allStationAction.PV_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, payload);
    console.log(response, 10000, '光伏');
    yield put({
      type: allStationAction.GET_PV_MONITORSTATION_FETCH_SUCCESS,
      payload: {
        pvMonitorStation: response.data.data,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function* changeMonitorStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: allStationAction.CHANGE_MONITORSTATION_STORE,
    payload,
  })

}




export function* watchStationMonitor() {
  yield takeLatest(allStationAction.GET_ALL_MONITORSTATION_SAGA, getAllMonitorStation);
  yield takeLatest(allStationAction.GET_WIND_MONITORSTATION_SAGA, getWindMonitorStation);
  yield takeLatest(allStationAction.GET_PV_MONITORSTATION_SAGA, getPvMonitorStation);
  yield takeLatest(allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, changeMonitorStationStore);


}

