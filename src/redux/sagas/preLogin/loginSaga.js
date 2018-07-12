import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import Config from '../../../constants/config';
import { stringify } from 'qs';
import { setCookie } from '../../../utils';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

//切换登录方式

//账号密码登录
function *getLogin(action){
  // let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.login;
  let url = "/mock/api/v3/login";
  yield put({ type: PreLoginAction.LOGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      setCookie('authData',JSON.stringify(response.data.access_token));
      setCookie('phone', action.params.phone);
      setCookie('userName', response.data.loginUserName);
      // setCookie('userId', response.data.result.userId);
      yield put({ type: PreLoginAction.GET_LOGIN_SUCCESS, data: response.data});       
    } else{
      yield put({ type: PreLoginAction.GET_LOGIN_FAIL, data: {error: response.data.message }});        
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
      yield put({ type: PreLoginAction.SEND_CODE_SUCCESS, data:{ phone: action.params.phone }});
    } else {
      yield put({ type: PreLoginAction.SEND_CODE_FAIL, data:{ error: response.data.error, phone: action.params.phone}})
    }
  }catch(e){
    console.log(e);
  }
}
//手机+验证码登录
function *checkCode(action){
  // let url = Config.APIBasePath + Path.APISubPaths.loginPhoneCode;
  let url = "/mock/api/v3/login/phonecode";
  yield put({ type: PreLoginAction.LOGIN_FETCH})
  try{
    const response = yield call( axios.post, url, action.params);
    console.log(response)
    if(response.data.success){
      yield put({ type: PreLoginAction.CHECK_CODE_SUCCESS, data:{ code: action.params.captcha}})
    }else{
      yield put({ type: PreLoginAction.CHECK_CODE_FAIL, data:{ error: response.data.error, code: action.params.captcha}})
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchLoginSaga() {
  yield takeLatest(PreLoginAction.GET_LOGIN_SAGA, getLogin);
}
export function* watchVerificationCode() {
  yield takeLatest(PreLoginAction.SEND_CODE_SAGA, getVerificationCode);
}
export function* watchCheckCode() {
  yield takeLatest(PreLoginAction.CHECK_CODE_SAGA, checkCode);
}