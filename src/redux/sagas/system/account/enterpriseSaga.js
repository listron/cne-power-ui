import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';

import { enterpriseAction } from '../../../../constants/actionTypes/system/account/enterpriseAction';

//存储payload指定参数，替换reducer-store属性。
function *changeEnterpriseStore(action){
  const { payload } = action;
  yield put({
    type:  enterpriseAction.CHANGE_ENTERPRISE_STORE,
    payload,
  })
}

//请求企业列表数据--暂不删除，以后可能恢复企业列表
/*
  function *getEnterprisList(action){
    const { payload } = action;
    const url = '/mock/system/enterprisList';
    // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getEnterprisList}/${payload.userID}`
    try{
      yield put({ type:enterpriseAction.ENTERPRISE_FETCH });
      const response = yield call(axios.get,url);
      yield put({
        type:  enterpriseAction.GET_ENTERPRISE_FETCH_SUCCESS,
        payload:{
          ...payload,
          enterpriseData: response.data.data.enterpriseData,
          totalNum: response.data.data.totalNum,
        },
      });
    }catch(e){
      console.log(e);
    }
  }
*/

//请求单个详细数据信息
function *getEnterpriseDetail(action){
  const { payload } = action;
  // const url = '/mock/system/enterprisDetail/12';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getEnterprisDetail}/${payload.enterpriseId}`
  try{
    yield put({ type:enterpriseAction.ENTERPRISE_FETCH });
    const response = yield call(axios.get,url);
    console.log(response);
    yield put({
      type:  enterpriseAction.GET_ENTERPRISE_FETCH_SUCCESS,
      payload:{
        enterpriseDetail: response.data.data,
        showPage: 'detail',
      },
    });
  }catch(e){
    console.log(e);
  }
}
//初次进入企业-不再提醒编辑企业详情
function *ignoreEnterpirseEdit(action){
  const { payload } = action;
  const url = '/mock/system/ignoreDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.saveEnterpriseDetail}`
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
//新建+编辑企业信息
function *saveEnterpriseInfor(action){
  const { payload } = action;
  // const url = '/mock/system/changeEnterprise';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.saveEnterpriseDetail}`
  try{
    yield put({ type:enterpriseAction.ENTERPRISE_FETCH });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA,
        payload:{
          enterpriseId: payload.enterpriseId
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}


export function* watchEnterprise() {
  yield takeLatest(enterpriseAction.CHANGE_ENTERPRISE_STORE_SAGA, changeEnterpriseStore);
  // yield takeLatest(enterpriseAction.GET_ENTERPRISE_LIST_SAGA, getEnterprisList);
  yield takeLatest(enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA, getEnterpriseDetail);
  yield takeLatest(enterpriseAction.SAVE_ENTERPRISE_INFO_SAGA, saveEnterpriseInfor);
  yield takeLatest(enterpriseAction.IGNORE_ENTERPRISE_EDIT,ignoreEnterpirseEdit);

}

