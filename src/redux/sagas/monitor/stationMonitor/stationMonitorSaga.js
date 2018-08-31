import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction.js';
function* getAllMonitorStation(action) {//获取所有电站信息
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
  //const url = '/mock/v3/monitor/stations/stationType';
  try {
    yield put({ type: allStationAction.ALL_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, payload);

    const stationDataList = response.data.data.stationDataList || [];
    const allDatastationType = stationDataList.map((e, index) => { return e.stationType });
    const allStationTypeCode = new Set(allDatastationType);
    const stationNum = new Set(allDatastationType).size;

    let stationTypes = '';
    stationNum > 1 ? stationTypes = 'all' : allStationTypeCode.has['0'] ? stationTypes = 'wind' : allStationTypeCode.has['1']?stationTypes = 'pv':'';
    yield put({
      type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
      payload: {
        allMonitorStation: response.data.data || {},
        stationTypes
      },
    });
  } catch (e) {
    console.log(e);
  }
}
function* getWindMonitorStation(action) {//获取风电站信息
  const { payload } = action;
  const { stationTypes } = payload;
  //const url = '/mock/v3/monitor/stations/stationType';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
  try {
    yield put({ type: allStationAction.WIND_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, {
      stationType: payload.stationType
    });
 

    yield put({
      type: allStationAction.GET_WIND_MONITORSTATION_FETCH_SUCCESS,
      payload: stationTypes === 'wind' ? 
     {allMonitorStation: response.data.data}:{windMonitorStation: response.data.data}
    })
  }
  catch (e) {
    console.log(e);
  }
}
function* getPvMonitorStation(action) {//获取光伏电站信息
  const { payload } = action;
  const { stationTypes } = payload;
  //const url = '/mock/v3/monitor/stations/stationType';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;

  try {
    yield put({ type: allStationAction.PV_MONITORSTATION_FETCH });
    const response = yield call(axios.get, url, {
      stationType: payload.stationType
    });
  
    yield put({
      type: allStationAction.GET_PV_MONITORSTATION_FETCH_SUCCESS,
      payload: stationTypes === 'pv' ? 
    {allMonitorStation: response.data.data}:{pvMonitorStation: response.data.data}
    })
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
