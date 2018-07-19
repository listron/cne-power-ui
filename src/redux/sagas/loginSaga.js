import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import Config from '../../constants/config';
import { setCookie } from '../../utils';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import { message } from 'antd';

//请求改变store属性
function *changeLoginStore(action){
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
  console.log(action)
  yield put({ type: LoginAction.LOGIN_FETCH})
  try{
    const response = yield call( axios.post, url, action.params);
    console.log(response)
    if(response.data.code === "10000"){
      yield put({ type: LoginAction.CHECK_CODE_SUCCESS, data:{ phoneNum: action.params.phoneNum}})
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
  let url = '/mock/api/v3/login/enterprisedomain/';
  try{
    const response = yield call(axios.get, url, action.params.enterpriseDomain);
    if(response.data.code === '10000'){
      yield put({type: LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS, data: response.data.data});
      yield put({type: LoginAction.CHECK_ENTERPRISE_NAME_SAGA, 'params': action.params})
    }else{
      yield put({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL, data: {error: response.data.message}})
    }
  }catch(e){
    console.log(e)
  }
}

// 验证企业名是否已注册
function *checkEnterpriseName(action){
  let url = '/mock/api/v3/login/enterprise/';
  try{
    const response = yield call(axios.get, url, action.params.enterpriseName);
    if(response.data.code === '10000'){
      yield put({ type: LoginAction.CHECK_ENTERPRISE_NAME_SUCCESS, data: response.data.data})
    }else{
      yield put({ type: LoginAction.CHECK_ENTERPRISE_NAME_FAIL})
    }
  }catch(e){
    console.log(e)
  }
}
// 获取企业信息
function *getEnterPriseInfo(action){
  const { payload } = action;
  const url = '/mock/api/v3/login/enterpriseinfo';
  try{
    yield put({ type: LoginAction.JOININ_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: LoginAction.GET_ENTERPRISE_INFO_SUCCESS,
      payload: {
        ...payload,
        data: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

// 加入企业
function *joinEnterprise(action){
  const { payload } = action;
  const url = '/mock/api/v3/login/userenterprise';
  try{
    yield put({ type: LoginAction.JOININ_FETCH });
    const response = yield call(axios.get, url, payload);
    yield put({
      type: LoginAction.GET_JOININ_COMMON_SUCCESS,
      payload: {
        ...payload,
        data: response.data.data,
        
      }
    })
  }catch(e){
    console.log(e);
  }
}

// 设置新密码
function *resetPassword(action){
  let url = "/mock/api/v3/login/password";
  yield put({type: LoginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios.post, url, action.params);
    console.log(response);
    if(response.data.code === "10000"){
      message.success('密码设置成功，请重新登录！')
      yield put({ type: LoginAction.RESET_PASSWORD_SUCCESS})
    }else{
      yield put({ type: LoginAction.RESET_PASSWORD_FAIL})
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchLogin() {
  yield takeLatest(LoginAction.GET_LOGIN_SAGA, getLogin);
  yield takeLatest(LoginAction.SEND_CODE_SAGA, getVerificationCode);
  yield takeLatest(LoginAction.CHECK_CODE_SAGA, checkCode);
  yield takeLatest(LoginAction.CHANGE_LOGIN_PAGE_SAGA, changeLoginStore);
  yield takeLatest(LoginAction.CHECK_PHONE_REGISTER_SAGA, checkPhoneRegister);
  yield takeLatest(LoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, checkEnterpriseDomain);
  yield takeLatest(LoginAction.GET_ENTERPRISE_INFO_SAGA, getEnterPriseInfo);
  yield takeLatest(LoginAction.JOIN_ENTERPRISE_SAGA, joinEnterprise);
  yield takeLatest(LoginAction.RESET_PASSWORD_SAGA, resetPassword);
  yield takeLatest(LoginAction.CHECK_ENTERPRISE_NAME_SAGA, checkEnterpriseName);
}