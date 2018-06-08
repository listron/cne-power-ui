import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Config from '../../../../constants/config';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
  GET_DEFECT_LIST_SAGA, 
  GET_DEFECT_LIST_SUCCESS, 
  GET_DEFECT_LIST_FAIL
} from '../../../../constants/actionTypes/Ticket';


//根据缺陷工单列表
function* getDefectList(action) {
  let url = Config.APIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, {defectSource: 0});
    if(response.data.success){
      yield put({ type: GET_DEFECT_LIST_SUCCESS, data: response.data.data });      
    }else{
      yield put({ type: GET_DEFECT_LIST_FAIL, data: {error:response.data.code}});        
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchGetDefectList() {
  yield takeLatest(GET_DEFECT_LIST_SAGA, getDefectList);
}