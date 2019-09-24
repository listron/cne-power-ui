import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { pointManageAction } from './pointManageAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* changePointManageStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
    payload,
  });
}

function* resetStore() { // 存储payload指定参数，替换reducer-store属性。
  yield put({
    type: pointManageAction.RESET_STORE,
  });
}

function* getStationPointStatusList() { // 请求所有电站列表=>确认是否可删除测点
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}`;
  try {
    const response = yield call(axios.post, url, {
      stationType: '',
      regionName: '',
      stationName: '',
      pageNum: 1,
      pageSize: 10000,
      orderField: '',
      orderCommand: '',
    });
    yield put({
      type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      payload: {
        stationPointStatusList: response.data.data.list || [],
      },
    });
  } catch (e) {
    console.log(e);
    message.error('获取电站列表数据失败，请刷新重试');
  }
}

function* getPointList(action) { // 请求单个详细数据信息
  const { payload } = action;
  // const url = '/mock/system/pointManage/pointsList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPointList}`;
  try {
    yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
    const response = yield call(axios.post, url, {
      ...payload,
      orderField: payload.orderField.replace(/[A-Z]/g, e => `_${e.toLowerCase()}`), //重组字符串
    });

    const totalNum = response.data.data.total || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
        pointList: response.data.data.dataList || [],
        totalNum,
        pageNum,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}

function* deletePointList(action) { // 清除测点列表
  const { payload } = action;
  // const url = '/mock/system/pointManage/deletePointList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deletePointList}/${payload.stationCode}`;
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try {
    const response = yield call(axios.delete, url);
    if (response.data.code === '10000') { // 删除成功后，清空列表
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          pointList: [],
          totalNum: 0,
          pageNum: 0,
        },
      });
    } else {
      yield put({
        type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}
function* getfactorsDeviceMode(action) {
  //获取某设备厂家下的设备型号
  const { payload } = action;
  const { manufactorId } = payload;
  const url = `${APIBasePath}${operation.getfactorsDeviceMode}/${
    payload.manufactorId
    }`;
  // const url = `/mock/v3/ledger/devicemodes/manufactorId`;
  try {
    const response = yield call(axios.get, url, { params: { ...payload } });
    if (response.data.code === '10000') {
      const allFactor = response.data.data || [];
      const modaArr = [];
      allFactor.forEach((e, i) => {
        e.modeDatas &&
          e.modeDatas.forEach((item, index) => {
            modaArr.push(item);
          });
      });
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          // ...payload,
          allFactor,
          factorsDeviceModeData: manufactorId ? modaArr : [],
        },
      });

    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}
function* addPoint(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addPoint}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('测点已添加');
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => ({
        stationCode: state.system.pointManage.get('stationCode'),
        deviceTypeCode: state.system.pointManage.get('deviceTypeCode'),
        deviceModeCode: state.system.pointManage.get('deviceModeCode'),
        devicePointStandardCode: state.system.pointManage.get('devicePointStandardCode'),
        devicePointName: state.system.pointManage.get('devicePointName'),
        pageNum: state.system.pointManage.get('pageNum'),
        pageSize: state.system.pointManage.get('pageSize'),
        orderField: state.system.pointManage.get('orderField'),
        orderType: state.system.pointManage.get('orderType'),
      }));
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_LIST,
        payload: params,
      });

    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }

}
function* deletePoints(action) { // 清除测点列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deletePoints}`;
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') { // 
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },

      });
      const params = yield select(state => ({
        stationCode: state.system.pointManage.get('stationCode'),
        deviceTypeCode: state.system.pointManage.get('deviceTypeCode'),
        deviceModeCode: state.system.pointManage.get('deviceModeCode'),
        devicePointStandardCode: state.system.pointManage.get('devicePointStandardCode'),
        devicePointName: state.system.pointManage.get('devicePointName'),
        pageNum: state.system.pointManage.get('pageNum'),
        pageSize: state.system.pointManage.get('pageSize'),
        orderField: state.system.pointManage.get('orderField'),
        orderType: state.system.pointManage.get('orderType'),
      }));
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_LIST,
        payload: params,
      });
    } else {
      yield put({
        type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}
function* detailPoints(action) { // 测点详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.detailPoints}/${payload.devicePointId}`;
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          pointDetail: response.data.data || {},
          detailTime: moment().unix(),
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}
function* editPoints(action) { // 测点编辑
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.editPoints}`;
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      message.success('测点已保存');
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => ({
        stationCode: state.system.pointManage.get('stationCode'),
        deviceTypeCode: state.system.pointManage.get('deviceTypeCode'),
        deviceModeCode: state.system.pointManage.get('deviceModeCode'),
        devicePointStandardCode: state.system.pointManage.get('devicePointStandardCode'),
        devicePointName: state.system.pointManage.get('devicePointName'),
        pageNum: state.system.pointManage.get('pageNum'),
        pageSize: state.system.pointManage.get('pageSize'),
        orderField: state.system.pointManage.get('orderField'),
        orderType: state.system.pointManage.get('orderType'),
      }));
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_LIST,
        payload: params,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}
function* getStandardDesc(action) { // 测点详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStandardDesc}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          standardDesc: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}

export function* watchPointManage() {
  yield takeLatest(pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, changePointManageStore);
  yield takeLatest(pointManageAction.resetStore, resetStore);
  yield takeLatest(pointManageAction.GET_POINT_MANAGE_ALL_STATION, getStationPointStatusList);
  yield takeLatest(pointManageAction.GET_POINT_MANAGE_LIST, getPointList);
  yield takeLatest(pointManageAction.DELETE_POINT_MANAGE_LIST, deletePointList);
  yield takeLatest(pointManageAction.getfactorsDeviceMode, getfactorsDeviceMode);
  yield takeLatest(pointManageAction.addPoint, addPoint);
  yield takeLatest(pointManageAction.deletePoints, deletePoints);
  yield takeLatest(pointManageAction.detailPoints, detailPoints);
  yield takeLatest(pointManageAction.editPoints, editPoints);
  yield takeLatest(pointManageAction.getStandardDesc, getStandardDesc);
}

