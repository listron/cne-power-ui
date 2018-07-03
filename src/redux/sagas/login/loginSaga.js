import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import {
  LOGIN_FETCH,
  GET_LOGIN_SAGA,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
} from '../../../constants/actionTypes/loginAction';


//获取所有电站信息
function *getLogin(action){
  let url = Path.basePaths.newAPIBasePath + Path.commonPaths.getStations;
  yield put({ type: LOGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.success){
      yield put({ 
        type: GET_LOGIN_SUCCESS, 
        params: {
          data: response.data.result
        }
      });       
    } else{
      yield put({ 
        type: GET_LOGIN_FAIL, 
        error:{
          code: response.data.error,
          message: response.data.error
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}


export function* watchLoginSaga() {
  yield takeLatest(GET_LOGIN_SAGA, getLogin);
}

