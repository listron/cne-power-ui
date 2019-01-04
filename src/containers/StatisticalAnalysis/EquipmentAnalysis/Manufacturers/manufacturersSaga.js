import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { manufacturersAction } from './manufacturersAction';

function* changeManufacturersStore(action) { // 存储payload指定参数，替换reducer-store属性。
  console.log(payload);
  const { payload } = action;
  yield put({
    type: manufacturersAction.changeManufacturersStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: manufacturersAction.RESET_STORE
  })
}

export function* watchManufacturers() {
  yield takeLatest(manufacturersAction.changeManufacturersStoreSaga, changeManufacturersStore);
  yield takeLatest(manufacturersAction.resetStore, resetStore);

}

