import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';
import Path from '../../constants/path';
import { message } from 'antd';
import { otherAction } from './otherAction';

function *changeOtherStore(action){
  let { payload } = action;
  yield put({
    type: otherAction.CHANGE_OTHER_STORE,
    payload,
  })
}

function *editPassword(action){ // 修改密码
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editPassword}`;
  // const url = '/mock/other/editPassword';
  yield put({ type: otherAction.OTHER_FETCH });
  const { payload } = action;
  const { userId, oldPassword, newPassword, history } = payload;
  try {
    const response = yield call(axios,{
      method: 'put',
      url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: stringify({
        userId,
        oldPassword,
        newPassword,
      }),
    })
    if(response.data.code === '10000'){
      yield put({
        type: otherAction.GET_OTHER_FETCH_SUCCESS,
        payload: {}
      });
      message.success('密码更改成功, 2s后将返回首页');
      setTimeout(()=>{
        history.push('/monitor/station');
      },2000)
    } else{
      yield put({ 
        type: otherAction.changeOtherStore, 
        payload: { loading:false },
      }); 
      message.error(`密码修改失败，请重试:${response.data.message}`);    
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchOtherSaga() {
  yield takeLatest(otherAction.editPassword, editPassword);
  yield takeLatest(otherAction.changeOtherStore, changeOtherStore);
}