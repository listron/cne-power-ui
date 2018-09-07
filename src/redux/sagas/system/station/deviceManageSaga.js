import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceManageAction } from '../../../../constants/actionTypes/system/station/deviceManageAction';

function *changeDeviceManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
    payload,
  })
}

// api success => GET_DEVICE_MANAGE_FETCH_SUCCESS
// loading => DEVICE_MANAGE_FETCH

function *getEnterpriseDetail(action){ // 请求单个详细数据信息
  const { payload } = action;
  // const url = '/mock/system/enterprisDetail/12';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getEnterprisDetail}/${payload.enterpriseId}`
  try{
    yield put({ type:enterpriseAction.ENTERPRISE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  enterpriseAction.GET_ENTERPRISE_FETCH_SUCCESS,
      payload:{
        enterpriseDetail: response.data.data || {},
        showPage: 'detail',
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *ignoreEnterpirseEdit(action){ // 初次进入企业-不再提醒编辑企业详情
  const { payload } = action;
  const url = '/mock/system/ignoreDetail';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.saveEnterpriseDetail}`
  try{
    yield put({ type:enterpriseAction.ENTERPRISE_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  enterpriseAction.GET_ENTERPRISE_FETCH_SUCCESS,
      });
    }
  }catch(e){
    console.log(e);
  }
}


export function* watchDeviceManage() {
  yield takeLatest(deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, changeDeviceManageStore);
}

