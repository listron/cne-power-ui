import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceManageAction } from './deviceManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import { message } from 'antd';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* changeDeviceManageStore(action) {
  // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: deviceManageAction.RESET_STORE,
  });
}

function* getDeviceList(action) {
  // 请求设备列表
  const { payload } = action;
  // const url = '/mock/system/deviceManage/deviceList';
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.getDeviceList
    }`;
  try {
    yield put({ type: deviceManageAction.DEVICE_MANAGE_FETCH });
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      sortField: payload.sortField.replace(/[A-Z]/g, e => `_${e.toLowerCase()}`), //重组字符串
    });
    const totalNum = response.data.data.totalNum || 0;
    const { pageSize } = payload;
    let { pageNum } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) {
      // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) {
      // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
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
    });
  }
}

function* addDeviceDetail(action) {
  // 增加设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.addDeviceInfo
    }`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      message.success('新增成功');
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          showPage: 'list',
          addSuccess: null,
          deviceNameOk: null,
          checkDeviceModeOk: null,
          checkDeviceTypeok: null,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        addSuccess: null,
        deviceNameOk: null,
        checkDeviceModeOk: null,
        checkDeviceTypeok: null,
      },
    });
    message.error('新增电站设备失败');
  }
}

function* getStationDeviceDetail(action) {
  // 获取选中设备详情；
  const { payload } = action;
  const { selectedStationIndex } = payload;
  // const url = '/mock/system/management/device/deviceFullcode';
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.showDeviceInfo
    }/${payload.deviceFullCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedStationIndex,
        stationDeviceDetail: response.data.data || {},
        showPage: 'detail',
      },
    });
    // }
  } catch (e) {
    console.log(e);
    message.error('获取电站设备详情失败，请重试');
  }
}
function* getConnectDevice(action) {
  // 获取设备类型关联设备；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.getConnectDevice
    }/${payload.stationCode}/${payload.deviceTypeCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          connectDevice: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    message.error('获取关联设备失败，请重试');
  }
}

function* getOtherPageDeviceDetail(action) {
  // 设备详情页面翻页时请求详情+table数据翻页
  const { payload } = action;
  const listUrl = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.getDeviceList
    }`;
  try {
    yield put({ type: deviceManageAction.DEVICE_MANAGE_FETCH });
    const { selectedStationIndex } = payload;
    //delete payload.selectedStationIndex;
    const listResponse = yield call(axios.post, listUrl, { ...payload });

    const selecteddeviceFullCode =
      listResponse.data.data.context[selectedStationIndex].deviceFullCode;
    // const detailUrl = '/mock/system/management/device/deviceFullcode';
    const detailUrl = `${Path.basePaths.APIBasePath}${
      Path.APISubPaths.system.showDeviceInfo
      }/${selecteddeviceFullCode}`;
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
        },
      });
    } else {
      message.error('获取详情数据失败，请重试');
      yield put({
        type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
        payload: { loading: false },
      });
    }
  } catch (e) {
    message.error('获取详情数据失败，请重试');
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}
function* editDeviceDetail(action) {
  // 编辑设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.editDeviceInfo
    }`;
  console.log('payload', payload);
  try {
    const response = yield call(axios.put, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => ({
        //继续请求部门列表
        stationCode: state.operation.deviceManage.get('stationCode'),
        pageNum: state.operation.deviceManage.get('pageNum'),
        pageSize: state.operation.deviceManage.get('pageSize'),
        deviceModeCode: state.operation.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        sortMethod: state.operation.deviceManage.get('sortMethod'),
        sortField: state.operation.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    }
  } catch (e) {
    console.log(e);
    message.error('编辑电站详情失败，请重试');
  }
}
function* deleteDevice(action) {
  // 删除设备信息；
  const { payload } = action;
  console.log('payload: ', payload);
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.deleteDevice
    }`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      const deleteDevice = response.data.data.deviceNames;
      if (deleteDevice) {
        message.error(`${deleteDevice}` + '已产生业务数据无法删除');
      } else {
        message.success('删除成功');
        yield put({
          type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
          payload: {
            selectedRowKeys: [],
          },
        });
      }

      const params = yield select(state => ({
        //继续请求部门列表
        stationCode: state.operation.deviceManage.get('stationCode'),
        pageNum: state.operation.deviceManage.get('pageNum'),
        pageSize: state.operation.deviceManage.get('pageSize'),
        deviceModeCode: state.operation.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        sortMethod: state.operation.deviceManage.get('sortMethod'),
        sortField: state.operation.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    }
  } catch (e) {
    console.log(e);
    message.error('删除设备信息失败，请重试');
  }
}

function* deleteStationDevice(action) {
  // 清除设备；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.deleteStationDevice
    }/${payload.stationCode}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },
      });
      const params = yield select(state => ({
        //继续请求部门列表
        stationCode: state.operation.deviceManage.get('stationCode'),
        pageNum: state.operation.deviceManage.get('pageNum'),
        pageSize: state.operation.deviceManage.get('pageSize'),
        deviceModeCode: state.operation.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        sortMethod: state.operation.deviceManage.get('sortMethod'),
        sortField: state.operation.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    } else {
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
    message.error('删除电站设备失败，请重试');
  }
}
function* importStationDevice(action) {
  // 导入设备；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.importStationDevice
    }/${payload.stationCode}`;
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false, // 不处理数据
      contentType: false, // 不设置内容类型
    });
    if (response.data.code === '10000') {
      message.success('导入成功');
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },
      });
      const params = yield select(state => ({
        //继续请求部门列表
        stationCode: state.operation.deviceManage.get('stationCode'),
        pageNum: state.operation.deviceManage.get('pageNum'),
        pageSize: state.operation.deviceManage.get('pageSize'),
        deviceModeCode: state.operation.deviceManage.get('deviceModeCode'),
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        sortMethod: state.operation.deviceManage.get('sortMethod'),
        sortField: state.operation.deviceManage.get('sortField'),
      }));
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_LIST,
        payload: params,
      });
    } else {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
  }
}

