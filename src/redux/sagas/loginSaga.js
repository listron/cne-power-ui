import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import moment from 'moment';
import { stringify } from 'qs';
import { setCookie, getCookie } from '../../utils';
import { LoginAction } from '../../constants/actionTypes/loginAction';
import { CommonAction } from '../../constants/actionTypes/commonAction';
import { message } from 'antd';

message.config({
  maxCount: 1,
});

// 改变loginStore
function *changeLoginStore(action){
  let { params } = action;
  yield put({
    type: LoginAction.CHANGE_LOGIN_STORE,
    params,
  })
}

//账号密码登录
function *getLogin(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.login;
  yield put({ type: LoginAction.LOGIN_FETCH });
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        username: action.params.username,
        password: action.params.password,
      }),
    });
    if(response.data.code === '10000'){
      setCookie('authData',JSON.stringify(response.data.data.access_token));
      setCookie('enterpriseId', response.data.data.enterpriseId);
      setCookie('phoneNum', action.params.phoneNum);
      setCookie('username', response.data.data.username);
      setCookie('expireData', moment().add(response.data.data.expires_in, 'seconds'));
      setCookie('isNotLogin', 0);
      yield put({ type: LoginAction.GET_LOGIN_SUCCESS, data: response.data.data});
      yield put({ 
        type: CommonAction.CHANGE_COMMON_STORE_SAGA, 
        payload: {
          enterpriseId: response.data.data.enterpriseId,
          enterpriseName: response.data.data.enterpriseName,
        }
      });
      action.params.history.push('/');

      // yield put({ type: LoginAction.GET_COMMON_DATA_SAGA});   
    } else{
      // 此处先这样写，等后端改过来返回具体的error状态信息后再根据error返回具体信息
      yield put({ type: LoginAction.GET_LOGIN_FAIL, data: response.data }); 
      message.error(response.data.message);       
    }
  } catch (e) {
    console.log(e);
  }
}
//获取短信验证码
function *getVerificationCode(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.getVerificationCode + '/' +action.params.phoneNum;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({ type: LoginAction.SEND_CODE_SUCCESS, params: action.params });
    } else {
      message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}
//手机+验证码登录
function *checkCode(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.loginPhoneCode;
  let { params } =action;
  yield put({ type: LoginAction.LOGIN_FETCH})
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        phoneNum: action.params.phoneNum,
        verificationCode: action.params.verificationCode,
      }),
    });
    if(response.data.code === '10000'){ 
      if(action.params.isNotLogin === 1 || response.data.data.enterpriseId !== null) {
        setCookie('authData',JSON.stringify(response.data.data.access_token));
        setCookie('phoneNum', action.params.phoneNum);
        setCookie('username', response.data.data.username);
        setCookie('enterpriseId', response.data.data.enterpriseId);
        setCookie('expireData', moment().add(response.data.data.expires_in, 'seconds'));
        setCookie('isNotLogin', action.params.isNotLogin);
      }
      if(action.params.isNotLogin === 0 && response.data.data.enterpriseId !== null) {
        action.params.history.push('/');
      }
      yield put({
        type: LoginAction.CHECK_CODE_SUCCESS,
        params: {
          ...params,
          data: response.data.data,
        },    
      });
      yield put({ 
        type: CommonAction.CHANGE_COMMON_STORE_SAGA, 
        payload: {
          enterpriseId: response.data.data.enterpriseId,
          enterpriseName: response.data.data.enterpriseName,
        }
      });
    }else{
      yield put({ type: LoginAction.CHECK_CODE_FAIL, data: response.data })
      // message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}

// 验证手机号和验证码是否正确（加入企业/注册企业，手机验证码正确会调用手机号验证码登录获取token）
function *phoneCodeRegister(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.phoneCodeRegister;
  try{
    const response = yield call(axios.post, url, {
      phoneNum: action.params.phoneNum, 
      verificationCode: action.params.verificationCode
    });
    if(response.data.code === '00000' || response.data.code === '20001'){
      yield put({type: LoginAction.PHONE_CODE_REGISTER_FAIL, data: response.data})
    }else{
      yield put({type: LoginAction.CHECK_CODE_SAGA, params: action.params})
      yield put({
        type: LoginAction.PHONE_CODE_REGISTER_SUCCESS,
        params: action.params,
      })
    }
  }catch(e){
    console.log(e);
  }
}
// 注册验证手机号是否已存在(此接口暂时弃用)
function *checkPhoneRegister(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.loginPhoneRegister + '/' + action.params;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({type: LoginAction.CHECK_PHONE_REGISTER_SUCCESS, data: response.data.data})
    }else{
      yield put({type: LoginAction.CHECK_PHONE_REGISTER_FAIL, data: {error: response.data.message}})
    }
  }catch(e){
    console.log(e);
  }
}

// 验证企业域名是否有效
function *checkEnterpriseDomain(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.checkEnterpriseDomain + '/' +action.params.enterpriseDomain;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: LoginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS, 
        params: action.params,
        data: response.data.data,
      });
      if(response.data.data.isRegister === '1') {
        yield put({type: LoginAction.CHECK_ENTERPRISE_NAME_SAGA, params: action.params})
      }
    }else{
      yield put({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_FAIL, data: response.data })
    }
  }catch(e){
    console.log(e)
  }
}

