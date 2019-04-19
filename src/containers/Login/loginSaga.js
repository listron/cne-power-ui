import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import moment from 'moment';
import { stringify } from 'qs';
import { loginAction } from './loginAction';
import { commonAction } from '../alphaRedux/commonAction';
import { message } from 'antd';
import Cookie from 'js-cookie';
import { Base64 } from 'js-base64';

const { APIBasePath } = Path.basePaths;
const { login } = Path.APISubPaths;
message.config({
  maxCount: 1,
});
// 改变loginStore
function *changeLoginStore(action){
  let { params } = action;
  yield put({
    type: loginAction.CHANGE_LOGIN_STORE,
    params,
  })
}

//账号密码登录
function *userNameLogin(action){
  const url = `${APIBasePath}${login.userNameLogin}`;
  const {params} = action;
  yield put({ type: loginAction.LOGIN_FETCH });
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      auth: {},
      data: stringify({
        'grant_type': "password",
        'deviceType': '0',
        username: params.username,
        password: Base64.encode(params.password),
      }),
    });
    if(response.data.code === '10000' && response.data.data.userEnterpriseStatus){
      const { data } = response.data;
      if(data.userEnterpriseStatus === 3) {//3启用状态
        data.access_token && Cookie.set('authData',JSON.stringify(data.access_token));
        data.enterpriseId && Cookie.set('enterpriseId', data.enterpriseId);
        data.enterpriseName && Cookie.set('enterpriseName', data.enterpriseName);
        data.enterpriseLogo && Cookie.set('enterpriseLogo', data.enterpriseLogo);
        data.userId && Cookie.set('userId', data.userId);
        data.username && Cookie.set('username', data.username);
        data.userFullName && Cookie.set('userFullName', data.userFullName);
        data.userLogo && Cookie.set('userLogo', data.userLogo);
        data.expires_in && Cookie.set('expireData', moment().add(data.expires_in, 'seconds'));
        data.refresh_token && Cookie.set('refresh_token', data.refresh_token);
        Cookie.set('isNotLogin', 0);
        data.auto && Cookie.set('auto', data.auto);
        data.right && Cookie.set('userRight', data.right);
        data.rightMenu && Cookie.set('rightMenu', data.rightMenu);

        data.rightMenu && localStorage.setItem('rightMenu', data.rightMenu); // 权限信息存储
        data.right && localStorage.setItem('rightHandler', data.right); // 权限信息存储
        yield put({ // 存入reducer
          type: commonAction.changeCommonStore,
          params: {
            username: data.username,
            userFullName: data.userFullName,
            userLogo: data.userLogo || ''
          }
        })
        if(data.auto === '1'){//导入用户/生成用户 需走完善密码步骤
          yield put({ 
            type: loginAction.CHANGE_LOGIN_STORE_SAGA, 
            params: {
              importUser: true,
              pageTab: 'joinIn',
              joinStep: 3,
            }
          })
        }else if(data.auto === '0'){//正常用户，直接登录
          yield put({ type: loginAction.USER_NAME_LOGIN_SUCCESS, data});
        }
      } else {
        yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params});
        if(data.userEnterpriseStatus){
          yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params: {userEnterpriseStatus: data.userEnterpriseStatus}})
        }
      }
    } else{
      yield put({ type: loginAction.USER_NAME_LOGIN_FAIL, data: response.data }); 
      // message.error(response.data.message);    
    }
  } catch (e) {
    console.log(e);
  }
}
//获取短信验证码
function *getVerificationCode(action){
  const { params } = action;
  const url = `${APIBasePath}${login.getVerificationCode}/${params.phoneNum}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({ type: loginAction.SEND_CODE_SUCCESS, params });
    } else {
      message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}
//手机+验证码登录
function *phoneCodeLogin(action){
  const { params } = action;
  const url = `${APIBasePath}${login.phoneCodeLogin}`;
  yield put({ type: loginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      auth: {},
      data: stringify({
        'grant_type': "password",
        phoneNum: params.phoneNum,
        verificationCode: params.verificationCode,
      }),
    });
    if(response.data.code === '10000'){
      const { data } = response.data;
      if(data.userEnterpriseStatus === 3) {
        if(params.isNotLogin === 1 || (data.auto==='0' && data.enterpriseId!==null)) {//非登录/正常用户
          data.access_token && Cookie.set('authData',JSON.stringify(data.access_token));
          data.enterpriseId && Cookie.set('enterpriseId', data.enterpriseId);
          data.enterpriseName && Cookie.set('enterpriseName', data.enterpriseName);
          data.enterpriseLogo && Cookie.set('enterpriseLogo', data.enterpriseLogo);
          data.userId && Cookie.set('userId', data.userId);
          data.username && Cookie.set('username', data.username);
          data.userFullName && Cookie.set('userFullName', data.userFullName);
          data.userLogo && Cookie.set('userLogo', data.userLogo);
          data.expires_in && Cookie.set('expireData', moment().add(data.expires_in, 'seconds'));
          data.refresh_token && Cookie.set('refresh_token', data.refresh_token);
          Cookie.set('isNotLogin', action.params.isNotLogin);
          data.auto && Cookie.set('auto', data.auto);
          data.right && Cookie.set('userRight', data.right);
          data.rightMenu && Cookie.set('rightMenu', data.rightMenu);

          data.rightMenu && localStorage.setItem('rightMenu', data.rightMenu); // 权限信息存储
          data.right && localStorage.setItem('rightHandler', data.right); // 权限信息存储
        }
        yield put({ // 存入reducer
          type: commonAction.changeCommonStore,
          params: {
            username: data.username,
            userFullName: data.userFullName,
            userLogo: data.userLogo || ''
          }
        })
        if(data.auto==='1'){//auto为1导入用户/生成用户 需走完善密码步骤
          message.error('请完善密码！');
          yield put({ 
            type: loginAction.CHANGE_LOGIN_STORE_SAGA, 
            params: {
              importUser: true,
              pageTab: 'joinIn',
              joinStep: 3,
            }
          });
        }

        yield put({
          type: loginAction.PHONE_CODE_LOGIN_SUCCESS,
          params, //params为请求传入的值
          data, //data为API返回的值
        });
      } else {
        yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params });
        if(data.userEnterpriseStatus){
          yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params: {userEnterpriseStatus: data.userEnterpriseStatus}})
        }
        // message.error(data.userEnterpriseStatus);
      }
    }else{
      message.error(response.data.message);
      yield put({ type: loginAction.PHONE_CODE_LOGIN_FAIL, data: response.data });
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE_SAGA,
        params: {
          checkLoginPhone: false,
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}

// 验证手机号和验证码是否正确（加入企业/注册企业，手机验证码正确会调用手机号验证码登录获取token）
function *phoneCodeRegister(action){
  const { params } = action;
  let url = `${APIBasePath}${login.phoneCodeRegister}`;
  try{
    const response = yield call(axios.post, url, {
      phoneNum: params.phoneNum, 
      verificationCode: params.verificationCode,
    });
    if (response.data.code === '10000' || response.data.code === '20014') { // 成功 或 用户重新加入企业
      yield put({type: loginAction.PHONE_CODE_LOGIN_SAGA, params});
    } else if(response.data.code === '00000'){ // 验证码校验异常 => 尚未发送验证码/验证码错误/验证码失效
      message.error(response.data.message);
    } else { // 用户已注册且未关联企业/ 注册失败
      message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}
// 注册验证手机号是否已存在(此接口暂时弃用)
function *checkPhoneRegister(action){
  let url = `${APIBasePath}${login.loginPhoneRegister}/${action.params}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({type: loginAction.CHECK_PHONE_REGISTER_SUCCESS, data: response.data.data});
    }else{
      yield put({type: loginAction.CHECK_PHONE_REGISTER_FAIL, data: {error: response.data.message}});
    }
  }catch(e){
    console.log(e);
  }
}

