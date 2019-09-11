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
  });
}

function* getStations(action) { // 通用：获取所有电站信息
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}`;
  yield put({ type: commonAction.COMMON_FETCH });
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const stations = response.data.data || [];
      const stationTypes = new Set(stations.map(e => e.stationType));
      let stationTypeCount = 'none';
      if (stationTypes.size === 2) { // 两种类型电站都有
        stationTypeCount = 'multiple';
      } else if (stationTypes.has(1)) { // 只有光伏电站
        stationTypeCount = 'pv';
      } else if (stationTypes.has(0)) { // 只有风电站
        stationTypeCount = 'wind';
      }
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: {
          stations: response.data.data,
          stationTypeCount,
        },
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
        },
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
      const monitorDataUnit = response.data.data || {};
      const [realTimePowerUnit = 'MW', realTimePowerPoint = 0] = monitorDataUnit.realTimePower;
      const [realCapacityUnit = 'MW', realCapacityPoint = 0] = monitorDataUnit.realCapacity;
      const [powerUnit = '万kWh', powerPoint = 0] = monitorDataUnit.power;
      yield put({
        type: commonAction.GET_COMMON_FETCH_SUCCESS,
        payload: { // 旧版本需要保留
          realTimePowerUnit,
          realTimePowerPoint,
          realCapacityUnit,
          realCapacityPoint,
          powerUnit,
          powerPoint,
          monitorPvUnit: {
            realTimePowerUnit,
            realTimePowerPoint,
            realCapacityUnit,
            realCapacityPoint,
            powerUnit,
            powerPoint,
          },
        },
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
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getStationDeviceTypes(action) { // 新共用接口，获取电站下设备类型。
  const url = `${APIBasePath}${commonPaths.getStationDevicetypes}`;
  const { payload } = action;
  const { params, deviceTypeAction, resultName } = payload;
  try {
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: deviceTypeAction,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceTypeAction,
      payload: {
        [resultName]: [],
      },
    });
  }
}


function* getStationTypeDeviceTypes(action) { // 通用： 根据电站类型获取设备类型信息
  const { payload } = action;
  const { params, actionName, resultName } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStationTypeDevicetypes}/${params.type}/devicetype`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: actionName,
      payload: {
        [resultName]: [],
      },
    });
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
        },
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
        },
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
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getPartition(action) { //新-获取方阵列表
  const url = `${APIBasePath}${commonPaths.getPartitions}`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data.partitions || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getMatrixDevices(action) { // 2018-12-24新增，预期删除下面getSliceDevices共用方法。
  const getMatrixUrl = `${APIBasePath}${commonPaths.getPartitions}`;
  const getDevicesUrl = `${APIBasePath}${commonPaths.getDevices}`;
  const { payload } = action;
  try {
    const { params, actionName } = payload;
    const response = yield call(axios.get, getMatrixUrl, { params }); // 所有分区信息
    if (response.data.code === '10000') {
      const partitionCode = response.data.data.partitions[0].deviceCode; // 第一分区code   
      const [matrixDevices, devices] = yield all([
        call(axios.get, getDevicesUrl, { params: { ...params, partitionCode } }),
        call(axios.get, getDevicesUrl, { params }),
      ]);
      if (matrixDevices.data.code === '10000' && devices.data.code === '10000') {
        yield put({
          type: actionName,
          payload: {
            devices: devices.data.data || [], // 所有设备
            filterDevices: matrixDevices.data.data || [],
            partitions: response.data.data.partitions || [],
          },
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function* getSliceDevices(action) { // 新-获取第一个分区光伏组件设备+所有光伏组件信息
  const getPartitionsUrl = `${APIBasePath}${commonPaths.getPartitions}`;
  const getDevicesUrl = `${APIBasePath}${commonPaths.getDevices}`;
  const { payload } = action;
  try {
    const { params, actionName } = payload;
    const response = yield call(axios.get, getPartitionsUrl, { params }); // 所有分区信息
    if (response.data.code === '10000') {
      const partitionCode = response.data.data.partitions[0].deviceCode; // 第一分区code   
      const [devices, allSeries] = yield all([
        call(axios.get, getDevicesUrl, { params: { ...params, partitionCode } }),
        call(axios.get, getDevicesUrl, { params }),
      ]);
      if (devices.data.code === '10000' && allSeries.data.code === '10000') {
        yield put({
          type: actionName,
          payload: {
            allSeries, // 所有光伏组件
            devices: devices.data.data || [],
            firstPartitionCode: partitionCode,
            partitions: response.data.data.partitions || [],
          },
        });
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
    const url = `${APIBasePath}${APISubPaths.system.getAllDepartment}/${params.enterpriseId}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
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
        },
      },
    });
    const response = yield call(axios.post, url, params);

    if (response.data.code === '20022') { // 设备不存在
      yield put({
        type: actionName,
        payload: {
          [resultName]: {
            existLoading: false,
            existError: true,
            existErrorData: response.data.data || '',
            existErroMessage: response.data.message,
          },
        },
      });
    } else {
      yield put({
        type: actionName,
        payload: {
          [resultName]: {
            existLoading: false,
            existErrorData: response.data.data || '',
            existError: false,
          },
        },
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
        },
      },
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
      payload: { [resultName]: response.data.data || [] },
    });
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
      payload: { [resultName]: response.data.data || {} },
    });
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
      payload: { [resultName]: response.data.data || [] },
    });
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
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: { [resultName]: response.data.data || [] },
      });
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
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw '天气数据获取失败'; }
  } catch (error) {
    console.log(error);
  }
}

function* downLoadFile({ payload }) { // 根据路径，名称生成下载文件。(默认post请求), resultName会指定action去标识download的loading状态。
  const { url, fileName, method = 'post', params, actionName, loadingName = 'downloading' } = payload;
  let newFileName = fileName;
  try {
    yield put({
      type: actionName,
      payload: { [loadingName]: true },
    });
    const response = yield call(axios, {
      method,
      url,
      data: params,
      responseType: 'blob',
    });
    yield put({
      type: actionName,
      payload: { [loadingName]: false },
    });
    if (response.data) {
      const fileContent = response.data;
      const fileNameInfo = response.headers['content-disposition'];
      if (fileNameInfo) {
        const fileString = fileNameInfo.split(';')[1];
        const fileNameCode = fileString ? fileString.split('=')[1] : '';
        const fileResult = fileNameCode ? decodeURIComponent(fileNameCode) : '';
        fileResult && (newFileName = fileResult);
      }
      if (fileContent) {
        const blob = new Blob([fileContent]);
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = newFileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, newFileName);
        }
      }
    } else {
      throw response;
    }
  } catch (error) {
    yield put({
      type: actionName,
      payload: { [loadingName]: false },
    });
    message.warning('下载失败！请重新尝试');
    console.log(error);
  }
}
function* getRegion(action) { // //获取用户权限的电站区域
  const url = `${APIBasePath}${commonPaths.getRegion}`;
  // const url = `/mock/v3/wind/report/fan/region`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;

    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getRegionStation(action) { // //获取用户权限的电站
  const url = `${APIBasePath}${commonPaths.getRegionStation}`;
  // const url = `/mock/v3/wind/report/fan/station`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;

    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getStationDevicemode(action) { // //获取用户权限的型号
  const url = `${APIBasePath}${commonPaths.getStationDevicemode}`;
  // const url = `/mock/v3/wind/report/fan/devicemode`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;

    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getRegionStationDevice(action) { // //获取用户权限的风机
  const url = `${APIBasePath}${commonPaths.getRegionStationDevice}`;
  // const url = `/mock/v3/wind/report/fan/device`;
  const { payload } = action;
  try {
    const { params, actionName, resultName } = payload;

    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
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
  yield takeLatest(commonAction.changeCommonStore, changeCommonStore);
  // yield takeLatest(commonAction.REFRESHTOKEN_SAGA, refreshToken);
  yield takeLatest(commonAction.getStations, getStations);
  yield takeLatest(commonAction.getAllDepartment, getAllDepartment);
  yield takeLatest(commonAction.getMonitorDataUnit, getMonitorDataUnit);

  yield takeLatest(commonAction.getStationOfEnterprise, getStationOfEnterprise);
  yield takeLatest(commonAction.getDeviceTypes, getDeviceTypes);
  yield takeLatest(commonAction.getStationTypeDeviceTypes, getStationTypeDeviceTypes);

  yield takeLatest(commonAction.getPartition, getPartition);
  yield takeLatest(commonAction.getSliceDevices, getSliceDevices);
  yield takeLatest(commonAction.getMatrixDevices, getMatrixDevices);
  yield takeLatest(commonAction.findDeviceExist, findDeviceExist);
  yield takeLatest(commonAction.getLostGenType, getLostGenType);

  yield takeLatest(commonAction.getStationDeviceTypes, getStationDeviceTypes);
  yield takeEvery(commonAction.getDeviceModel, getDeviceModel);
  yield takeLatest(commonAction.getPoints, getPoints);
  yield takeEvery(commonAction.getDevices, getDevices);
  yield takeLatest(commonAction.getStationBelongTypes, getStationBelongTypes);
  yield takeLatest(commonAction.getDictionaryInfo, getDictionaryInfo);
  yield takeEvery(commonAction.getStationTargetInfo, getStationTargetInfo);
  yield takeEvery(commonAction.getWeather, getWeather);

  yield takeLatest(commonAction.downLoadFile, downLoadFile);
  yield takeLatest(commonAction.getRegion, getRegion);
  yield takeLatest(commonAction.getRegionStation, getRegionStation);
  yield takeLatest(commonAction.getStationDevicemode, getStationDevicemode);
  yield takeLatest(commonAction.getRegionStationDevice, getRegionStationDevice);
}
