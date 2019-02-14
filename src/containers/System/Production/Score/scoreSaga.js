import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { scoreAction } from './scoreAction.js';
import Cookie from 'js-cookie';


function* changeScoreStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: scoreAction.changeScoreStore,
    payload,
  })
}


function* resetStore() {
  yield put({
    type: scoreAction.RESET_STORE
  })
}



export function* watchScore() {
  yield takeLatest(scoreAction.changeScoreStoreSaga, changeScoreStore);
  yield takeLatest(scoreAction.resetStore, resetStore);
 

}