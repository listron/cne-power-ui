import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import {
  ENTERPRISE_FETCH,

  CHANGE_ENTERPRISE_PAGE,
  CHANGE_ENTERPRISE_PAGE_SAGA,

  GET_ENTERPRISE_LIST_SAGA,
  GET_ENTERPRISE_LIST_SUCCESS,

  CHANGE_SELECTED_ENTERPRISE_SAGA,
  CHANGE_SELECTED_ENTERPRISE_SUCCESS,
} from '../../../constants/actionTypes/systemManage/enterpriseAction';

//切换页面->列表页，新建/编辑页,详情页
function *changeEnterprisePage(action){
  const { payload } = action;
  yield put({
    type:  CHANGE_ENTERPRISE_PAGE,
    payload,
  })
}

//请求企业列表数据
function *getEnterprisList(action){
  const { payload } = action;
  const url = '/mock/systemManage/enterprisList';
  try{
    yield put({ type:ENTERPRISE_FETCH });
    const response = yield call(axios.post,url,payload);
    console.log(response)
    yield put({
      type:  GET_ENTERPRISE_LIST_SUCCESS,
      payload,
    });
  }catch(e){
    console.log(e);
  }
}
//新建+编辑企业信息
function *changeEnterprise(action){
  const { payload } = action;
  const url = '/mock/systemManage/changeEnterprise';
  try{
    yield put({ type:ENTERPRISE_FETCH });
    const response = yield call(axios.post,url,payload);
    console.log(response)
    yield put({
      type:  CHANGE_SELECTED_ENTERPRISE_SUCCESS,
      payload,
    });
  }catch(e){
    console.log(e);
  }
}



export function* watchEnterpriseSaga() {
  yield takeLatest(CHANGE_ENTERPRISE_PAGE_SAGA, changeEnterprisePage);
  yield takeLatest(GET_ENTERPRISE_LIST_SAGA, getEnterprisList);
  yield takeLatest(CHANGE_SELECTED_ENTERPRISE_SAGA, changeEnterprise);
}

