import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { unhandleAction } from './unhandleAction';

function *changeUnhandleStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  unhandleAction.changeUnhandleStore,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  unhandleAction.RESET_STORE
  })
}






export function* watchUnhandle() {
  yield takeLatest(unhandleAction.changeUnhandleStoreSage, changeUnhandleStore);
  yield takeLatest(unhandleAction.resetStore, resetStore);
 
}

