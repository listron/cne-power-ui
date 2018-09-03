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
        let stationTypes = '2';
        if(payload.getStationTypes === true) {
          const stationDataList = response.data.data.stationDataList || [];
          const allDatastationType = stationDataList.map((e, index) => { return e.stationType });
          const allStationTypeCode = new Set(allDatastationType);
          const stationNum = allStationTypeCode.size;
          if(stationNum > 1) {
            stationTypes = '2';
          } else {
            if(allStationTypeCode.has['0']) {
              stationTypes = '0';
            } else if(allStationTypeCode.has['1']) {
              stationTypes = '1';
            }
          }        
        }
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: {
            allMonitorStation: response.data.data || {},
            stationTypes
          },
        });
        
      } else if(payload.stationType === '0') {
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: {windMonitorStation: response.data.data}
        });
      } else if(payload.stationType === '1') {
        yield put({
          type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
          payload: {pvMonitorStation: response.data.data}
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}
// function* getWindMonitorStation(action) {//获取风电站信息
//   const { payload } = action;
//   //const url = '/mock/v3/monitor/stations/stationType';
//   const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
//   try {
//     yield put({ type: allStationAction.MONITORSTATION_FETCH });
//     const response = yield call(axios.get, url);
//     if(response.data.code === '10000') {
//       yield put({
//         type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
//         payload: {windMonitorStation: response.data.data}
//       });
//     }
//   }
//   catch (e) {
//     console.log(e);
//   }
// }
// function* getPvMonitorStation(action) {//获取光伏电站信息
//   const { payload } = action;
//   //const url = '/mock/v3/monitor/stations/stationType';
//   const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationType + payload.stationType;
//   try {
//     yield put({ type: allStationAction.MONITORSTATION_FETCH });
//     const response = yield call(axios.get, url);  
//     if(response.data.code === '10000') {
//       yield put({
//         type: allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
//         payload: {pvMonitorStation: response.data.data}
//       });
//     } 
//   } catch (e) {
//     console.log(e);
//   }
// }

function* changeMonitorStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: allStationAction.CHANGE_MONITORSTATION_STORE,
    payload,
  })
}

export function* watchStationMonitor() {
  yield takeLatest(allStationAction.GET_MONITORSTATION_SAGA, getMonitorStation);
  // yield takeLatest(allStationAction.GET_WIND_MONITORSTATION_SAGA, getWindMonitorStation);
  // yield takeLatest(allStationAction.GET_PV_MONITORSTATION_SAGA, getPvMonitorStation);
  yield takeLatest(allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, changeMonitorStationStore);


}

