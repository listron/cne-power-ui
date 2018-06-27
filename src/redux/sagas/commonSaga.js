import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import {
  COMMON_FETCH,

  GET_STATIONS_SAGA,
  GET_STATIONS_SAGA_SUCCESS,
  GET_STATIONS_SAGA_FAIL,

  GET_DEVICETYPES_SAGA,
  GET_DEVICETYPES_SAGA_SUCCESS,
  GET_DEVICETYPES_SAGA_FAIL,
  
  GET_DEVICES_SAGA,
  GET_DEVICES_SAGA_SUCCESS,
  GET_DEVICES_SAGA_FAIL,
} from '../../constants/actionTypes/commonAction';

//获取所有电站信息
function *getStations(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getStations;
  yield put({ type: COMMON_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.success){
      yield put({ 
        type: GET_STATIONS_SAGA_SUCCESS, 
        params: {
          data: response.data.result
        }
      });       
    } else{
      yield put({ 
        type: GET_STATIONS_SAGA_FAIL, 
        error:{
          code: response.data.error,
          message: response.data.error
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}
//获取电站下设备类型信息
function *getDeviceTypes(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getDevicetypes;
  yield put({ type: COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEVICETYPES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: GET_DEVICETYPES_SAGA_FAIL, 
        error:{
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}
//获取设备信息列表
function *getDevices(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getDevices;
  yield put({ type: COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, action.params);
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEVICES_SAGA_SUCCESS, 
        params: {
          data: response.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: GET_DEVICES_SAGA_FAIL, 
        error:{
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchGetStations() {
  yield takeLatest(GET_STATIONS_SAGA, getStations);
}
export function* watchGetDeviceTypes() {
  yield takeLatest(GET_DEVICETYPES_SAGA, getDeviceTypes);
}
export function* watchGetDevices() {
  yield takeLatest(GET_DEVICES_SAGA, getDevices);
}
export function* watchGetDefectTypes(){
  yield takeLatest(GET_DEFECT_TYPES_SAGA, getDefectTypes);
}
