import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { CommonAction } from '../../constants/actionTypes/commonAction';


function *changeCommonStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  console.log(payload)
  yield put({
    type:  CommonAction.CHANGE_COMMON_STORE,
    payload,
  })
}

//获取所有电站信息
function *getStations(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getStations;
  yield put({ type: CommonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.success){
      yield put({ 
        type: CommonAction.GET_STATIONS_SAGA_SUCCESS, 
        params: {
          data: response.data.result
        }
      });       
    } else{
      yield put({ 
        type: CommonAction.GET_STATIONS_SAGA_FAIL, 
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
  yield put({ type: CommonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: CommonAction.GET_DEVICETYPES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: CommonAction.GET_DEVICETYPES_SAGA_FAIL, 
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
  yield put({ type: CommonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: CommonAction.GET_DEVICES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.devices, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: CommonAction.GET_DEVICES_SAGA_FAIL, 
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
  yield put({ type: CommonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: CommonAction.GET_PARTITIONS_SAGA_SUCCESS, 
        params: {
          data: response.data.data.partitions, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: CommonAction.GET_PARTITIONS_SAGA_FAIL, 
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
  yield takeLatest(CommonAction.CHANGE_COMMON_STORE_SAGA, changeCommonStore);
}
export function* watchGetStations() {
  yield takeLatest(CommonAction.GET_STATIONS_SAGA, getStations);
}
export function* watchGetDeviceTypes() {
  yield takeLatest(CommonAction.GET_DEVICETYPES_SAGA, getDeviceTypes);
}
export function* watchGetDevices() {
  yield takeLatest(CommonAction.GET_DEVICES_SAGA, getDevices);
}
export function* watchGetPartition() {
  yield takeLatest(CommonAction.GET_PARTITIONS_SAGA, getPartition);
}