function* checkDeviceMode(action) {
  // 查询设备型号是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.checkDeviceMode
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if (response.data.data) {
        message.error('设备类型已经存在');
      } else {
        message.success('此设备型号可以添加');
      }
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          checkDeviceModeData: response.data.data || {},
          checkDeviceModeOk: true,
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        checkDeviceModeOk: null,
      },
    });
    console.log(e);
    message.error('查询设备型号是否重复失败，请重试');
  }
}
function* checkDeviceType(action) {
  // 查询设备类型是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.checkDeviceType
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if (response.data.data.exits) {
        message.error('设备类型已经存在');
      } else {
        message.success('设备类型可以添加');
      }
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          checkDeviceTypeData: response.data.data || {},
          checkDeviceTypeok: true,
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        checkDeviceTypeok: null,
      },
    });
    console.log(e);
    message.error('查询设备类型是否重复失败，请重试');
  }
}
function* checkDeviceName(action) {
  // 查询设备名字是否重复
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.checkDeviceName
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if (response.data.data) {
        message.error('此设备名称已经存在');
      } else {
        message.success('此设备名称可以添加');
      }
      yield put({
        type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
        payload: {
          deviceNameOk: true,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        deviceNameOk: null,
      },
    });
    console.log(e);
    message.error('查询设备名字是否重复失败，请重试');
  }
}
function* addPvDeviceMode(action) {
  // 添加光伏设备型号
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.addPvDeviceMode
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('添加光伏设备型号成功');
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          addPvDeviceModeData: response.data || {},
          checkDeviceeOk: null,
        },
      });
      yield put({
        type: commonAction.getDeviceModel,
        payload: {
          params: { deviceTypeCode: 509 },
          actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
          resultName: 'pvDeviceModels',
        },
      });
    }
  } catch (e) {
    console.log(e);
    message.error('添加设备型号失败，请重试');
  }
}
function* addDeviceMode(action) {
  // 添加设备型号
  const { payload } = action;
  console.log('payload: ', payload);
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.addDeviceMode
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('添加设备型号成功');
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          addDeviceModeData: response.data || {},
          checkDeviceModeOk: null,
        },
      });
      yield put({
        type: commonAction.getDeviceModel,
        payload: {
          params: { deviceTypeCode: payload.deviceTypeCode },
          actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
          resultName: 'deviceModels',
        },
      });
    }
  } catch (e) {
    console.log(e);
    message.error('添加设备型号失败，请重试');
  }
}
function* addDeviceType(action) {
  // 添加设备类型
  const { payload } = action;

  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.addDeviceType
    }`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('添加设备类型成功');
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          addDeviceTypeData: response.data || {},
          addSuccess: true,
          checkDeviceTypeok: null,
        },
      });
      yield put({
        type: deviceManageAction.getStationDeviceType,
        payload: { stationCode: payload.stationCode },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload: {
        addSuccess: null,
      },
    });
    console.log(e);
    message.error('添加设备类型失败，请重试');
  }
}
function* getStationDeviceType(action) {
  //获取电站设备类型
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${
    Path.APISubPaths.system.getStationDeviceType
    }/${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          stationDevices: response.data.data || [],
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    message.error('查找电站下的设备类型失败，请重试');
  }
}
function* getDeviceFactors(action) {
  //获取设备厂家列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceFactorsList}`;
  // const url = `/mock/v3/ledger/devicemanufactors/list`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      const { pageSize } = payload;
      let { pageNum } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) {
        // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) {
        // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          // ...payload,
          deviceFactorsData: response.data.data || {},

          total,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* addDeviceFactors(action) {
  //新建设备厂家
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceFactors}`;
  const nowTime = moment()
    .utc()
    .format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          addmanufactorId: response.data.data.manufactorId || '',
        },
      });
      const payload = yield select(state => ({
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        orderField: state.operation.deviceManage.get('orderField'),
        orderMethod: state.operation.deviceManage.get('orderMethod'),
      }));
      yield put({
        type: deviceManageAction.getDeviceFactors,
        payload,
      });
    } else {
      message.error(`新增设备厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* addDeviceModes(action) {
  //新建设备型号（新）
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceModes}`;
  const nowTime = moment()
    .utc()
    .format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          addmodeId: response.data.data.deviceModeCode || '',
        },
      });
      const payload = yield select(state => ({
        manufactorId: state.operation.deviceManage.get('manufactorId'),
        deviceTypeCode: state.operation.deviceManage.get('deviceTypeCode'),
        assetsId: '',
      }));
      yield put({
        type: deviceManageAction.getfactorsDeviceMode,
        payload,
      });
    } else {
      message.error(`新增设备厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* getfactorsDeviceMode(action) {
  //获取某设备厂家下的设备型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.getfactorsDeviceMode}/${
    payload.manufactorId
    }`;
  // const url = `/mock/v3/ledger/devicemodes/manufactorId`;
  try {
    const response = yield call(axios.get, url, { params: { ...payload } });
    if (response.data.code === '10000') {
      const allMode = response.data.data || [];
      const modaArr = [];
      allMode.forEach((e, i) => {
        e.modeDatas &&
          e.modeDatas.forEach((item, index) => {
            modaArr.push(item);
          });
      });
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          factorsDeviceModeData: modaArr,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* getDevicePartInfo(action) {
  //获取设备部件信息
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDevicePartInfo}/${
    payload.deviceFullcode
    }`;
  // const url = `/mock/v3/ledger/device/parts/list/deviceFullcode`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          partInfoData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* getDevicefixRecord(action) {
  //获取检修记录
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDevicefixRecord}`;
  // const url = `/mock/v3/ledger/device/defect/list`;
  try {
    const response = yield call(axios.get, url, { params: { ...payload } });
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          fixRecordData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* getDevicehistoryWarning(action) {
  //获取设备历史告警
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDevicehistoryWarning}/${
    payload.deviceFullcode
    }/${'事件告警'}`;
  // const url = `/mock/v3/alarm/device/deviceCode/warningType`;
  try {
    const response = yield call(axios.get, url, {
      params: { orderMethod: 'desc', orderField: '1', warningStatus: 0 },
    });
    if (response.data.code === '10000') {
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          historyWarningData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}

export function* watchBookDeviceManage() {
  yield takeLatest(
    deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
    changeDeviceManageStore
  );
  yield takeLatest(deviceManageAction.resetStore, resetStore);
  yield takeLatest(deviceManageAction.GET_DEVICE_MANAGE_LIST, getDeviceList);
  yield takeLatest(deviceManageAction.addDeviceDetail, addDeviceDetail);
  yield takeLatest(
    deviceManageAction.getStationDeviceDetail,
    getStationDeviceDetail
  );
  yield takeLatest(
    deviceManageAction.getOtherPageDeviceDetail,
    getOtherPageDeviceDetail
  );
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
  yield takeLatest(
    deviceManageAction.getStationDeviceType,
    getStationDeviceType
  );
  yield takeLatest(
    deviceManageAction.getfactorsDeviceMode,
    getfactorsDeviceMode
  );
  yield takeLatest(deviceManageAction.addDeviceFactors, addDeviceFactors);
  yield takeLatest(deviceManageAction.addDeviceModes, addDeviceModes);
  yield takeLatest(deviceManageAction.getDeviceFactors, getDeviceFactors);
  yield takeLatest(deviceManageAction.getDevicePartInfo, getDevicePartInfo);
  yield takeLatest(deviceManageAction.getDevicefixRecord, getDevicefixRecord);
  yield takeLatest(
    deviceManageAction.getDevicehistoryWarning,
    getDevicehistoryWarning
  );
}
