import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import moment from 'moment';
import { stringify } from 'qs';
import { loginAction } from './loginReducer';
import { message } from 'antd';
import Cookie from 'js-cookie';
import { Base64 } from 'js-base64';

const { APIBasePath } = Path.basePaths;
const { login } = Path.APISubPaths;

function *loginInfoSave({ payload = {} }) { // 用户登录后需进行的数据存储。
  // localStorage.setItem('authData', JSON.stringify({
  //   token: payload.access_token,
  //   refreshToken: payload.refresh_token,
  //   expireData: moment().add(payload.expires_in, 's').format('YYYY-MM-DD HH:mm:ss') // token过期时间
  // }))
  localStorage.setItem('token', payload.access_token);
  Cookie.set('token', payload.access_token)
  localStorage.setItem('refreshToken', payload.refresh_token);
  Cookie.set('refreshToken', payload.refresh_token)
  localStorage.setItem('expireData', moment().add(payload.expires_in, 's').format('YYYY-MM-DD HH:mm:ss'));
  Cookie.set('expireData', moment().add(payload.expires_in, 's').format('YYYY-MM-DD HH:mm:ss'));
  localStorage.setItem('userInfo', JSON.stringify({ // 用户个人信息存储。
    enterpriseId: payload.enterpriseId,
    enterpriseName: payload.enterpriseName,
    enterpriseLogo: payload.enterpriseLogo,
    userId: payload.userId,
    username: payload.username,
    userFullName: payload.userFullName,
    userLogo: payload.userLogo,
  }))
  localStorage.setItem('rightMenu', payload.rightMenu); // 权限信息存储
  localStorage.setItem('rightHandler', payload.right); // 权限信息存储
  // axios.defaults.headers.common['Authorization'] = `bearer ${payload.access_token}`;
  yield put({
    type: loginAction.CHANGE_LOGIN_STORE,
    payload: { loginInfoSaved: true }
  })
}

function *userNameLogin({ payload = {} }){ //账号密码登录
  const url = `${APIBasePath}${login.userNameLogin}`;
  try {
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { loginLoading: true },
    })
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      auth: {},
      data: stringify({
        'grant_type': "password",
        'deviceType': '0',
        username: payload.username,
        password: Base64.encode(payload.password),
      }),
    });
    if (response.data.code === '10000') { // 账户密码正确，但用户状态不确定。需根据用户状态确定是否能够进行登录。
      const loginResponse = response.data.data || {};
      const { immediatelyLogin } = payload;
      if (immediatelyLogin) {
        const { userEnterpriseStatus, auto, username } = loginResponse;
        // userEnterpriseStatus => 0:全部，1：激活，2：未激活，3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
        if (userEnterpriseStatus === 3 && auto === '0' && username) {
          // 用户状态 3 => 启用。auto === '1' => 导入用户/生成用户 需走完善密码步骤; username不存在需要先完善个人信息
          yield call(loginInfoSave, { payload: loginResponse }); // 正常登录，信息存储
        }
      } else {
        yield put({
          type: loginAction.CHANGE_LOGIN_STORE,
          payload: {
            loginResponse,
            loginLoading: false
          }, // 返回信息暂存， 用于判定异常登录状态
        })
      }
    } else { // 账户或密码错误 response.data.code === '20009'
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: {
          loginError: true,
          loginLoading: false
        }
      }); 
    }
    /*
      if (response.data.code === '10000' && response.data.data.userEnterpriseStatus) {
        const { data } = response.data;
        if(data.userEnterpriseStatus === 3) { // 3 启用状态
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
          if(data.auto === '1'){ // 导入用户/生成用户 需走完善密码步骤
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
            // action.params.history.push('/monitor/station');
          }
        } else {
          yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params});
          if(data.userEnterpriseStatus){
            yield put({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params: {userEnterpriseStatus: data.userEnterpriseStatus}})
          }
        }
      } else {
        yield put({ type: loginAction.USER_NAME_LOGIN_FAIL, data: response.data }); 
        // message.error(response.data.message);    
      }
    */
  } catch (e) {
    console.log(e);
  }
}

