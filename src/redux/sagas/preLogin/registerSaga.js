import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import Config from '../../../constants/config';
import { PreLoginAction } from '../../../constants/actionTypes/preLoginAction';

//  注册企业 获取手机验证码 
function *signupSendCode(action){
  let url = Config.APIBasePath + Path.APISubPaths.signupSendCode;
  try{
    const response = yield call(axios.post, url, {phone: action.params.phone});
    if(response.data.success){
      yield put({ type: PreLoginAction.SIGNUP_SEND_CODE_SUCCESS, data: {phone: action.params.phone}})
      yield put({ type: PreLoginAction.BEGIN_COUNT, payload: 60})
    }else{
      yield put({ type: PreLoginAction.SIGNUP_SEND_CODE_FAIL, data: {error: response.data.error, phone: action.params.phone}})
    }
  }catch(e){
    console.log(e);
  }
}
// 下一步 验收验证码
function *signupCheckCode(action){
  
}
export function* watchGetSignupCheck(){
  yield takeLatest(PreLoginAction.SIGNUP_SEND_CODE_SAGA, signupSendCode);
}
export function* watchSignupCheckCode(){
  yield takeLatest(PreLoginAction.SIGNUP_CHECK_CODE_SAGA, signupCheckCode);
}