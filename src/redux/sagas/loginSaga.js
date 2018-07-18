import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import Config from '../../constants/config';
import { setCookie } from '../../utils';
import { LoginAction } from '../../constants/actionTypes/loginAction';

//切换登录方式

//切换页面
function *changePreLogin(action){
  const { params } = action;
  yield put({
    type: LoginAction.CHANGE_LOGIN_PAGE,
    params,
  })
}

//账号密码登录
function *getLogin(action){
  // let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.login;
  let url = "/mock/api/v3/login";
  yield put({ type: LoginAction.LOGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      setCookie('authData',JSON.stringify(response.data.access_token));
      setCookie('phone', action.params.phone);
      setCookie('userName', response.data.loginUserName);
      // setCookie('userId', response.data.result.userId);
      yield put({ type: LoginAction.GET_LOGIN_SUCCESS, data: response.data});       
    } else{
      yield put({ type: LoginAction.GET_LOGIN_FAIL, data: {error: response.data.message }});        
    }
  } catch (e) {
    console.log(e);
  }
}
//获取短信验证码
function *getVerificationCode(action){
  // let url = Config.APIBasePath + Path.APISubPaths.getVerificationCode;
  let url = "/mock/api/v3/login/verificationcode/";
  try{
    const response = yield call(axios.get, url, {phoneNum: action.params});
    if(response.data.code === "10000"){
      yield put({ type: LoginAction.SEND_CODE_SUCCESS, data:{ phone: action.params.phone }});
    } else {
      yield put({ type: LoginAction.SEND_CODE_FAIL, data:{ error: response.data.error, phone: action.params.phone}})
    }
  }catch(e){
    console.log(e);
  }
}
//手机+验证码登录
function *checkCode(action){
  // let url = Config.APIBasePath + Path.APISubPaths.loginPhoneCode;
  let url = "/mock/api/v3/login/phonecode";
  yield put({ type: LoginAction.LOGIN_FETCH})
  try{
    const response = yield call( axios.post, url, action.params);
    console.log(response)
    if(response.data.success){
      yield put({ type: LoginAction.CHECK_CODE_SUCCESS, data:{ code: action.params.captcha}})
    }else{
      yield put({ type: LoginAction.CHECK_CODE_FAIL, data:{ error: response.data.error, code: action.params.captcha}})
    }
  }catch(e){
    console.log(e);
  }
}

// 注册验证第一步
function *checkPhoneRegister(action){
  let url = "/mock/api/v3/login/phoneregister";
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({type: LoginAction.CHECK_PHONE_REGISTER_SUCCESS, data: response.data})
    }else{
      yield put({type: LoginAction.CHECK_PHONE_REGISTER_FAIL, data: {error: response.data.message}})
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
      yield put({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS, data: response.data})
    }else{
      yield put({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL, data: {error: response.data.message}})
    }
  }catch(e){
    console.log(e)
  }
}

export function* watchLogin() {
  yield takeLatest(LoginAction.GET_LOGIN_SAGA, getLogin);
}
export function* watchVerificationCode() {
  yield takeLatest(LoginAction.SEND_CODE_SAGA, getVerificationCode);
}
export function* watchCheckCode() {
  yield takeLatest(LoginAction.CHECK_CODE_SAGA, checkCode);
}
export function* watchLoginPageChange() {
  yield takeLatest( LoginAction.CHANGE_LOGIN_PAGE_SAGA, changePreLogin);
}

export function* watchCheckPhoneRegister(){
  yield takeLatest(LoginAction.CHECK_PHONE_REGISTER_SAGA, checkPhoneRegister);
}
export function* watchCheckEnterpriseDomain(){
  yield takeLatest(LoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, checkEnterpriseDomain);
}