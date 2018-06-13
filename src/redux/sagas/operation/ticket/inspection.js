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
  console.log(action);
  // let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectionList;
  let url = '/mock/operation/inspectionList';
  yield put({ type: BEGIN_FETCH});
  try{
    const response = yield call(axios.post, url, {inspectStatus: 2, stationType: 0});
    if(response.data.success){
      yield put({ type: GET_INSPECTION_LIST_SUCCESS, data: response.data.data});
    }else{
      yield put({ type: GET_INSPECTION_LIST_FAIL, data:{error:response.data.data }});
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchGetInspectionList() {
  yield takeLatest(GET_INSPECTION_LIST_SAGA, getInspectionList);
}