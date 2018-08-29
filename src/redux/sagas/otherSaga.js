import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { message } from 'antd';
import { otherAction } from '../../constants/actionTypes/otherAction';

function *changeOtherStore(action){
  let { payload } = action;
  yield put({
    type: otherAction.CHANGE_OTHER_STORE,
    payload,
  })
}

function *editPassword(action){ // 修改密码
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.other.editPassword}`;
  const url = '/mock/other/editPassword';
  yield put({ type: otherAction.OTHER_FETCH });
  const { payload } = action;
  try {
    const response = yield call(axios.post, url, {
       ...payload,
    });
    if(response.data.code === '10000'){
      yield put({
        type: otherAction.GET_LOGIN_SUCCESS,
        payload: {}
      });
      payload.history.push('/'); 
    } else{
      yield put({ 
        type: otherAction.CHANGE_OTHER_STORE_SAGA, 
        payload: { loading:false },
      }); 
      message.error(`密码修改失败，请重试:${response.data.message}`);    
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchOtherSaga() {
  yield takeLatest(otherAction.EDIT_PASSWORD_SAGA, editPassword);
  yield takeLatest(otherAction.CHANGE_OTHER_STORE_SAGA, changeOtherStore);
}