import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction.js';
function* getMonitorStation(action) {//获取所有/风/光电站信息
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
  //const url = '/mock/v3/monitor/stations/stationType';
  try {
    yield put({ type: allStationAction.MONITORSTATION_FETCH });
    const response = yield call(axios.get, url);
    if(response.data.code === '10000') {
      if(payload.stationType === '2') {
        const params = {
          allMonitorStation: response.data.data || {},
        }
        if(payload.getStationTypes === true) {
          let stationTypes = '';
          const stationDataList = response.data.data.stationDataList || [];
          const allDatastationType = stationDataList.map((e, index) => { return e.stationType });
          const allStationTypeCode = new Set(allDatastationType); 
           
          const stationNum = allStationTypeCode.size;
          //此时的长度可能为2但是有可能值都是null，或者其中一个是null
          // if(stationNum > 1) {
            if(allStationTypeCode.has('0')&&allStationTypeCode.has('1')) {
            stationTypes = '2';
          } else {
            if(allStationTypeCode.has('0')) {
              stationTypes = '0';
            } else if(allStationTypeCode.has('1')) {
              stationTypes = '1';
            }
          } 
          params.stationTypes = stationTypes;
          if(stationTypes !== '2') {
            params.stationTypeTabs = stationTypes;
          }     
        }        
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: params,
        });
        
      } else if(payload.stationType === '0') {
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: {windMonitorStation: response.data.data||{}}
        });
      } else if(payload.stationType === '1') {
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: {pvMonitorStation: response.data.data||{}}
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}
function* changeMonitorStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: allStationAction.CHANGE_MONITORSTATION_STORE,
    payload
  })
}

export function* watchStationMonitor() {
  yield takeLatest(allStationAction.GET_MONITORSTATION_SAGA, getMonitorStation);
  yield takeLatest(allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, changeMonitorStationStore);


}