// 验证企业名是否已注册
function *checkEnterpriseName(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.checkEnterpriseName + '/' +action.params.enterpriseName;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: LoginAction.CHECK_ENTERPRISE_NAME_SUCCESS, 
        params: action.params,
        data: response.data.data,
      });
      if(response.data.data.isRegister === '1') {
        yield put({
          type: LoginAction.CHANGE_LOGIN_STORE,
          params: {
            registerStep: 3
          }
        });
      }
    }else{
      yield put({ type: LoginAction.CHECK_ENTERPRISE_NAME_FAIL, data: response.data})
    }
  }catch(e){
    console.log(e)
  }
}
// 注册企业 完善个人信息
function *registerEnterprise(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.registerEnterprise;
  yield put({ type: LoginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: stringify({
        'grant_type': "password",
        confirmPwd: action.params.confirmPwd,
        enterpriseDomain: action.params.enterpriseDomain,
        enterpriseName: action.params.enterpriseName,
        password: action.params.password,
        phoneNum: action.params.phoneNum,
        username: action.params.username,
      }),
    });
    if(response.data.code === '10000'){
      yield put({
        type: LoginAction.GET_LOGIN_SAGA,
        params:{
          username: action.params.username,
          password: action.params.password,
          history: action.params.history
        }
      });
    }else{
      yield put({type: LoginAction.REGISTER_ENTERPRISE_FAIL, data: response.data });
      if(response.data.code !== '20015') {
        message.error(response.data.message);
      }
    }
  }catch(e){
    console.log(e);
  }
}
// 获取企业信息
function *getEnterPriseInfo(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.getEnterpriseInfo + '/' +action.params.enterpriseName;
  try{
    yield put({ type: LoginAction.LOGIN_FETCH});
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({
        type: LoginAction.GET_ENTERPRISE_INFO_SUCCESS,
        params: action.params,
        data: response.data.data,
      })
    }else{
      yield put({type: LoginAction.GET_ENTERPRISE_INFO_FAIL, data: response.data})
    }
  }catch(e){
    console.log(e);
  }
}

// 加入企业
function *joinEnterprise(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.joinEnterprise;
  try{
    yield put({ type: LoginAction.LOGIN_FETCH });
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        confirmPwd: action.params.confirmPwd,
        enterpriseId: action.params.enterpriseId,
        password: action.params.password,
        phoneNum: action.params.phoneNum,
        username: action.params.username,
      }),
    });
    if(response.data.code === '10000'){
      yield put({
        type: LoginAction.GET_LOGIN_SAGA,
        params:{
          username: action.params.username,
          password: action.params.password,
          history: action.params.history,
        }
      })
    }else if(response.data.code === '20014') {//待审核
      yield put({
        type: LoginAction.JOIN_ENTERPRISE_SUCCESS,
        params: action.params,
        data: {
          joinResult: 1
        },      
      })
      message.warning('等待管理员审核');
    } else{
      yield put({type: LoginAction.JOIN_ENTERPRISE_FAIL, data: response.data })
      if(response.data.code !== '20015') {
        message.error(response.data.message);
      }
    }
  }catch(e){
    console.log(e);
  }
}

// 设置新密码
function *resetPassword(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.resetPassword;
  yield put({type: LoginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        confirmPwd: action.params.confirmPwd,
        password: action.params.password,
        phoneNum: action.params.phoneNum,
      }),
    });
    if(response.data.code === "10000"){
      message.success('密码设置成功，请重新登录！')
    }else{
      yield put({ type: LoginAction.RESET_PASSWORD_FAIL, data: response.data })
    }
  }catch(e){
    console.log(e);
  }
}
// 动态验证用户名是否注册（暂时弃用）
function *checkUserRegister(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.checkUserRegister + '/' + action.params.username;
  yield put({type: LoginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({ type: LoginAction.CHECK_USER_REGISTER_SUCCESS})
    }else{
      yield put({ type: LoginAction.CHECK_USER_REGISTER_FAIL})
    }
  }catch(e){
    console.log(e);
  }
}
//获取一些公共数据
function *getCommonData(action){
  try{
    yield put({type: CommonAction.GET_STATIONS_SAGA, params:{
      domainName: "cne", 
      stationType: 0, 
      app: "bi"
    }});
    // yield put({type: CommonAction.GET_DEVICETYPES_SAGA, params: {
      // 获取所有设备类型  需与后端协商一致取得
    // }});
  }catch(e){
    console.log(e);
  }
  
}
export function* watchLogin() {
  yield takeLatest(LoginAction.GET_LOGIN_SAGA, getLogin);
  yield takeLatest(LoginAction.SEND_CODE_SAGA, getVerificationCode);
  yield takeLatest(LoginAction.CHECK_CODE_SAGA, checkCode);
  yield takeLatest(LoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, checkEnterpriseDomain);
  yield takeLatest(LoginAction.GET_ENTERPRISE_INFO_SAGA, getEnterPriseInfo);
  yield takeLatest(LoginAction.JOIN_ENTERPRISE_SAGA, joinEnterprise);
  yield takeLatest(LoginAction.RESET_PASSWORD_SAGA, resetPassword);
  yield takeLatest(LoginAction.CHECK_ENTERPRISE_NAME_SAGA, checkEnterpriseName);
  yield takeLatest(LoginAction.REGISTER_ENTERPRISE_SAGA, registerEnterprise);
  yield takeLatest(LoginAction.CHECK_USER_REGISTER_SAGA, checkUserRegister);
  yield takeLatest(LoginAction.CHECK_PHONE_REGISTER_SAGA, checkPhoneRegister);
  yield takeLatest(LoginAction.PHONE_CODE_REGISTER_SAGA, phoneCodeRegister);
  yield takeLatest(LoginAction.CHANGE_LOGIN_STORE_SAGA, changeLoginStore);
  yield takeLatest(LoginAction.GET_COMMON_DATA_SAGA, getCommonData);
}