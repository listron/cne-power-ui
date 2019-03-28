import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';
import Path from '../../constants/path';
import { message } from 'antd';
import { othersAction } from './othersAction';

function *changeOthersStore(action){
  const { payload } = action;
  yield put({
    type: othersAction.CHANGE_OTHERS_STORE,
    payload,
  })
}

function *editPassword(action){ // 修改密码
  const { payload } = action;
  const { userId, oldPassword, newPassword, history } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editPassword}`;
  yield put({ type: othersAction.OTHERS_FETCH });
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
        type: othersAction.GET_OTHERS_FETCH_SUCCESS,
        payload: {}
      });
      message.success('密码更改成功，2s后将返回首页');
      setTimeout(()=>{
        history.push('/monitor/station');
      },2000)
    } else{
      yield put({ 
        type: othersAction.changeOthersStore, 
        payload: { loading:false },
      }); 
      message.error(`密码修改失败，请重试:${response.data.message}`);    
    }
  }catch(e){
    console.log(e);
  }
}

function *editUserName(action){ // 修改姓名
  const {payload} = action;
  const { userFullName } = payload;
  console.log(payload)
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editUserName}`;
}

export function* watchOthersSaga() {
  yield takeLatest(othersAction.changeOthersStore, changeOthersStore);
  yield takeLatest(othersAction.editPassword, editPassword);
  yield takeLatest(othersAction.editUserName, editUserName);
}