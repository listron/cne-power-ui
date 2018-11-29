import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { cleanoutRecordAction } from './cleanoutRecordAction';

function *changeCleanoutWarningStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  cleanoutRecordAction.CHANGE_CLEANOUT_WARNING_STORE,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  cleanoutRecordAction.RESET_STORE
  })
}






export function* watchStationManage() {
  yield takeLatest(cleanoutRecordAction.CHANGE_CLEANOUT_WARNING_STORE_SAGA, changeCleanoutWarningStore);
  yield takeLatest(cleanoutRecordAction.resetStore, resetStore);
 
}

