import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import Config from '../../../constants/config';
import { stringify } from 'qs';
import { setCookie } from '../../../utils';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

// 获取企业信息
function *getEnterPriseInfo(action){
  const { payload } = action;
  const url = '/mock/api/v3/login/enterpriseinfo';
  try{
    yield put({ type: PreLoginAction.JOININ_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      // type: PreLoginAction.GET_ENTERPRISE_INFO_SUCCESS,
      type: PreLoginAction.GET_JOININ_COMMON_SUCCESS,
      payload: {
        ...payload,
        data: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

// 加入企业
function *joinEnterprise(action){
  const { payload } = action;
  const url = '/mock/api/v3/login/userenterprise';
  try{
    yield put({ type: PreLoginAction.JOININ_FETCH });
    const response = yield call(axios.get, url, payload);
    yield put({
      type: PreLoginAction.GET_JOININ_COMMON_SUCCESS,
      payload: {
        ...payload,
        data: response.data.data,
        
      }
    })
  }catch(e){
    console.log(e);
  }
}

export function* watchJoinInSaga(){
  yield takeLatest(PreLoginAction.GET_ENTERPRISE_INFO_SAGA, getEnterPriseInfo);
  yield takeLatest(PreLoginAction.JOIN_ENTERPRISE_SAGA, joinEnterprise);
}













