import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';
import Path from '../../constants/path';
import { message } from 'antd';
import { othersAction } from './othersAction';

const { APIBasePath } = Path.basePaths;
const { login } = Path.APISubPaths;

function *changeOthersStore(action){
  const { payload } = action;
  yield put({
    type: othersAction.CHANGE_OTHERS_STORE,
    payload,
  })
}

function *editPassword(action){ // 修改密码
  const { payload } = action;
  const { userId, oldPassword, newPassword, history } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editPassword}`;
  yield put({ type: othersAction.OTHERS_FETCH });
  try {
    const response = yield call(axios,{
      method: 'put',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        userId,
        oldPassword,
        newPassword,
      }),
    })
    if(response.data.code === '10000'){
      yield put({
        type: othersAction.GET_OTHERS_FETCH_SUCCESS,
        payload: {}
      });
      message.success('密码更改成功，2s后将返回首页');
      setTimeout(()=>{
        history.push('/monitor/station');
      },2000)
    } else{
      yield put({ 
        type: othersAction.changeOthersStore, 
        payload: { loading:false },
      }); 
      message.error(`密码修改失败，请重试:${response.data.message}`);    
    }
  }catch(e){
    console.log(e);
  }
}

function *editUserName(action){ // 修改姓名
  const { payload } = action;
  const { userFullName, history } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editUserName}/${userFullName}`;
  yield put({ type: othersAction.OTHERS_FETCH });
  try {
    const response = yield call(axios.put, url, payload)
    if(response.data.code === '10000'){
      yield put({
        type: othersAction.GET_OTHERS_FETCH_SUCCESS,
        payload: {}
      });
      message.success('账户信息更改成功，2s后将返回首页');
      setTimeout(()=>{
        history.push('/monitor/station');
      },2000)
    } else{
      yield put({ 
        type: othersAction.changeOthersStore, 
        payload: { loading:false },
      }); 
      message.error(`账户信息修改失败，请重试:${response.data.message}`);    
    }
  }catch(e){
    console.log(e);
  }
}

function *editPhone(action){ // 修改手机号
  const { payload } = action;
  const { history } = payload;
  console.log(payload);
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editPhone}`;
  yield put({ type: othersAction.OTHERS_FETCH });
  try {
    const response = yield call(axios.put, url, payload);
    if(response.data.code === '10000'){
      yield put({
        type: othersAction.GET_OTHERS_FETCH_SUCCESS,
        payload: {}
      });
      message.success('手机号码更改成功，2s后将返回首页');
      setTimeout(()=>{
        history.push('/monitor/station');
      },2000)
    } else{
      yield put({ 
        type: othersAction.changeOthersStore, 
        payload: { loading:false },
      }); 
      message.error(`手机号码修改失败，请重试:${response.data.message}`);    
    }
  }catch(e){
    console.log(e);
  }
}

function *getVerification(action){ // 获取新手机号验证码
  const { payload } = action;
  const url = `${APIBasePath}${login.getVerificationCode}/${payload.newPhoneNum}`;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({ type: othersAction.SEND_CODE_SUCCESS, payload });
    } else {
      message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}

function *phoneCodeRegister(action){ // 验证手机号和验证码是否正确
  const { payload } = action;
  let url = `${APIBasePath}${login.phoneCodeRegister}`;
  console.log(payload);
  try{
    const response = yield call(axios.post, url, {
      phoneNum: payload.newPhoneNum, 
      verificationCode: payload.verificationCode,
    });
    console.log(response.data);
    if(response.data.code === '00000'){
      yield put({type: othersAction.PHONE_CODE_REGISTER_FAIL, data: response.data});
    }else if(response.data.code === '20031'){
      yield put({type: othersAction.PHONE_CODE_CHECK_SAGA, payload});
    }
    else{
      yield put({type: othersAction.PHONE_CODE_CHECK_SAGA, payload});
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchOthersSaga() {
  yield takeLatest(othersAction.changeOthersStore, changeOthersStore);
  yield takeLatest(othersAction.editPassword, editPassword);
  yield takeLatest(othersAction.editUserName, editUserName);
  yield takeLatest(othersAction.editPhone, editPhone);
  yield takeLatest(othersAction.SEND_CODE_SAGA, getVerification);
  yield takeLatest(othersAction.PHONE_CODE_REGISTER_FAIL, phoneCodeRegister);

}