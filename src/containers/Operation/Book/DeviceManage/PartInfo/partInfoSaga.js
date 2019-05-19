import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../../constants/path';
import { partInfoAction } from './partInfoAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* getDeviceTypeList(action) {  // 电站下设备类型
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getDeviceTypeList}/${payload.stationCode}`;
  const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload,});
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          deviceTypeList:response.data.data||[],
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}
function* getDeviceComList(action) {  // 设备下组件列表
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getDeviceComList}`;
  const url = `/mock/v3/ledger/assetslist`;

  try {
    const response = yield call(axios.post, url, { ...payload, });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          deviceComList:response.data.data||[],
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}
function* addPartInfo(action) {  // 添加组件
  const { payload } = action;
  // const url =`${APIBasePath}${operation.addPartInfo}`;
  const url = `/mock/v3/ledger/assetslist`;

  try {
    const response = yield call(axios.post, url, { ...payload, });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,    
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}
function* editPartInfo(action) {  // 编辑组件信息
  const { payload } = action;
  // const url =`${APIBasePath}${operation.editPartInfo}`;
  const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.put, url, { ...payload, });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,    
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}
function* getDetailPartInfo(action) {  // 组件信息详情
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getDetailPartInfo}/${payload.partsId}`;
  const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.get, url, );
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,    
          detailPartInfo:response.data.data||{}
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}
function* deletePartInfo(action) {  // 删除组件信息
  const { payload } = action;
  // const url =`${APIBasePath}${operation.deletePartInfo}/${payload.partsId}`;
  const url = `/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.get, url, );
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,    
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}

export function* watchBookAssetsConfig() {
  yield takeLatest(partInfoAction.getDeviceTypeList, getDeviceTypeList);
  yield takeLatest(partInfoAction.getDeviceComList, getDeviceComList);
  yield takeLatest(partInfoAction.addPartInfo, addPartInfo);
  yield takeLatest(partInfoAction.editPartInfo, editPartInfo);
  yield takeLatest(partInfoAction.getDetailPartInfo, getDetailPartInfo);
  yield takeLatest(partInfoAction.deletePartInfo, deletePartInfo);
// 电站下设备类型列表
// 设备下组件列表
// 添加组件信息
 // 添加组件信息
 // 组件信息详情
// 删除组件信息
 
}