// 验证企业域名是否有效
function *checkEnterpriseDomain(action){
  const { params } = action;
  let url = `${APIBasePath}${login.checkEnterpriseDomain}/${params.enterpriseDomain}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: loginAction.CHECK_ENTERPRISE_DOMAIN_SUCCESS, 
        params,
        data: response.data.data,
      });
      if(response.data.data.isRegister === '1') {
        yield put({type: loginAction.CHECK_ENTERPRISE_NAME_SAGA, params})
      }
    }else{
      yield put({ type: loginAction.CHECK_ENTERPRISE_DOMAIN_FAIL, data: response.data })
    }
  }catch(e){
    console.log(e)
  }
}

// 验证企业名是否已注册
function *checkEnterpriseName(action){
  const { params } = action;
  const url = `${APIBasePath}${login.checkEnterpriseName}/${params.enterpriseName}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000'){
      yield put({
        type: loginAction.CHECK_ENTERPRISE_NAME_SUCCESS, 
        params,
        data: response.data.data,
      });
      if(response.data.data.isRegister === '1') {
        yield put({
          type: loginAction.CHANGE_LOGIN_STORE_SAGA,
          params: {
            registerStep: 3
          }
        });
      }
    }else{
      yield put({ type: loginAction.CHECK_ENTERPRISE_NAME_FAIL, data: response.data})
    }
  }catch(e){
    console.log(e)
  }
}
// 注册企业 完善个人信息
function *registerEnterprise(action){
  const { params } = action;
  const url = `${APIBasePath}${login.registerEnterprise}`;
  yield put({ type: loginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: stringify({
        'grant_type': "password",
        phoneNum: params.phoneNum,
        enterpriseDomain: params.enterpriseDomain,
        enterpriseName: params.enterpriseName,
        username: params.username,
        password: params.password,
        confirmPwd: params.confirmPwd,        
      }),
    });
    message.success("请求成功");
    if(response.data.code === '10000'){
      message.success('注册成功！');
      yield put({
        type: loginAction.USER_NAME_LOGIN_SAGA,
        params:{
          username: params.username,
          password: params.password,
        }
      });
    }else{
      message.error('注册失败！');
      yield put({type: loginAction.REGISTER_ENTERPRISE_FAIL, data: response.data });
      if(response.data.code !== '20015') {
        message.error(response.data.message);
      }
    }
  }catch(e){
    console.log(e);
    message.error('服务器异常！');
  }
}
// 获取企业信息
function *getEnterPriseInfo(action){
  const { params } = action;
  const url = `${APIBasePath}${login.getEnterpriseInfo}/${params.enterpriseName}`;
  try{
    yield put({ type: loginAction.LOGIN_FETCH});
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({
        type: loginAction.GET_ENTERPRISE_INFO_SUCCESS,
        params,
        data: response.data.data || {},
      })
    }else{
      yield put({type: loginAction.GET_ENTERPRISE_INFO_FAIL, data: response.data})
    }
  }catch(e){
    console.log(e);
  }
}

