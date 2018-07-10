import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

//切换页面
function *changePrelogin(action){
  const { params } = action;
  yield put({
    type: PreLoginAction.CHANGE_PRELOGIN_PAGE,
    params,
  })
}


export function* watchPreLoginPageChangeSaga() {
  yield takeLatest( PreLoginAction.CHANGE_PRELOGIN_PAGE_SAGA, changePrelogin);
}

