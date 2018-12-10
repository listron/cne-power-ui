import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { ignoreAction } from './ignoreAction';

function *changeIgnoreStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  ignoreAction.changeUnhandleStore,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  ignoreAction.RESET_STORE
  })
}






export function* watchUnhandle() {
  yield takeLatest(ignoreAction.changeIgnoreStoreSage, changeIgnoreStore);
  yield takeLatest(ignoreAction.resetStore, resetStore);
 
}

