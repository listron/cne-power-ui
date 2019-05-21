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
function* getPartsAssetTree(action) {  // 生产资产树
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getAssetTree}`;
  const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment().utc();
  console.log('nowTime: ', nowTime);


  
  try {
    const response = yield call(axios.post, url, { ...payload, assetsParentId: '0', nowTime });
    if (response.data.code === '10000') {
      yield put({
     type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          assetList: response.data.data || [],
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
   type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false, assetList: [] },
    })
  }
}
function* getPartsFactorsList(action) { //获取组件厂家列表
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getDeviceFactorsList}`;
  const url = `/mock/v3/ledger/devicemanufactors/list`;
  try {
    const response = yield call(axios.post, url, { ...payload, });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          partsFactorsList: response.data.data || [],
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    })
  }
}
function* getfactorsPartsMode(action) { //获取某组件厂家下的设备型号
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getfactorsDeviceMode}/{payload.manufactorId}`;
  const url = `/mock/v3/ledger/devicemodes/manufactorId`;
  try {
    const response = yield call(axios.get, url,);
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
          factorsPartsMode: response.data.data || [],
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    })
  }
}
function* addPartsFactors(action) { //新建组件厂家
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceFactors}`;
  const nowTime = moment().utc();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
        },
      });
      const payload = yield select(state => ({
     
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
      
      }));
      yield put({
        type: partInfoAction.getPartsFactorsList,
        payload,
      })   
    }else{
      message.error(`新增组件厂家失败!${response.data.message}`);
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    })
  }
}
function* addPartsModes(action) { //新建组件型号
  const { payload } = action;
  const url = `${APIBasePath}${operation.addDeviceModes}`;
  const nowTime = moment().utc();
  // const url =`/mock/v3/ledger/assetslist`;
  try {
    const response = yield call(axios.post, url, { ...payload, nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          // ...payload,
        },
      });
      const payload = yield select(state => ({
        orderField: state.operation.partInfo.get('orderField'),
        orderMethod: state.operation.partInfo.get('orderMethod'),
      }));
      yield put({
        type: partInfoAction.getfactorsPartsMode,
        payload,
      })
    } else {
      message.error(`添加设备型号失败!${response.data.message}`);
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false },
    })
  }
}

export function* watchBookPartsInfo() {
  yield takeLatest(partInfoAction.getDeviceTypeList, getDeviceTypeList);
  yield takeLatest(partInfoAction.getDeviceComList, getDeviceComList);
  yield takeLatest(partInfoAction.addPartInfo, addPartInfo);
  yield takeLatest(partInfoAction.editPartInfo, editPartInfo);
  yield takeLatest(partInfoAction.getDetailPartInfo, getDetailPartInfo);
  yield takeLatest(partInfoAction.deletePartInfo, deletePartInfo);
  yield takeLatest(partInfoAction.getPartsAssetTree, getPartsAssetTree);
  yield takeLatest(partInfoAction.getPartsFactorsList, getPartsFactorsList);
  yield takeLatest(partInfoAction.getfactorsPartsMode, getfactorsPartsMode);
  yield takeLatest(partInfoAction.addPartsFactors, addPartsFactors);
  yield takeLatest(partInfoAction.addPartsModes, addPartsModes);
// 电站下设备类型列表
// 设备下组件列表
// 添加组件信息
 // 添加组件信息
 // 组件信息详情
// 删除组件信息
 
}