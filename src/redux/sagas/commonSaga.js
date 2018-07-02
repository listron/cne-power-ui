import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import {
  GET_TOPMENU_CHANGE_SAGA,
  GET_TOPMENU_CHANGE_SUCCESS,
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

  GET_PARTITIONS_SAGA,
  GET_PARTITIONS_SAGA_SUCCESS,
  GET_PARTITIONS_SAGA_FAIL,
} from '../../constants/actionTypes/commonAction';

//保存当前topMenu信息
function *getTopMenuChange(action){
  yield put({ 
    type: GET_TOPMENU_CHANGE_SUCCESS, 
    params: action.params
  });    
}

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
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEVICES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.devices, 
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

//获取方阵列表
function *getPartition(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getPartitions;
  yield put({ type: COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_PARTITIONS_SAGA_SUCCESS, 
        params: {
          data: response.data.data.partitions, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: GET_PARTITIONS_SAGA_FAIL, 
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

export function* watchTopMenuChange() {
  yield takeLatest(GET_TOPMENU_CHANGE_SAGA, getTopMenuChange);
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
export function* watchGetPartition() {
  yield takeLatest(GET_PARTITIONS_SAGA, getPartition);
}
