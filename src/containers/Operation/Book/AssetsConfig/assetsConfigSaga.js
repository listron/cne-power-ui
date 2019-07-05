import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { assetConfigAction } from './assetsConfigAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* getAssetTree(action) { // 生产资产树
  const { payload } = action;
  const url = `${APIBasePath}${operation.getAssetTree}`;
  // const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment().utc().format();
  try {
    const response = yield call(axios.post, url, { ...payload, assetsParentId: '0', nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          // ...payload,
          assetList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false, assetList: [] },
    });
  }
}
function* getNodeDetail(action) { // 生产资产树详情
  const { payload } = action;
  const url = `${APIBasePath}${operation.getNodeDetail}`;
  // const url = `/mock/v3/ledger/detail`;
  const nowTime = moment().utc().format();
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
          childrenNodeDetail: response.data.data || [],
        },
      });
    } else {
      message.error(response.data.message);
      throw response.data;
    }
  } catch (e) {
    console.log(e);

    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* addAssetNode(action) { //台账增加生产资产节点
  const { payload } = action;
  const nowTime = moment().utc().format();
  const url = `${APIBasePath}${operation.addAssetNode}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
        },
      });
      //发送请求树的数据和当前节点的table详情     
      const payload = yield select(state => ({
        stationType: state.operation.assetsConfig.get('stationType'),
        assetsParentId: state.operation.assetsConfig.get('assetsParentId'),
        // assetsParentId:'0',
        nowTime: moment().utc().format(),
      }));
      yield put({
        type: assetConfigAction.getAssetTree,
        payload: { ...payload, assetsParentId: '0' },
      });
      yield put({
        type: assetConfigAction.getNodeDetail,
        payload,
      });
    } else if (response.data.code === '60015') {
      message.warning('请先解除设备厂家,设备型号和生产资产的关联关系');

    } else if (response.data.code === '60016') {
      message.warning('资产中存在该设备类型名称,请重新输入');
    } else {
      message.error(`添加生产节点失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* deleteAssetNode(action) { //台账删除生产资产树
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteAssetNode}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
        stationType: state.operation.assetsConfig.get('stationType'),
        assetsParentId: state.operation.assetsConfig.get('assetsParentId'),
        // assetsParentId:'0',
        nowTime: moment().utc().format(),
      }));
      yield put({
        type: assetConfigAction.getAssetTree,
        payload: { ...payload, assetsParentId: '0' },
      });
      yield put({
        type: assetConfigAction.getNodeDetail,
        payload,
      });
    } else {
      message.error(`编辑生产节点失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* editAssetNode(action) { //台账编辑生产资产节点
  const { payload } = action;
  const nowTime = moment().utc().format();

  const url = `${APIBasePath}${operation.editAssetNode}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
        stationType: state.operation.assetsConfig.get('stationType'),
        assetsParentId: state.operation.assetsConfig.get('assetsParentId'),
        // assetsParentId:'0',
        nowTime: moment().utc(),
      }));
      yield put({
        type: assetConfigAction.getAssetTree,
        payload: { ...payload, assetsParentId: '0' },
      });
      yield put({
        type: assetConfigAction.getNodeDetail,
        payload,
      });
    } else if (response.data.code === '60015') {
      message.warning('请先解除设备厂家,设备型号和生产资产的关联关系');

    } else if (response.data.code === '60016') {
      message.warning('资产中存在该设备类型名称,请重新输入');
    } else {
      message.error(`编辑生产节点失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* getDeviceFactorsList(action) { //获取设备厂家列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceFactorsList}`;
  // const url = `/mock/v3/ledger/devicemanufactors/list`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
          deviceFactorsList: response.data.data.dataList || [],
          total: response.data.data.pageCount || 0,

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* addDeviceFactors(action) { //新建设备厂家
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceFactors}`;
  const nowTime = moment().utc().format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageNum: state.operation.assetsConfig.get('pageNum'),
        pageSize: state.operation.assetsConfig.get('pageSize'),

      }));
      yield put({
        type: assetConfigAction.getDeviceFactorsList,
        payload,
      });
    } else {
      message.error(`新增设备厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { ...payload, loading: false },
    });
  }
}
function* editDeviceFactors(action) { //编辑设备厂家
  const { payload } = action;
  const nowTime = moment().utc().format();
  const url = `${APIBasePath}${operation.editDeviceFactors}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          // ...payload,
        },
      });
      const payload = yield select(state => ({
        manufactorName: state.operation.assetsConfig.get('manufactorName'),
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageSize: state.operation.assetsConfig.get('pageSize'),
        pageNum: state.operation.assetsConfig.get('pageNum'),

      }));
      yield put({
        type: assetConfigAction.getDeviceFactorsList,
        payload,
      });
    } else {
      message.error(`编辑设备厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* deleteDeviceFactors(action) { //删除设备厂家
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteDeviceFactors}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
        manufactorName: state.operation.assetsConfig.get('manufactorName'),
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageSize: state.operation.assetsConfig.get('pageSize'),
        pageNum: state.operation.assetsConfig.get('pageNum'),
      }));
      yield put({
        type: assetConfigAction.getDeviceFactorsList,
        payload,
      });
    } else {
      message.error(`删除设备厂家失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* getDeviceModesList(action) { //获取设备型号列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceModesList}`;
  // const url = `/mock/v3/ledger/devicemodes/list`;
  try {
    const response = yield call(axios.post, url, { ...payload });
    if (response.data.code === '10000') {

      const total = response.data.data.pageCount || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          ...payload,
          deviceModesList: response.data.data.dataList || [],
          total,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* addDeviceModes(action) { //新建设备型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceModes}`;
  const nowTime = moment().utc().format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          // ...payload,
        },
      });
      const payload = yield select(state => ({
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageSize: state.operation.assetsConfig.get('pageSize'),
        pageNum: state.operation.assetsConfig.get('pageNum'),

      }));
      yield put({
        type: assetConfigAction.getDeviceModesList,
        payload,
      });
    } else {
      message.error(`添加设备型号失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* editDeviceModes(action) { //编辑设备型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.editDeviceModes}`;
  const nowTime = moment().utc().format();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          // ...payload,
        },
      });
      const payload = yield select(state => ({
        deviceModeName: state.operation.assetsConfig.get('deviceModeName'),
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageSize: state.operation.assetsConfig.get('pageSize'),
        pageNum: state.operation.assetsConfig.get('pageNum'),

      }));
      yield put({
        type: assetConfigAction.getDeviceModesList,
        payload,
      });
    } else {
      message.error(`编辑设备型号失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}
function* deleteDeviceModes(action) { //删除设备型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteDeviceModes}?modeId=${payload.modeId}`;
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.delete, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: assetConfigAction.changeAssetConfigStore,
        payload: {
          // ...payload,
        },
      });
      const payload = yield select(state => ({
        deviceModeName: state.operation.assetsConfig.get('deviceModeName'),
        orderField: state.operation.assetsConfig.get('orderField'),
        orderMethod: state.operation.assetsConfig.get('orderMethod'),
        pageSize: state.operation.assetsConfig.get('pageSize'),
        pageNum: state.operation.assetsConfig.get('pageNum'),
      }));
      yield put({
        type: assetConfigAction.getDeviceModesList,
        payload,
      });
    } else {
      message.error(`删除设备型号失败!${response.data.message}`);
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: assetConfigAction.changeAssetConfigStore,
      payload: { loading: false },
    });
  }
}

export function* watchBookAssetsConfig() {
  yield takeLatest(assetConfigAction.getAssetTree, getAssetTree);
  yield takeLatest(assetConfigAction.getNodeDetail, getNodeDetail);
  yield takeLatest(assetConfigAction.addAssetNode, addAssetNode);
  yield takeLatest(assetConfigAction.deleteAssetNode, deleteAssetNode);
  yield takeLatest(assetConfigAction.editAssetNode, editAssetNode);
  yield takeLatest(assetConfigAction.getDeviceFactorsList, getDeviceFactorsList);
  yield takeLatest(assetConfigAction.addDeviceFactors, addDeviceFactors);
  yield takeLatest(assetConfigAction.editDeviceFactors, editDeviceFactors);
  yield takeLatest(assetConfigAction.deleteDeviceFactors, deleteDeviceFactors);
  yield takeLatest(assetConfigAction.getDeviceModesList, getDeviceModesList);
  yield takeLatest(assetConfigAction.addDeviceModes, addDeviceModes);
  yield takeLatest(assetConfigAction.editDeviceModes, editDeviceModes);
  yield takeLatest(assetConfigAction.deleteDeviceModes, deleteDeviceModes);
}
