import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { transferAction } from './transferAction';

function *changeTransferStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  transferAction.changeUnhandleStore,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  transferAction.RESET_STORE
  })
}






export function* watchUnhandle() {
  yield takeLatest(transferAction.changeTransferStoreSaga, changeTransferStore);
  yield takeLatest(transferAction.resetStore, resetStore);
 
}

