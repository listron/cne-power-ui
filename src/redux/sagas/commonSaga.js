import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { commonAction } from '../../constants/actionTypes/commonAction';


function *changeCommonStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  commonAction.CHANGE_COMMON_STORE,
    payload,
  })
}

//获取所有电站信息
function *getStations(action){
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}/`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get,url);
    if(response.data.code === '10000'){
      yield put({ 
        type: commonAction.GET_STATIONS_SUCCESS, 
        params: {
          data: response.data.data
        }
      });       
    } else{
      yield put({ 
        type: commonAction.GET_STATIONS_FAIL, 
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
//获取用户权限范围内所有设备类型信息
function *getDeviceTypes(action){
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getDevicetypes}/`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({ 
        type: commonAction.GET_DEVICETYPES_SUCCESS, 
        params: {
          data: response.data.data, 
        }
      });       
    } else{
      yield put({ 
        type: commonAction.GET_DEVICETYPES_FAIL, 
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
//获取电站下设备类型信息
function *getStationDeviceTypes(action){
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getStationDevicetypes;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: commonAction.GET_STATION_DEVICETYPES_SUCCESS, 
        params: {
          data: response.data.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: commonAction.GET_STATION_DEVICETYPES_FAIL, 
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
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getDevices;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: commonAction.GET_DEVICES_SUCCESS, 
        params: {
          data: response.data.data.devices, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: commonAction.GET_DEVICES_FAIL, 
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
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getPartitions;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: commonAction.GET_PARTITIONS_SUCCESS, 
        params: {
          data: response.data.data.partitions, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: commonAction.GET_PARTITIONS_FAIL, 
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

export function* watchCommonStoreChange() {
  yield takeLatest(commonAction.CHANGE_COMMON_STORE_SAGA, changeCommonStore);
}
export function* watchGetStations() {
  yield takeLatest(commonAction.GET_STATIONS_SAGA, getStations);
}
export function* watchGetDeviceTypes() {
  yield takeLatest(commonAction.GET_DEVICETYPES_SAGA, getDeviceTypes);
}
export function* watchGetStationDeviceTypes() {
  yield takeLatest(commonAction.GET_STATION_DEVICETYPES_SAGA, getStationDeviceTypes);
}
export function* watchGetDevices() {
  yield takeLatest(commonAction.GET_DEVICES_SAGA, getDevices);
}
export function* watchGetPartition() {
  yield takeLatest(commonAction.GET_PARTITIONS_SAGA, getPartition);
}
