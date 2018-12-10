import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { historyWarnAction } from './historyWarnAction';

function *changeHistoryWarnStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  historyWarnAction.changeHistoryWarnStore,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  historyWarnAction.RESET_STORE
  })
}






export function* watchUnhandle() {
  yield takeLatest(historyWarnAction.changeHistoryWarnStoreSaga, changeHistoryWarnStore);
  yield takeLatest(historyWarnAction.resetStore, resetStore);
 
}

