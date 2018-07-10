import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import Config from '../../../constants/config';
import { stringify } from 'qs';
import { setCookie } from '../../../utils';
import {
  LOGIN_FETCH,
  GET_LOGIN_SAGA,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
  SEND_CODE_SAGA,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAIL,
  CHECK_CODE_SAGA,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
  BEGIN_COUNT,
  
} from '../../../constants/actionTypes/preLoginAction';

//切换登录方式

//账号密码登录
function *getLogin(action){
  // let url = Path.basePaths.newAPIBasePath + Path.commonPaths.login;
  let url = Config.TokenBasePath;
  yield put({ type: LOGIN_FETCH });
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      header: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        username: action.params.userName,
        password: action.params.password,
      })
    });
    if(response.data){
      setCookie('authData',JSON.stringify(response.data));
      setCookie('phone', action.params.phone);
      setCookie('userName', response.data.loginUserName);
      // setCookie('userId', response.data.result.userId);

      yield put({ type: GET_LOGIN_SUCCESS, data: response.data});       
    } else{
      yield put({ type: GET_LOGIN_FAIL, data: {error: response.data.error }});        
    }
  } catch (e) {
    console.log(e);
  }
}
//获取短信验证码
function *sendCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.sendCode;
  try{
    const response = yield call(axios.post, url, {phone: action.params});
    if(response.data.success){
      yield put({ type: SEND_CODE_SUCCESS, data:{ phone: action.params.phone }});
      yield put({ type: BEGIN_COUNT, payload: 60});
    } else {
      yield put({ type: SEND_CODE_FAIL, data:{ error: response.data.error, phone: action.params.phone}})
    }
  }catch(e){
    console.log(e);
  }
}
//手机+验证码登录
function *checkCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.checkCode;
  yield put({ type: LOGIN_FETCH})
  try{
    const response = yield call( axios.post, url, action.params);
    if(response.data.success){
      yield put({ type: CHECK_CODE_SUCCESS, data:{ code: action.params.captcha}})
    }else{
      yield put({ type: CHECK_CODE_FAIL, data:{ error: response.data.error, code: action.params.captcha}})
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchLoginSaga() {
  yield takeLatest(GET_LOGIN_SAGA, getLogin);
}
export function* watchSendCode() {
  yield takeLatest(SEND_CODE_SAGA, sendCode);
}
export function* watchCheckCode() {
  yield takeLatest(CHECK_CODE_SAGA, checkCode);
}