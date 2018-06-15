import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
  GET_DEFECT_LIST_SAGA, 
  GET_DEFECT_LIST_SUCCESS, 
  GET_DEFECT_LIST_FAIL,
  DELETE_BATCH_DEFECT_SAGA,
  DELETE_BATCH_DEFECT_SUCCESS,
  DELETE_BATCH_DEFECT_FAIL,
} from '../../../../constants/actionTypes/Ticket';

//获取缺陷工单列表
function* getDefectList(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      yield put({ 
        type: GET_DEFECT_LIST_SUCCESS, 
        data: response.data.data, 
        params: action.params 
      });      
    }else{
      yield put({ 
        type: GET_DEFECT_LIST_FAIL, 
        error:{
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}

//批量删除工单
function* batchDeleteDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.batchDeleteDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.get, url, action.params);
    if(response.data.code === "10000"){
      yield put({ 
        type: DELETE_BATCH_DEFECT_SUCCESS, 
        data: response.data.data.data
      });      
    }else{
      yield put({ 
        type: DELETE_BATCH_DEFECT_FAIL, 
        error:{
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchGetDefectList() {
  yield takeLatest(GET_DEFECT_LIST_SAGA, getDefectList);
}

export function* watchBatchDeleteDefect() {
  yield takeLatest(DELETE_BATCH_DEFECT_SAGA, batchDeleteDefect);
}