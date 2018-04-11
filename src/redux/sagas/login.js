import { takeEvery, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
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
} from '../../constants/actionTypes';

import {
  LOGIN_COMINFO,
  LOGIN_API_URL,
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
      message.error(response.data.error);                        
    }
  } catch (e) {
    message.error(e)    
  }
}

export function* getComInfo() {
  yield takeLatest('GET_COMINFO_SAGA', showLoginAsync);
}
export function* getLogin(){
  yield takeLatest('GET_LOGIN_SAGA',getLoginAsync);
}