// 加入企业
function *joinEnterprise(action){
  const { params } = action;
  const url = `${APIBasePath}${login.joinEnterprise}`;
  try{
    yield put({ type: loginAction.LOGIN_FETCH });
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        confirmPwd: params.confirmPwd,
        enterpriseId: params.enterpriseId,
        password: params.password,
        userFullname: params.userFullname,
        phoneNum: params.phoneNum,
        username: params.username,
      }),
    });
    if(response.data.code === '10000'){
      yield put({
        type: loginAction.USER_NAME_LOGIN_SAGA,
        params:{
          username: params.username,
          password: params.password,
        }
      });
      message.success(response.data.message);
    } else{
      yield put({type: loginAction.JOIN_ENTERPRISE_FAIL, data: response.data })
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
  const { params } = action;
  const url = `${APIBasePath}${login.resetPassword}`;
  yield put({type: loginAction.LOGIN_FETCH});
  try{
    const tmpAuthData = params.tmpAuthData || '';
    const tmpAuthorization = `bearer ${tmpAuthData}`;
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: tmpAuthorization
      },
      data: stringify({
        'grant_type': "password",
        confirmPwd: params.confirmPwd,
        password: params.password,
        phoneNum: params.phoneNum,
        userFullname: params.userFullname,
      }),
    });
    if(response.data.code === "10000"){
      Cookie.set('isNotLogin', 0);
      Cookie.set('userFullName', params.userFullname);
      message.success('密码设置成功！');
      yield put({ // userFullName存入common ，同时触发render 让cookie生效。
        type: commonAction.changeCommonStore,
        params: { userFullName: params.userFullname }
      })
    } else {
      yield put({ type: loginAction.RESET_PASSWORD_FAIL, data: response.data });
      message.error('设置失败！');
    }
  }catch(e){
    console.log(e);
  }
}
// （暂时弃用）动态验证用户名是否注册
function *checkUserRegister(action){
  const { params } = action;
  const url = `${APIBasePath}${login.checkUserRegister}/${params.username}`;
  yield put({type: loginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({ type: loginAction.CHECK_USER_REGISTER_SUCCESS})
    }else{
      yield put({ type: loginAction.CHECK_USER_REGISTER_FAIL})
    }
  }catch(e){
    console.log(e);
  }
}

