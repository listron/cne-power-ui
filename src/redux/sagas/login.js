import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {message} from 'antd';
import {setCookie} from '../../utils';
import {
  GET_COMINFO_SAGA,
  GET_COMINFO_SUCCESS,
  GET_COMINFO_FAIL,
  GET_LOGIN_SAGA,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
  CHECK_PHONE_SAGA,
  CHECK_PHONE_SUCCESS,
  CHECK_PHONE_FAIL,
  GET_CODE_SAGA,
  GET_CODE_SUCCESS,
  GET_CODE_FAIL,
  CHECK_CODE_SAGE,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
  CHANGE_PSW_SAGA,
  CHANGE_PSW_SUCCESS,
  CHANGE_PSW_FAIL,
} from '../../constants/actionTypes/Login';

import {
  LOGIN_COMINFO,
  LOGIN_API_URL,
  CHECK_PHONE_URL,
  GET_CODE_URL,
  LOGOUT_URL,
  CHECK_CODE_URL,
  GET_RGLINK_URL,
  GET_COMINFO_BYLINK_URL,
  CHANGE_PSW_URL,
} from '../../constants/url';

//根据域名获取企业信息
function* showLoginAsync(action) {
  let type = action.type;
  try {
    const response = yield call(axios.post, LOGIN_COMINFO,action.parmas);
    if(response.data.success){
      yield put({ type: GET_COMINFO_SUCCESS, domain: response.data.result });      
      setCookie('enterpriseId',response.data.result.enterpriseId);
    }else{
      yield put({ type: GET_COMINFO_FAIL, error_msg:response.data.error});    
      message.error(response.data.error);        
    }
  } catch (e) {
    message.error(e)
  }
}

//登录
function* getLoginAsync(action){
  let type = action.type;
  try{
    const response = yield call(axios.post,LOGIN_API_URL,`phone=${action.parmas.phone}&password=${action.parmas.password}`);
    if (response.data.success) {
      setCookie('phone',action.parmas.phone);
      setCookie('userName',response.data.result.userName);
      setCookie('userId',response.data.result.userId);
      yield put({ type: GET_LOGIN_SUCCESS, login: response.data.result});
    } else {
      yield put({ type: GET_LOGIN_FAIL, error_msg:response.data.error});                        
    }
  } catch (e) {
    message.error(e)    
  }
}

//验证手机号
function* checkPhoneAsync(action){
  try{
    const response = yield call(axios.post,CHECK_PHONE_URL,`phone=${action.parmas}`);
    if (response.data.success){//手机号未注册，不能修改密码
      yield put({ type: CHECK_PHONE_FAIL, phone:{phone:action.parmas,error_msg:response.data.error}});      
    }else{//手机号注册过，可以修改密码
      if(response.data.error == '手机号已注册'){
        yield put({ type: GET_CODE_SAGA, parmas:action.parmas});
        // getCodeAsync(action.parmas);
      }else{//提示其他错误
        message.error(response.data.error);                        
      }
    }
  }
  catch (e) {
    message.error(e)
  }
}

//发送验证码
function* getCodeAsync(action){
  try{
    const response = yield call(axios.post,GET_CODE_URL,`phone=${action.parmas}`);
    if (response.data.success) {
      yield put({ type: GET_CODE_SUCCESS, phone: {phone:action.parmas}});
    } else {
      yield put({ type: GET_CODE_FAIL, phone:{error_msg:response.data.error,phone:action.parmas}});
      // message.error(response.data.error);                        
    }
  } catch (e) {
    message.error(e)    
  }
}

//验证验证码
function* checkCodeAsync(action){
  console.log(action)
  try{
    const response = yield call(axios.post,CHECK_CODE_URL,`phone=${action.parmas.phone}&captcha=${action.parmas.captcha}`);
    if (response.data.success){
      yield put({ type: CHECK_CODE_SUCCESS, code:{code:action.parmas.captcha,phone:action.parmas.phone}});      
    }else{
      yield put({ type: CHECK_CODE_FAIL, code:{error_msg:response.data.error,code:action.parmas.captcha}});      
    }
  }
  catch (e) {
    message.error(e)
  }
}

//修改密码
function* changePSWAsync(action){
  try{
    const response = yield call(axios.post,CHANGE_PSW_URL,`phone=${this.props.phone}&password=${values.password}&confirmPwd=${values.confirmPwd}`);
    if (response.data.success){
      yield put({ type: CHANGE_PSW_SUCCESS});      
    }else{
      yield put({ type: CHANGE_PSW_FAIL, error_msg:response.data.error});      
    }
  }
  catch (e) {
    message.error(e)
  }
}
export function* getComInfo() {
  yield takeLatest('GET_COMINFO_SAGA', showLoginAsync);
}
export function* getLogin(){
  yield takeLatest('GET_LOGIN_SAGA',getLoginAsync);
}
export function* checkPhone(){
  yield takeLatest('CHECK_PHONE_SAGA',checkPhoneAsync);
}
export function* getCode(){
  yield takeLatest('GET_CODE_SAGA',getCodeAsync);
}
export function* checkCode(){
  yield takeLatest('CHECK_CODE_SAGA',checkCodeAsync);
}
export function* changePSW(){
  yield takeLatest('CHANGE_PSW_SAGA', changePSWAsync);
}