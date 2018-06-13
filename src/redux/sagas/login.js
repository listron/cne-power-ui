import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';
import {message} from 'antd';
import {setCookie} from '../../utils';
import Config from '../../constants/config';
import Path from '../../constants/path';
import {
  BEGIN_FETCH,
  BEGIN_COUNT,
  STOP_TASK,
  UPDATE_COUNT,
  GET_COMPINFO_SAGA,
  GET_COMPINFO_SUCCESS,
  GET_COMPINFO_FAIL,
  LOGIN_SAGA,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  // CHECK_PHONE_SAGA,
  // CHECK_PHONE_FAIL,
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
  GET_SHOW_STATUS_SAGA,
  GET_SHOW_STATUS_SUCCESS,
  GET_SHOW_STATUS_FAIL,
  CHANGE_SHOW_STATUS_SAGA,
  CHANGE_SHOW_STATUS_SUCCESS,
  CHANGE_SHOW_STATUS_FAIL,
  // CHECK_PHONE_SU_SAGA,
  // CHECK_PHONE_SU_FAIL,
  CREATE_REGISTER_SAGA,
  CREATE_REGISTER_SUCCESS,
  CREATE_REGISTER_FAIL,
} from '../../constants/actionTypes/Login';

//根据域名获取企业信息
function* getCompInfo(action) {
  let url = Config.APIBasePath + Path.APISubPaths.getCompInfo;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, {domain: action.params.domain});
    if(response.data.success){
      yield put({ type: GET_COMPINFO_SUCCESS, data: response.data.result });      
      setCookie('enterpriseId',response.data.result.enterpriseId);
    }else{
      yield put({ type: GET_COMPINFO_FAIL, data:{error:response.data.error}});    
      message.error(response.data.error);        
    }
  } catch (e) {
    message.error(e)
  }
}

//登录
function* login(action){
  // let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.login;
  let url = Config.TokenBasePath;
  // Content-Type: application/x-www-form-urlencoded; charset=UTF-8
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        username: action.parmas.phone,
        password: action.parmas.password
      }),
    });
    if (response.data) {
      setCookie('authData',JSON.stringify(response.data));
      setCookie('phone',action.parmas.phone);
      setCookie('userName',response.data.result.userName);
      setCookie('userId',response.data.result.userId);
      yield put({ type: LOGIN_SUCCESS, data: response.data.result});
    } else {
      yield put({ type: LOGIN_FAIL, data:{error:response.data.error}});                        
    }
  } catch (e) {
    message.error(e)    
  }
}

// //验证手机号（修改密码）
// function* checkPhone(action){
//   let url = Config.APIBasePath + Path.APISubPaths.checkPhone;
//   yield put({ type: BEGIN_FETCH });
//   try{
//     const response = yield call(axios.post, url, {phone:action.parmas});
//     if (response.data.success){//手机号未注册，不能修改密码
//       yield put({ type: CHECK_PHONE_FAIL, phone:action.parmas});      
//     }else{//手机号注册过，可以修改密码，发送验证码
//       if(response.data.error === '手机号已注册'){
//         yield put({ type: SEND_CODE_SAGA, parmas:action.parmas});
//       }else{//提示其他错误
//         message.error(response.data.error);                        
//       }
//     }
//   }
//   catch (e) {
//     message.error(e)
//   }
// }

//发送验证码
function* sendCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.sendCode;
  try{
    const response = yield call(axios.post, url, {phone:action.parmas});
    if (response.data.success) {
      yield put({ type: SEND_CODE_SUCCESS, data:{
        phone: action.parmas.phone
      }});
      yield put({ type: BEGIN_COUNT, payload: 60});
    } else {
      yield put({ type: SEND_CODE_FAIL, data:{
        error:response.data.error,phone:action.parmas.phone
      }});
    }
  } catch (e) {
    message.error(e)    
  }
}

//验证验证码
function* checkCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.checkCode;
  yield put({ type: BEGIN_FETCH });
  try{    
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: CHECK_CODE_SUCCESS, data:{
        code:action.parmas.captcha
      }});     
    }else{
      yield put({ type: CHECK_CODE_FAIL, data:{
        error:response.data.error,code:action.parmas.captcha
      }});      
    }
  }
  catch (e) {
    message.error(e)
  }
}

//修改密码
function* changePSW(action){
  let url = Config.APIBasePath + Path.APISubPaths.changePassword;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: CHANGE_PSW_SUCCESS});      
    }else{
      yield put({ type: CHANGE_PSW_FAIL, data:{error:response.data.error}});            
    }
  }
  catch (e) {
    message.error(e)
  }
}

