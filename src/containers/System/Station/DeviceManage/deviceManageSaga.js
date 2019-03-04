import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceManageAction } from './deviceManageAction';
import { message } from 'antd';


function* changeDeviceManageStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: deviceManageAction.RESET_STORE
  })
}

function* getDeviceList(action) { // 请求设备列表
  const { payload } = action;
  // const url = '/mock/system/deviceManage/deviceList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDeviceList}`
  try {
    yield put({ type: deviceManageAction.DEVICE_MANAGE_FETCH });
    const response = yield call(axios.post, url, {
      ...payload,
      sortField: payload.sortField.replace(/[A-Z]/g, e => `_${e.toLowerCase()}`), //重组字符串
    });
    const totalNum = response.data.data.totalNum || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
        deviceList: response.data.data.context || [],
        totalNum,
        pageNum,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    })
  }
}


function* addDeviceDetail(action) { // 增加设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addDeviceInfo}`
  try {
    const response = yield call(axios.post, url, { ...payload });
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        showPage: 'list',
        deviceNameOk:null,
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('新增电站设备失败');
  }
}


function* getStationDeviceDetail(action) { // 获取选中设备详情；
  const { payload } = action;
  const { selectedStationIndex } = payload;
  // const url = '/mock/system/management/device/deviceFullcode';
   const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.showDeviceInfo}/${payload.deviceFullCode}`
  try {
    const response = yield call(axios.get, url,payload);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedStationIndex,
        stationDeviceDetail: response.data.data || {},
        showPage: 'detail',
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('获取电站设备详情失败，请重试');
  }
}
function* getConnectDevice(action) { // 获取设备类型关联设备；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getConnectDevice}/${payload.stationCode}/${payload.deviceTypeCode}`
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          connectDevice: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e);
    message.error('获取关联设备失败，请重试');
  }
}

