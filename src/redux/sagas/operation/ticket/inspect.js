import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
  GET_INSPECT_LIST_SAGA, 
  GET_INSPECT_LIST_SUCCESS, 
  GET_INSPECT_LIST_FAIL,
  CLEAR_INSPECT_STATE_SAGA,
  CLEAR_INSPECT_STATE
} from '../../../../constants/actionTypes/Ticket';


//获取巡检列表信息
function* getInspectList(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectionList;
  yield put({ type: BEGIN_FETCH});
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      yield put({
        type: GET_INSPECT_LIST_SUCCESS,
        data: response.data.data,
        params: action.params,
      });
    }else{
      yield put({ 
        type: GET_INSPECT_LIST_FAIL, 
        error: {
          code: response.data.code,
          message: response.data.message
        }  
      });
    }
  }catch(e){
    console.log(e);
  }
}

function* clearInspect(action) {
  yield put({ 
    type: CLEAR_INSPECT_STATE, 
  }); 
}

export function* watchGetInspectList() {
  yield takeLatest(GET_INSPECT_LIST_SAGA, getInspectList);
}

export function* watchClearInspect() {
  yield takeLatest(CLEAR_INSPECT_STATE_SAGA, clearInspect);
}