//通过link获取企业信息
function* getComInfoSu(action){
  let url = Config.APIBasePath + Path.APISubPaths.getCompInfoBylink;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,{linkCode:action.parmas});
    if (response.data.success){
      yield put({ type: GET_COMPINFO_SU_SUCCESS,data:response.data.result});            
    }else{
      yield put({ type: GET_COMPINFO_SU_FAIL, data:{error:response.data.error}});            
    }
  }
  catch (e) {
    message.error(e)
  }
}
// // 验证手机号(注册)
// function* checkPhoneSU(action){
//   let url = Config.APIBasePath + Path.APISubPaths.checkPhone;
//   yield put({ type: BEGIN_FETCH });
//   try{
//     const response = yield call(axios.post,url,{phone:action.parmas});
//     if (response.data.success){//手机号未注册，可以注册，发送验证码
//       yield put({ type: SEND_CODE_SAGA, parmas:action.parmas});
//     }else{//手机号注册过，不能再次注册
//       yield put({ type: CHECK_PHONE_SU_FAIL, data:{
//         phone:action.parmas,error:response.data.error
//       }});      
//     }
//   }
//   catch (e) {
//     message.error(e)
//   }
// }

//注册
function* signup(action){
  let url = Config.APIBasePath + Path.APISubPaths.signup;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: SIGNUP_SUCCESS,data:response.data.result});
      setCookie('phone',action.parmas.phone);
      setCookie('userName',response.data.result.userName);
      setCookie('userId',response.data.result.userId);
    }else{
      yield put({ type: SIGNUP_FAIL, data:{error:response.data.error}});            
    }
  }
  catch (e) {
    message.error(e)
  }
}
function* getShowStatus(action) {
  let url = Config.APIBasePath + Path.APISubPaths.getShowStatus;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: GET_SHOW_STATUS_SUCCESS, data:{status: response.data.result.status} });
    }else{
      yield put({ type: GET_SHOW_STATUS_FAIL });            
    }
  }
  catch (e) {
    message.error(e)
  }
}
function* changeShowStatus(action) {
  let url = Config.APIBasePath + Path.APISubPaths.changeShowStatus;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: CHANGE_SHOW_STATUS_SUCCESS, data:{status: response.data.result.status} });
    }else{
      yield put({ type: CHANGE_SHOW_STATUS_FAIL });            
    }
  }
  catch (e) {
    message.error(e)
  }
}
function* createRegister(action) {
  let url = Config.APIBasePath + Path.APISubPaths.createRegister;
  yield put({ type: BEGIN_FETCH });
  try{
    const response = yield call(axios.post,url,action.parmas);
    if (response.data.success){
      yield put({ type: CREATE_REGISTER_SUCCESS, data:{link: response.data.result.link} });
    }else{
      yield put({ type: CREATE_REGISTER_FAIL });            
    }
  }
  catch (e) {
    message.error(e)
  }
}
function* count(number) {
  let currNum = number;

  while (currNum >= 0) {
    console.log(currNum--);
    yield put({ type: UPDATE_COUNT, num:currNum--});
    yield delay(1000);
    if(currNum === 0) {
      yield put({ type: STOP_TASK });
    }
  }
}
export function* countSaga () {
  while (true) {
    const { payload: number } = yield take(BEGIN_COUNT);
    const countTaskId = yield fork(count, number);

    yield take(STOP_TASK);
    yield cancel(countTaskId);
  }
}
export function* watchGetCompInfo() {
  yield takeLatest(GET_COMPINFO_SAGA, getCompInfo);
}
export function* watchLogin(){
  yield takeLatest(LOGIN_SAGA, login);
}
// export function* watchCheckPhone(){
//   yield takeLatest(CHECK_PHONE_SAGA, checkPhone);
// }
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
// export function* watchCheckPhoneSU(){
//   yield takeLatest(CHECK_PHONE_SU_SAGA, checkPhoneSU)
// }
export function* watchGetShowStatus() {
  yield takeLatest(GET_SHOW_STATUS_SAGA, getShowStatus)
}
export function* watchChangeShowStatus() {
  yield takeLatest(CHANGE_SHOW_STATUS_SAGA, changeShowStatus)
}
export function* watchCreateRegister() {
  yield takeLatest(CREATE_REGISTER_SAGA, createRegister)
}