function* getOtherPageDeviceDetail(action) { // 设备详情页面翻页时请求详情+table数据翻页
  const { payload } = action;
  const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDeviceList}`
  try {
    yield put({ type: deviceManageAction.DEVICE_MANAGE_FETCH });
    const { selectedStationIndex } = payload;
    //delete payload.selectedStationIndex;
    const listResponse = yield call(axios.post, listUrl, { ...payload });

    const selecteddeviceFullCode = listResponse.data.data.context[selectedStationIndex].deviceFullCode;
    // const detailUrl = '/mock/system/management/device/deviceFullcode';
    const detailUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.showDeviceInfo}/${selecteddeviceFullCode}`
    const detailResponse = yield call(axios.get, detailUrl);
    if (1) {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          selectedStationIndex,
          deviceList: listResponse.data.data.context || [],
          totalNum: listResponse.data.data.totalNum || 0,
          stationDeviceDetail: detailResponse.data.data || {},
        }
      })
    } else {
      message.error('获取详情数据失败，请重试');
      yield put({
        type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
        payload: { loading: false },
      })
    }
  } catch (e) {
    message.error('获取详情数据失败，请重试');
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { loading: false },
    })
  }
}
function* editDeviceDetail(action) { // 编辑设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.editDeviceInfo}`
  try {
    const response = yield call(axios.put, url, { ...payload });
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        showPage: 'list',
      }
    })
  } catch (e) {
    console.log(e);
    message.error('编辑电站详情失败，请重试');
  }
}
function* deleteDevice(action) { // 删除设备信息；
  const { payload } = action;
  console.log('payload: ', payload);
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteDevice}`
  try {
    const response = yield call(axios.delete, url, { data: payload });
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedRowKeys: [],
        selectedRowData: []

      }
    })
    const params = yield select(state => ({//继续请求部门列表
      stationCode: state.system.deviceManage.get('stationCode'),
      pageNum: state.system.deviceManage.get('pageNum'),
      pageSize: state.system.deviceManage.get('pageSize'),
      deviceModeCode: state.system.deviceManage.get('deviceModeCode'),
      deviceTypeCode: state.system.deviceManage.get('deviceTypeCode'),
      sortMethod: state.system.deviceManage.get('sortMethod'),
      sortField: state.system.deviceManage.get('sortField'),
    }));
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
      payload: params,
    });
    // }
  } catch (e) {
    console.log(e);
    message.error('删除设备信息失败，请重试');
  }
}

function* deleteStationDevice(action) { // 清除设备；
  const { payload } = action;
  console.log('payload: ', payload);
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteStationDevice}/${payload.stationCode}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: []
        }
      })
      const params = yield select(state => ({//继续请求部门列表
        stationCode: state.system.deviceManage.get('stationCode'),
        pageNum: state.system.deviceManage.get('pageNum'),
        pageSize: state.system.deviceManage.get('pageSize'),
        deviceModeCode: state.system.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.system.deviceManage.get('deviceTypeCode'),
        sortMethod: state.system.deviceManage.get('sortMethod'),
        sortField: state.system.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    } else {
      message.error(response.data)
    }
  } catch (e) {
    console.log(e);
    message.error('删除电站设备失败，请重试');
  }
}
function* importStationDevice(action) { // 导入设备；
  const { payload } = action;
  console.log('payload: ', payload);
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.importStationDevice}/${payload.stationCode}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: []
        }
      })
      const params = yield select(state => ({//继续请求部门列表
        stationCode: state.system.deviceManage.get('stationCode'),
        pageNum: state.system.deviceManage.get('pageNum'),
        pageSize: state.system.deviceManage.get('pageSize'),
        deviceModeCode: state.system.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.system.deviceManage.get('deviceTypeCode'),
        sortMethod: state.system.deviceManage.get('sortMethod'),
        sortField: state.system.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    } else {
      message.error(response.data)
    }
  } catch (e) {
    console.log(e);
    message.error('删除电站设备失败，请重试');
  }
}



function* checkDeviceMode(action) { // 查询设备型号是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.checkDeviceMode}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          checkDeviceModeData: response.data.data || {},
          checkDeviceModeOk: true
        }
      })
    } else {
      throw response.data.data
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        checkDeviceModeOk: null
      }
    })
    console.log(e);
    message.error('查询设备型号是否重复失败，请重试');
  }
}
function* checkDeviceType(action) { // 查询设备类型是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.checkDeviceType}`
  try {
    const response = yield call(axios.post, url,payload);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          checkDeviceTypeData: response.data.data || {},
          checkDeviceTypeok:true,
        }
      })
    } else {
      throw response.data.data
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        checkDeviceTypeok:null,
      }
    })
    console.log(e);
    message.error('查询设备类型是否重复失败，请重试');
  }
}
function* checkDeviceName(action) { // 查询设备名字是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.checkDeviceName}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      yield put({
        type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
        payload: {
          deviceNameOk: true,
        }
      })
      if (response.data.data !== 0) {
        message.error('设备名字已存在');
      }
    }else{
      throw response.data
    } 
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        deviceNameOk: null,
      }
    })
    console.log(e);
    message.error('查询设备名字是否重复失败，请重试');
  }
}
function* addPvDeviceMode(action) { // 添加设备型号
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addPvDeviceMode}`
  try {
    const response = yield call(axios.post, url, payload);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        addPvDeviceModeData: response.data.data || {},
        checkDeviceeOk: null,
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('添加设备型号失败，请重试');
  }
}
function* addDeviceMode(action) { // 添加设备型号
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addDeviceMode}`
  try {
    const response = yield call(axios.post, url, payload);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        addDeviceModeData: response.data.data || {},
        checkDeviceModeOk: null,
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('添加设备型号失败，请重试');
  }
}
function* addDeviceType(action) { // 添加设备类型
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addDeviceType}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      message.success('添加设备类型成功')
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          addDeviceTypeData: response.data.data || {},
          addSuccess: true,
          checkDeviceTypeok:null,
        }
      })
    } else {
      throw response.data.data
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        addSuccess: null
      }
    })
    console.log(e);
    message.error('添加设备类型失败，请重试');
  }
}


export function* watchDeviceManage() {
  yield takeLatest(deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, changeDeviceManageStore);
  yield takeLatest(deviceManageAction.resetStore, resetStore);
  yield takeLatest(deviceManageAction.GET_DEVICE_MANAGE_LIST, getDeviceList);
  yield takeLatest(deviceManageAction.addDeviceDetail, addDeviceDetail);
  yield takeLatest(deviceManageAction.getStationDeviceDetail, getStationDeviceDetail);
  yield takeLatest(deviceManageAction.getOtherPageDeviceDetail, getOtherPageDeviceDetail);
  yield takeLatest(deviceManageAction.editDeviceDetail, editDeviceDetail);
  yield takeLatest(deviceManageAction.getConnectDevice, getConnectDevice);
  yield takeLatest(deviceManageAction.deleteDevice, deleteDevice);
  yield takeLatest(deviceManageAction.checkDeviceMode, checkDeviceMode);
  yield takeLatest(deviceManageAction.checkDeviceType, checkDeviceType);
  yield takeLatest(deviceManageAction.checkDeviceName, checkDeviceName);
  yield takeLatest(deviceManageAction.addDeviceMode, addDeviceMode);
  yield takeLatest(deviceManageAction.addPvDeviceMode, addPvDeviceMode);
  yield takeLatest(deviceManageAction.addDeviceType, addDeviceType);
  yield takeLatest(deviceManageAction.deleteStationDevice, deleteStationDevice);
  yield takeLatest(deviceManageAction.importStationDevice, importStationDevice);
}

