import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
  GET_INSPECTION_LIST_SAGA, 
  GET_INSPECTION_LIST_SUCCESS, 
  GET_INSPECTION_LIST_FAIL
} from '../../../../constants/actionTypes/Ticket';


//获取巡检列表信息
function* getInspectionList(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectionList;
  // let url = '/mock/operation/inspectionList';
  yield put({ type: BEGIN_FETCH});
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      yield put({
        type: GET_INSPECTION_LIST_SUCCESS,
        data: response.data.data,
        params: action.params,
      });
    }else{
      yield put({ 
        type: GET_INSPECTION_LIST_FAIL, 
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

export function* watchGetInspectionList() {
  yield takeLatest(GET_INSPECTION_LIST_SAGA, getInspectionList);
}