function *getVerificationCode({ payload = {} }){ // 获取短信验证码
  const url = `${APIBasePath}${login.getVerificationCode}/${payload.phoneNum}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code !== '10000'){
      message.error('验证码获取失败,请重试!');
      console.log(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}

function *phoneCodeLogin({ payload = {} }){ // 手机+验证码登录
  const url = `${APIBasePath}${login.phoneCodeLogin}`;
  try{
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { loginLoading: true },
    })
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      auth: {},
      data: stringify({
        'grant_type': "password",
        phoneNum: payload.phoneNum,
        verificationCode: payload.verificationCode,
      }),
    });
    if (response.data.code === '10000') {
      const loginResponse = response.data.data || {};
      const tmpJoin = {};
      const { immediatelyLogin } = payload; // 是否请求成功自动存储数据并登录。
      if (immediatelyLogin) {
        const { userEnterpriseStatus, auto, username } = loginResponse;
        // userEnterpriseStatus => 0:全部，1：激活，2：未激活，3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
        if (userEnterpriseStatus === 3 && auto === '0' && username) {
          // 用户状态 3 => 启用。auto === '1' => 导入用户/生成用户 需走完善密码步骤; username不存在需要先完善个人信息
          yield call(loginInfoSave, { payload: loginResponse }); // 正常登录，信息存储
        }
      }
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: {
          loginResponse,
          loginLoading: false,
          ...tmpJoin
        }, // 登录异常， 信息暂存，用于判定异常状态并给出相应提示
      });
      /*
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
      */  
    } else { // 账户或密码错误 response.data.code === '20009'
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: {
          loginError: true,
          loginLoading: false
        }
      }); 
    }
    // else{
    //   message.error(response.data.message);
    //   yield put({ type: loginAction.PHONE_CODE_LOGIN_FAIL, data: response.data });
    //   yield put({
    //     type: loginAction.CHANGE_LOGIN_STORE_SAGA,
    //     params: {
    //       checkLoginPhone: false,
    //     }
    //   });
    // }
  }catch(e){
    console.log(e);
  }
}

function *phoneCodeRegister({ payload = {} }) { // 验证手机号和验证码是否正确 (注册企业)
  let url = `${APIBasePath}${login.phoneCodeRegister}`;
  try{
    const { phoneNum, verificationCode, ...restParams } = payload;
    const response = yield call(axios.post, url, { phoneNum, verificationCode });
    if (response.data.code === '00000') { // 验证码错误
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: { phoneCodeErrorInfo: response.data.message }
      })
    } else { // 验证码正确 => 根据传入变量进行状态控制，并请求登录接口得到信息并保存
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: {
          phoneNum, // 手机号需暂存
          ...restParams
        },
      })
      yield put({
        type: loginAction.phoneCodeLogin,
        payload: { phoneNum, verificationCode },
      });
    }
  } catch(err) {
    message.error('验证失败, 请重试!')
    console.log(err);
  }
}

function *checkEnterpriseDomain(action){ // 验证企业域名是否有效
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

function *checkEnterpriseName(action){ // 验证企业名是否已注册
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

function *registerEnterprise(action){ // 注册企业 完善个人信息
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
          history: params.history,
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

function *getEnterpriseInfo({ payload = {} }){ // 获取企业信息
  const url = `${APIBasePath}${login.getEnterpriseInfo}/${payload.enterpriseName}`;
  try {
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { enterpriseLoading: true }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: loginAction.FETCH_LOGIN_SUCCESS,
        payload: {
          enterpriseLoading: false,
          showEnterpriseInfo: true,
          enterpriseInfo: response.data.data || {},
        }
      })
    } else {
      throw response.data
    }
  } catch(err) {
    console.log(err);
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: {
        enterpriseLoading: false,
        showEnterpriseInfo: true,
        enterpriseInfo: {},
      }
    })
  }
}

function *joinEnterprise({ payload = {} }){ // 加入企业
  const url = `${APIBasePath}${login.joinEnterprise}`;
  try{
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { joinLoading: true }
    })
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        'grant_type': "password",
        ...payload,
      }),
    });
    if (response.data.code === '10000') {
      message.success(response.data.message);
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: { joinLoading: false }
      })
      const loginResponseInfo = yield select(state => state.login.loginResponse);
      yield call(loginInfoSave, { payload: loginResponseInfo }); // 正常登录，信息存储
    } else {
      throw response.data.message
    }
  } catch(err) {
    message.error(err);
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { joinLoading: false }
    })
  }
}

function *resetPassword({ payload = {} }){ // 设置新密码
  const url = `${APIBasePath}${login.resetPassword}`;
  try{
    const { authData, ...restParams } = payload;
    const tmpAuthorization = `bearer ${authData || ''}`;
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { joinLoading: true }
    })
    const response = yield call(axios, {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: tmpAuthorization
      },
      data: stringify({
        'grant_type': "password",
        ...restParams
      }),
    });
    if (response.data.code === "10000") {
      message.success('密码设置成功，请重新登录！');
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE,
        payload: {
          pageTab: 'login',
          joinLoading: false
        }
      });
    } else { throw response.data }
  }catch(e){
    message.error('设置失败,请重试！');
    yield put({
      type: loginAction.CHANGE_LOGIN_STORE,
      payload: { joinLoading: false }
    })
    console.log(e);
  }
}

function *inviteUserLink({ payload = {} }){ // 邀请用户加入企业(获取邀请企业信息)
  const url = `${APIBasePath}${login.inviteUserLink}/${payload.linkId}`;
  try{
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') { //邀请链接成功
      yield put({
        type: loginAction.FETCH_LOGIN_SUCCESS, 
        payload:{
          pageTab: 'joinIn',
          joinStep: 2, // 直接进入企业信息
          enterpriseInfo: response.data.data || {},
          inviteValid: true,
        }
      });
    } else if (response.data.code === '20021') { // 邀请链接已失效
      yield put({
        type: loginAction.CHANGE_LOGIN_STORE, 
        params:{
          pageTab: 'joinIn',
          joinStep: 2,
          inviteValid: false,
          enterpriseInfo: {},
        }
      });
    } else { throw response.data }
  } catch(err) { // 错误链接信息 不做处理和跳转
    message.error('信息出错,请确认链接正确或刷新页面重试!')
    console.log(err);
  }
}

/*
  function *checkUserRegister(action) { // （暂时弃用）动态验证用户名是否注册
    const { params } = action;
    const url = `${APIBasePath}${login.checkUserRegister}/${params.username}`;
    yield put({type: loginAction.LOGIN_FETCH});
    try {
      const response = yield call(axios.get, url);
      if(response.data.code === "10000"){
        yield put({ type: loginAction.CHECK_USER_REGISTER_SUCCESS})
      }else{
        yield put({ type: loginAction.CHECK_USER_REGISTER_FAIL})
      }
    } catch(e) {
      console.log(e);
    }
  }

  function *checkPhoneRegister(action) { // 注册验证手机号是否已存在(接口暂弃用)
    let url = `${APIBasePath}${login.loginPhoneRegister}/${action.params}`;
    try {
      const response = yield call(axios.get, url);
      if(response.data.code === '10000'){
        yield put({type: loginAction.CHECK_PHONE_REGISTER_SUCCESS, data: response.data.data});
      }else{
        yield put({type: loginAction.CHECK_PHONE_REGISTER_FAIL, data: {error: response.data.message}});
      }
    } catch(e) {
      console.log(e);
    }
  }
*/

export function* watchLogin() {
  yield takeLatest(loginAction.userNameLogin, userNameLogin);
  yield takeLatest(loginAction.getVerificationCode, getVerificationCode);
  yield takeLatest(loginAction.phoneCodeLogin, phoneCodeLogin);
  yield takeLatest(loginAction.phoneCodeRegister, phoneCodeRegister);
  // yield takeLatest(loginAction.checkEnterpriseDomain, checkEnterpriseDomain);
  // yield takeLatest(loginAction.checkEnterpriseName, checkEnterpriseName);
  // yield takeLatest(loginAction.registerEnterprise, registerEnterprise);
  yield takeLatest(loginAction.getEnterpriseInfo, getEnterpriseInfo);
  yield takeLatest(loginAction.joinEnterprise, joinEnterprise);
  yield takeLatest(loginAction.resetPassword, resetPassword);
  yield takeLatest(loginAction.inviteUserLink, inviteUserLink);
}