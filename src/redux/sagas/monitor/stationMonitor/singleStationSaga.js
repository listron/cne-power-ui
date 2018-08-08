import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/singleStationAction';

//改变单电站实时数据store
function *changeSingleMonitorStore(action){
  const { payload } = action;
  yield put({
    type: singleStationAction.CHANGE_SINGLE_MONITORSTATION_STORE,
    payload,
  })
}

//获取单电站实时数据
function *getSingleMonitorStation(action){
  const { payload } = action;
  const url = '/mock/api/v3/monitor/station/';
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.post, url, payload);
    console.log(response);
    yield put({
      type: singleStationAction.GET_SINGLE_MONITORSTATION_SUCCESS,
      payload: {
        ...payload,
        ...response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

// 获取电站列表
function *getStationList(action){
  const { payload } = action;
  const url = '/mock/api/v3/station/datalist/';
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.post, url, payload);
    console.log(response);
    yield put({
      type: singleStationAction.GET_SINGLE_MONITORSTATION_SUCCESS,
      payload: {
        ...payload,
        ...response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}


export function* watchSingleStationMonitor() {
  yield takeLatest(singleStationAction.GET_SINGLE_MONITORSTATION_SAGA, getSingleMonitorStation);
  yield takeLatest(singleStationAction.CHANGE_SINGLE_MONITORSTATION_STORE_SAGA, changeSingleMonitorStore);
  yield takeLatest(singleStationAction.GET_STATION_LIST_SAGA, getStationList);
}

