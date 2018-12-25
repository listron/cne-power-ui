import { call, put, takeLatest, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { commonAction } from './commonAction';
import { message } from 'antd';
const { basePaths, commonPaths, APISubPaths } = Path;
const { APIBasePath } = basePaths;

function* changeCommonStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: commonAction.CHANGE_COMMON_STORE,
    payload,
  })
}

function* getStations(action) { // 通用：获取所有电站信息
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

function* getDeviceTypes(action) { // 通用： 获取用户权限范围内所有设备类型信息
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
function* getMonitorDataUnit(action) { // 通用： 获取用户权限范围内所有设备类型信息
  // const url = `/mock/v3/station/monitor/conf`;
   const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getMonitorDataUnit}`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      let monitorDataUnit = response.data.data || {};
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          realTimePowerUnit: monitorDataUnit.realTimePower && monitorDataUnit.realTimePower.length > 0 ? monitorDataUnit.realTimePower[0] : 'MW',
          realTimePowerPoint: monitorDataUnit.realTimePower && monitorDataUnit.realTimePower.length > 0 ? parseFloat(monitorDataUnit.realTimePower[1]) : 0,
          realCapacityUnit: monitorDataUnit.realCapacity && monitorDataUnit.realCapacity.length > 0 ? monitorDataUnit.realCapacity[0] : 'MW',
          realCapacityPoint: monitorDataUnit.realCapacity && monitorDataUnit.realCapacity.length > 0 ? parseFloat(monitorDataUnit.realCapacity[1]) : 0,
          powerUnit: monitorDataUnit.power && monitorDataUnit.power.length > 0 ? monitorDataUnit.power[0] : '万kMh',
          powerPoint: monitorDataUnit.power && monitorDataUnit.power.length > 0 ? parseFloat(monitorDataUnit.power[1]) : 0,
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getStationOfEnterprise(action) { // 根据企业id获取下面所有电站==>与用户权限无关。
  try {
    const { payload } = action;
    const { params, actionName, resultName } = payload;
    const url = `${APIBasePath}${APISubPaths.system.getAllStationBaseInfo}/${params.enterpriseId}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

function* getStationDeviceTypes(action) { // 新共用接口，获取电站下设备类型。
  const url = `${APIBasePath}${commonPaths.getStationDevicetypes}`;
  try {
    const { payload } = action;
    const { params, deviceTypeAction, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: deviceTypeAction,
        payload: {
          [resultName]: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

function* getDeviceModel(action) { // 新共用接口，获取电站设备类型下设备型号
  const url = `${APIBasePath}${commonPaths.getDeviceModel}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getPoints(action) { // 新-获取电站下测点数据
  const url = `${APIBasePath}${commonPaths.getStationPoints}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;

    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getDevices(action) { // 新-获取设备信息列表
  const url = `${APIBasePath}${commonPaths.getDevices}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getPartition(action) { //新-获取方阵列表
  let url = `${APIBasePath}${commonPaths.getPartitions}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data.partitions || [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getSliceDevices(action) { // 新-获取第一个分区光伏组件设备+所有光伏组件信息
  let getPartitionsUrl = `${APIBasePath}${commonPaths.getPartitions}`;
  let getDevicesUrl = `${APIBasePath}${commonPaths.getDevices}`;
  const { payload } = action;
  try {
    const { params, actionName } = payload;
    const response = yield call(axios.get, getPartitionsUrl, { params }); // 所有分区信息
    if (response.data.code === '10000') {
      const partitionCode = response.data.data.partitions[0].deviceCode; // 第一分区code   
      const [devices, allSeries] = yield all([
        call(axios.get, getDevicesUrl, { params: { ...params, partitionCode } }),
        call(axios.get, getDevicesUrl, { params })
      ]);
      if (devices.data.code === '10000' && allSeries.data.code === '10000') {
        yield put({
          type: actionName,
          payload: {
            allSeries, // 所有光伏组件
            devices: devices.data.data || [],
            firstPartitionCode: partitionCode,
            partitions: response.data.data.partitions || [],
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
  try {
    const { params, actionName, resultName } = payload;
    const url = `${APIBasePath}${APISubPaths.system.getAllDepartment}/${params.enterpriseId}`
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
    message.error('获取部门信息失败，请刷新重试!');
    console.log(e);
  }
}

function* findDeviceExist(action) { // 查询设备是否存在
  // const url = '/mock/operation/dayReport/findDeviceExist';
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.findDeviceExist}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    yield put({
      type: actionName,
      payload: {
        [resultName]: {
          existLoading: true,
        }
      }
    });
    const response = yield call(axios.post, url, params);

    if (response.data.code === "20022") { // 设备不存在
      yield put({
        type: actionName,
        payload: {
          [resultName]: {
            existLoading: false,
            existError: true,
            existErrorData: response.data.data || '',
            existErroMessage: response.data.message,
          }
        }
      });
    } else {
      yield put({
        type: actionName,
        payload: {
          [resultName]: {
            existLoading: false,
            existErrorData: response.data.data || '',
            existError: false,
          }
        }
      });
    }
  } catch (e) {
    const { actionName, resultName } = payload;
    message.error('请求失败，请重试!');
    yield put({
      type: actionName,
      payload: {
        [resultName]: {
          existLoading: false,
        }
      }
    });
    console.log(e);
  }
}

function* getLostGenType(action) { // 根据电站类型等指标查询电站故障类型
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getLostGenType}`;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    yield put({
      type: actionName,
      payload: { [resultName]: response.data.data || [] }
    })
  } catch (error) {
    message.error('获取故障类型失败!');
  }
}

function* getStationBelongTypes(action) { // 获取电站可能的所属的各种分类信息
  const { payload } = action;
  const url = `${APIBasePath}${commonPaths.getStationBelongTypes}`;
  try {
    const { actionName, resultName } = payload;
    const response = yield call(axios.get, url);
    yield put({
      type: actionName,
      payload: { [resultName]: response.data.data || {} }
    })
  } catch (error) {
    message.error('获取电站分类信息失败!');
  }
}

function* getStationTargetInfo(action) { // 获取电站指定分类信息(省,市,县,分类等。)
  const { payload } = action;
  const url = `${APIBasePath}${commonPaths.getStationTargetInfo}`;
  try {
    const { actionName, resultName, params } = payload;
    const response = yield call(axios.get, url, { params });
    yield put({
      type: actionName,
      payload: { [resultName]: response.data.data || [] }
    })
  } catch (error) {
    message.error('获取数据失败!');
  }
}


function* getDictionaryInfo(action) { // 获取覆盖类型、并网电压等级、所属电网（区域）忽略原因列表
  const { payload } = action;
  const url = `${APIBasePath}${commonPaths.getDictionaryInfo}`;
  try {
    const { actionName, resultName, params } = payload;
    const response = yield call(axios.post, url, params);
    if (response.data.code === "10000") {
      yield put({
        type: actionName,
        payload: { [resultName]: response.data.data || [] }
      })
    }

  } catch (error) {
    message.error('获取数据失败!');
  }
}

function* getWeather(action) { // 获取电站天气
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    const url = `${APIBasePath}${commonPaths.getWeather}`;
    const response = yield call(axios.get, url, params);
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || []
        }
      })
    } else { throw '天气数据获取失败'; }
  } catch (error) {
    console.log(error)
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
  yield takeLatest(commonAction.changeCommonStore, changeCommonStore);
  // yield takeLatest(commonAction.REFRESHTOKEN_SAGA, refreshToken);
  yield takeLatest(commonAction.getStations, getStations);
  yield takeLatest(commonAction.getAllDepartment, getAllDepartment);
  yield takeLatest(commonAction.getMonitorDataUnit, getMonitorDataUnit);

  yield takeLatest(commonAction.getStationOfEnterprise, getStationOfEnterprise);
  yield takeLatest(commonAction.getDeviceTypes, getDeviceTypes);

  yield takeLatest(commonAction.getPartition, getPartition);
  yield takeLatest(commonAction.getSliceDevices, getSliceDevices);
  yield takeLatest(commonAction.findDeviceExist, findDeviceExist);
  yield takeLatest(commonAction.getLostGenType, getLostGenType);

  yield takeLatest(commonAction.getStationDeviceTypes, getStationDeviceTypes);
  yield takeLatest(commonAction.getDeviceModel, getDeviceModel);
  yield takeLatest(commonAction.getPoints, getPoints);
  yield takeLatest(commonAction.getDevices, getDevices);
  yield takeLatest(commonAction.getStationBelongTypes, getStationBelongTypes);
  yield takeLatest(commonAction.getDictionaryInfo, getDictionaryInfo);
  yield takeEvery(commonAction.getStationTargetInfo, getStationTargetInfo);
  yield takeEvery(commonAction.getWeather, getWeather);
}
