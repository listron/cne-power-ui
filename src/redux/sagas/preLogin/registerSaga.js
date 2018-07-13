import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import Config from '../../../constants/config';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

// 注册验证第一步
function *checkPhoneRegister(action){
  let url = "/mock/api/v3/login/phoneregister";
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({type: PreLoginAction.CHECK_PHONE_REGISTER_SUCCESS, data: response.data})
    }else{
      yield put({type: PreLoginAction.CHECK_PHONE_REGISTER_FAIL, data: {error: response.data.message}})
    }
  }catch(e){
    console.log(e);
  }
}

// 验证企业域名是否有效
function *checkEnterpriseDomain(action){
  let url = '/mock/api/v3/login/enterprisedomain';
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({ type: PreLoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS, data: response.data})
    }else{
      yield put({ type: PreLoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL, data: {error: response.data.message}})
    }
  }catch(e){
    console.log(e)
  }
}

export function* watchCheckPhoneRegister(){
  yield takeLatest(PreLoginAction.CHECK_PHONE_REGISTER_SAGA, checkPhoneRegister);
}
export function* watchCheckEnterpriseDomain(){
  yield takeLatest(PreLoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, checkEnterpriseDomain);
}