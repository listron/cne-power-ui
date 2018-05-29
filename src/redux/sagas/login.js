import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {message} from 'antd';
import {setCookie} from '../../utils';
import Config from '../../constants/config';
import Path from '../../constants/path';
import {
  GET_COMPINFO_SAGA,
  GET_COMPINFO_SUCCESS,
  GET_COMPINFO_FAIL,
  LOGIN_SAGA,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CHECK_PHONE_SAGA,
  CHECK_PHONE_FAIL,
  SEND_CODE_SAGA,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAIL,
  CHECK_CODE_SAGA,
  CHECK_CODE_SUCCESS,
  CHECK_CODE_FAIL,
  CHANGE_PSW_SAGA,
  CHANGE_PSW_SUCCESS,
  CHANGE_PSW_FAIL,
  GET_COMPINFO_SU_SAGA,
  GET_COMPINFO_SU_SUCCESS,
  GET_COMPINFO_SU_FAIL,
  SIGNUP_SAGA,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CHECK_PHONE_SU_SAGA,
  CHECK_PHONE_SU_FAIL
} from '../../constants/actionTypes/Login';

//根据域名获取企业信息
function* getCompInfo(action) {
  let url = Config.APIBasePath + Path.APISubPaths.getCompInfo;
  try {
    const response = yield call(axios.post, url, action.parmas);
    if(response.data.success){
      yield put({ type: GET_COMPINFO_SUCCESS, domain: response.data.result });      
      setCookie('enterpriseId',response.data.result.enterpriseId);
    }else{
      yield put({ type: GET_COMPINFO_FAIL, error:response.data.error});    
      message.error(response.data.error);        
    }
  } catch (e) {
    message.error(e)
  }
}

//登录
function* login(action){
  let url = Config.APIBasePath + Path.APISubPaths.login;
  try{
    const response = yield call(axios.post, url, `phone=${action.parmas.phone}&password=${action.parmas.password}`);
    if (response.data.success) {
      setCookie('phone',action.parmas.phone);
      setCookie('userName',response.data.result.userName);
      setCookie('userId',response.data.result.userId);
      yield put({ type: LOGIN_SUCCESS, login: response.data.result});
    } else {
      yield put({ type: LOGIN_FAIL, error:response.data.error});                        
    }
  } catch (e) {
    message.error(e)    
  }
}

//验证手机号（修改密码）
function* checkPhone(action){
  let url = Config.APIBasePath + Path.APISubPaths.checkPhone;
  try{
    const response = yield call(axios.post, url, `phone=${action.parmas}`);
    if (response.data.success){//手机号未注册，不能修改密码
      yield put({ type: CHECK_PHONE_FAIL, phone:{phone:action.parmas,error:response.data.error}});      
    }else{//手机号注册过，可以修改密码，发送验证码
      if(response.data.error === '手机号已注册'){
        yield put({ type: SEND_CODE_SAGA, parmas:action.parmas});
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
function* sendCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.sendCode;
  try{
    const response = yield call(axios.post, url, `phone=${action.parmas}`);
    if (response.data.success) {
      yield put({ type: SEND_CODE_SUCCESS, phone: {phone:action.parmas}});
    } else {
      yield put({ type: SEND_CODE_FAIL, phone:{error:response.data.error,phone:action.parmas}});
    }
  } catch (e) {
    message.error(e)    
  }
}

//验证验证码
function* checkCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.checkCode;
  try{
    const response = yield call(axios.post,url,`phone=${action.parmas.phone}&captcha=${action.parmas.captcha}`);
    if (response.data.success){
      yield put({ type: CHECK_CODE_SUCCESS, code:{code:action.parmas.captcha,phone:action.parmas.phone}});      
    }else{
      yield put({ type: CHECK_CODE_FAIL, code:{error:response.data.error,code:action.parmas.captcha}});      
    }
  }
  catch (e) {
    message.error(e)
  }
}

//修改密码
function* changePSW(action){
  let url = Config.APIBasePath + Path.APISubPaths.changePassword;
  try{
    const response = yield call(axios.post,url,`phone=${action.parmas.phone}&password=${action.parmas.password}&confirmPwd=${action.parmas.confirmPwd}`);
    if (response.data.success){
      yield put({ type: CHANGE_PSW_SUCCESS});      
    }else{
      yield put({ type: CHANGE_PSW_FAIL, error:response.data.error});            
    }
  }
  catch (e) {
    message.error(e)
  }
}

//通过link获取企业信息
function* getComInfoSu(action){
  let url = Config.APIBasePath + Path.APISubPaths.getCompInfoBylink;
  try{
    const response = yield call(axios.post,url,`linkCode=${action.parmas}`);
    if (response.data.success){
      yield put({ type: GET_COMPINFO_SU_SUCCESS,info:response.data.result});            
    }else{
      yield put({ type: GET_COMPINFO_SU_FAIL, error:response.data.error});            
    }
  }
  catch (e) {
    message.error(e)
  }
}
//验证手机号(注册)
function* checkPhoneSU(action){
  let url = Config.APIBasePath + Path.APISubPaths.checkPhone;
  try{
    const response = yield call(axios.post,url,`phone=${action.parmas}`);
    console.log(response)
    if (response.data.success){//手机号未注册，可以注册，发送验证码
      yield put({ type: SEND_CODE_SAGA, parmas:action.parmas});
    }else{//手机号注册过，不能再次注册
      yield put({ type: CHECK_PHONE_SU_FAIL, phone:{phone:action.parmas,error:response.data.error}});      
    }
  }
  catch (e) {
    message.error(e)
  }
}

//注册
function* signup(action){
  let url = Config.APIBasePath + Path.APISubPaths.signup;
  try{
    const response = yield call(axios.post,url,`enterpriseId=${action.parmas.enterpriseId}&phone=${action.parmas.phone}&captcha=${action.parmas.captcha}&realName=${action.parmas.realName}&password=${action.parmas.password}&confirmPwd=${action.parmas.confirmPwd}`);
    if (response.data.success){
      yield put({ type: SIGNUP_SUCCESS,signup:response.data.result});
      setCookie('phone',action.parmas.phone);
      setCookie('userName',response.data.result.userName);
      setCookie('userId',response.data.result.userId);
    }else{
      yield put({ type: SIGNUP_FAIL, error:response.data.error});            
    }
  }
  catch (e) {
    console.log(e)
    message.error(e)
  }
}
export function* watchGetCompInfo() {
  yield takeLatest(GET_COMPINFO_SAGA, getCompInfo);
}
export function* watchLogin(){
  yield takeLatest(LOGIN_SAGA, login);
}
export function* watchCheckPhone(){
  yield takeLatest(CHECK_PHONE_SAGA, checkPhone);
}
export function* watchSendCode(){
  yield takeLatest(SEND_CODE_SAGA, sendCode);
}
export function* watchCheckCode(){
  yield takeLatest(CHECK_CODE_SAGA, checkCode);
}
export function* watchChangePSW(){
  yield takeLatest(CHANGE_PSW_SAGA, changePSW);
}
export function* watchGetComInfoSu(){
  yield takeLatest(GET_COMPINFO_SU_SAGA,getComInfoSu)
}
export function* watchSignup(){
  yield takeLatest(SIGNUP_SAGA, signup)
}
export function* watchCheckPhoneSU(){
  yield takeLatest(CHECK_PHONE_SU_SAGA, checkPhoneSU)
}