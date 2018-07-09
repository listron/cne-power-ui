import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import {
  ENTERPRISE_FETCH,

  GET_ENTERPRISE_ATTR_CHANGE_SAGA,
  GET_ENTERPRISE_ATTR_CHANGE_SUCCESS,
  GET_ENTERPRISE_COMMON_FETCH_SUCCESS,

  GET_ENTERPRISE_LIST_SAGA,  
  CHANGE_SELECTED_ENTERPRISE_SAGA,
  
} from '../../../constants/actionTypes/system/enterpriseAction';

//切换页面->列表页，新建/编辑页,详情页
function *changeEnterpriseAttr(action){
  const { payload } = action;
  yield put({
    type:  GET_ENTERPRISE_ATTR_CHANGE_SUCCESS,
    payload,
  })
}

//请求企业列表数据
function *getEnterprisList(action){
  const { payload } = action;
  const url = '/mock/system/enterprisList';
  try{
    yield put({ type:ENTERPRISE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  GET_ENTERPRISE_COMMON_FETCH_SUCCESS,
      payload:{
        ...payload,
        enterpriseList: response.data.data.enterpriseList
      },
    });
  }catch(e){
    console.log(e);
  }
}

//请求单个电站详细数据信息

//新建+编辑企业信息
function *changeEnterprise(action){
  const { payload } = action;
  const url = '/mock/system/changeEnterprise';
  try{
    yield put({ type:ENTERPRISE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  GET_ENTERPRISE_COMMON_FETCH_SUCCESS,
      payload,
    });
  }catch(e){
    console.log(e);
  }
}



export function* watchEnterpriseSaga() {
  yield takeLatest(GET_ENTERPRISE_ATTR_CHANGE_SAGA, changeEnterpriseAttr);
  yield takeLatest(GET_ENTERPRISE_LIST_SAGA, getEnterprisList);
  yield takeLatest(CHANGE_SELECTED_ENTERPRISE_SAGA, changeEnterprise);
}

