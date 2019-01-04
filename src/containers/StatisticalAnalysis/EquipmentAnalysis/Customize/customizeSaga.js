import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { customizeAction } from './customizeAction';

function* changeCustomizeStore(action) { // 存储payload指定参数，替换reducer-store属性。
  console.log(payload);
  const { payload } = action;
  yield put({
    type: customizeAction.changeCustomizeStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: customizeAction.RESET_STORE
  })
}

export function* watchCustomize() {
  yield takeLatest(customizeAction.changeCustomizeStoreSaga, changeCustomizeStore);
  yield takeLatest(customizeAction.resetStore, resetStore);

}

