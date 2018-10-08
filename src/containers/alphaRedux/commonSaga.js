import { call, put, takeLatest,all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { commonAction } from './commonAction';
import { message } from 'antd';

function* changeCommonStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: commonAction.CHANGE_COMMON_STORE,
    payload,
  })
}

//获取所有电站信息
function* getStations(action) {
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          stations: response.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
//获取用户权限范围内所有设备类型信息
function* getDeviceTypes(action) {
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getDevicetypes}`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          deviceTypes: response.data.data,
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
//获取电站下设备类型信息
function* getStationDeviceTypes(action) {
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getStationDevicetypes;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.payload });
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          stationDeviceTypes: response.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getStationDeviceModel(action) { // 获取电站设备型号
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getDeviceModel;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.payload });
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          deviceModels: response.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getStationDevicePoints(action) { // 获取电站设备类型下的测点
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getStationPoints;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.payload });
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          devicePoints: response.data.data || []
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取设备信息列表
function* getDevices(action) {
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getDevices;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.payload });
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          devices: response.data.data,
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取方阵列表
function* getPartition(action) {
  let url = Path.basePaths.APIBasePath + Path.commonPaths.getPartitions;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.payload });
    if (response.data.code === '10000') {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          partitions: response.data.data.partitions
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取光伏组件下设备类型信息
function* getSliceDevices(action) {
  let getPartitionsUrl = Path.basePaths.APIBasePath + Path.commonPaths.getPartitions;
  let getDevicesUrl = Path.basePaths.APIBasePath + Path.commonPaths.getDevices;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, getPartitionsUrl, { params: action.payload });
  
    if (response.data.code === '10000') {
      const slicePartitionCode = response.data.data.partitions.slice(0, 1)[0].deviceCode;    
      const [responseSliceDevice,devices] = yield all([
        call(axios.get, getDevicesUrl, { params: { ...action.payload, partitionCode: slicePartitionCode } }),
        call(axios.get, getDevicesUrl, { params: action.payload })
      ]);
      if(responseSliceDevice.data.code==='10000'&&devices.data.code==='10000'){
        yield put({
          type: commonAction.GET_COMMON_FETCH_SUCCESS,
          payload: {
            sliceDevices: responseSliceDevice.data.data,//光伏组件截取的设备数
            devices: devices.data.data,
            slicePartitionCode:response.data.data.partitions.slice(0, 1)[0].deviceCode,
            partitions: response.data.data.partitions
          }
        })
      }
     
    }
  } catch (e) {
    console.log(e);
  }



}

function* getAllDepartment(action) {//获取所有部门基础信息
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAllDepartment}/${payload.enterpriseId}`
  try {
    yield put({ type: commonAction.COMMON_FETCH });
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          allDepartmentData: response.data.data,
        },
      });
    }
  } catch (e) {
    message.error('获取部门信息失败，请刷新重试!');
    console.log(e);
  }
}


/*  --- todo 待后台开发refreshtoken接口后，解开注释并进行refresh token的替换。
  export function* refreshToken(action){ //根据当前的refresh token获取刷新token并替换
    const { payload } = action;
    const url = '';
    try{
      const response = yield call(axios.post, url ,{
        grant_type: 'refresh_token',
        payload
      })
      if(response.data.code === '10000'){
        const { data } = response.data;
        data.access_token && Cookie.set('authData',JSON.stringify(data.access_token));
        data.enterpriseId && Cookie.set('enterpriseId', data.enterpriseId);
        data.enterpriseName && Cookie.set('enterpriseName', data.enterpriseName);
        data.enterpriseLogo && Cookie.set('enterpriseLogo', data.enterpriseLogo);
        data.userId && Cookie.set('userId', data.userId);
        data.username && Cookie.set('username', data.username);
        data.userLogo && Cookie.set('userLogo', data.userLogo);
        data.expires_in && Cookie.set('expireData', moment().add(data.expires_in, 'seconds'));
        data.refresh_token && Cookie.set('refresh_token', data.refresh_token);
      }
    }catch(error){
      message.error('更新token失败，请重试');
      console.log(error)
    }
  }
*/

export function* watchCommon() {
  yield takeLatest(commonAction.CHANGE_COMMON_STORE_SAGA, changeCommonStore);
  // yield takeLatest(commonAction.REFRESHTOKEN_SAGA, refreshToken);
  yield takeLatest(commonAction.GET_STATIONS_SAGA, getStations);
  yield takeLatest(commonAction.GET_ALL_DEPARTMENT_SAGA, getAllDepartment);
  yield takeLatest(commonAction.GET_DEVICETYPES_SAGA, getDeviceTypes);
  yield takeLatest(commonAction.GET_STATION_DEVICETYPES_SAGA, getStationDeviceTypes);
  yield takeLatest(commonAction.GET_STATION_DEVICEMODEL_SAGA, getStationDeviceModel);
  yield takeLatest(commonAction.GET_STATION_DEVICEPOINT_SAGA, getStationDevicePoints);
  yield takeLatest(commonAction.GET_DEVICES_SAGA, getDevices);
  yield takeLatest(commonAction.GET_PARTITIONS_SAGA, getPartition);
  yield takeLatest(commonAction.GET_SLICE_DEVICES_SAGA, getSliceDevices);
}