// 离开重置state
function* resetLoginStore(action) {
  yield put({
    type: loginAction.RESET_LOGIN_STORE_SUCCESS,
  });
}

// 邀请用户加入企业(获取邀请企业信息)
function *inviteUserLink(action){
  const { params } = action;
  const url = `${APIBasePath}${login.inviteUserLink}/${params.linkId}`;
  yield put({type: loginAction.LOGIN_FETCH});
  try{
    const response = yield call(axios.post, url,params);
    if(response.data.code === '10000'){//邀请链接成功
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE_SAGA, 
        params:{
          pageTab: 'joinIn',
          joinStep: 2,
        }
      });
      yield put({type: loginAction.INVITE_USER_LINK_SUCCESS,
        data: response.data.data || {},
      });

    }else if(response.data.code === '20021'){//邀请链接已失效
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE_SAGA, 
        params:{
          pageTab: 'joinIn',
          joinStep: 2,
          inviteValid: false,
        }
      });
    }else{
      console.log(response.data);
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchLogin() {
  yield takeLatest(loginAction.USER_NAME_LOGIN_SAGA, userNameLogin);
  yield takeLatest(loginAction.SEND_CODE_SAGA, getVerificationCode);
  yield takeLatest(loginAction.PHONE_CODE_LOGIN_SAGA, phoneCodeLogin);
  yield takeLatest(loginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, checkEnterpriseDomain);
  yield takeLatest(loginAction.GET_ENTERPRISE_INFO_SAGA, getEnterPriseInfo);
  yield takeLatest(loginAction.JOIN_ENTERPRISE_SAGA, joinEnterprise);
  yield takeLatest(loginAction.RESET_PASSWORD_SAGA, resetPassword);
  yield takeLatest(loginAction.CHECK_ENTERPRISE_NAME_SAGA, checkEnterpriseName);
  yield takeLatest(loginAction.REGISTER_ENTERPRISE_SAGA, registerEnterprise);
  yield takeLatest(loginAction.CHECK_USER_REGISTER_SAGA, checkUserRegister);
  yield takeLatest(loginAction.CHECK_PHONE_REGISTER_SAGA, checkPhoneRegister);
  yield takeLatest(loginAction.PHONE_CODE_REGISTER_SAGA, phoneCodeRegister);
  yield takeLatest(loginAction.CHANGE_LOGIN_STORE_SAGA, changeLoginStore);
  yield takeLatest(loginAction.RESET_LOGIN_STORE_SAGA, resetLoginStore);
  yield takeLatest(loginAction.INVITE_USER_LINK_SAGA, inviteUserLink);
}