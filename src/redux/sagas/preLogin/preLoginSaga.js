import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import {
  CHANGE_PRELOGIN_PAGE,
  CHANGE_PRELOGIN_PAGE_SAGA
} from '../../../constants/actionTypes/preLoginAction';

//切换页面
function *changePrelogin(action){
  const { params } = action;
  yield put({
    type:CHANGE_PRELOGIN_PAGE,
    params,
  })
}


export function* watchPreLoginPageChangeSaga() {
  yield takeLatest(CHANGE_PRELOGIN_PAGE_SAGA, changePrelogin);
}

