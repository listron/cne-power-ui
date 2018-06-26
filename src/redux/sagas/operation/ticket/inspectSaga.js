import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  TICKET_FETCH, 
  GET_INSPECT_LIST_SAGA, 
  GET_INSPECT_LIST_SUCCESS, 
  GET_INSPECT_LIST_FAIL,
  GET_INSPECT_DETAIL_SAGA,
  GET_INSPECT_DETAIL_SUCCESS,
  GET_INSPECT_DETAIL_FAIL,
  SET_INSPECT_ID_SAGA,
  SET_INSPECT_ID,
  ADD_INSPECT_ABNORMAL_SAGA,
  ADD_INSPECT_ABNORMAL_SUCCESS,
  ADD_INSPECT_ABNORMAL_FAIL,
  CLEAR_INSPECT_STATE_SAGA,
  CLEAR_INSPECT_STATE
} from '../../../../constants/actionTypes/Ticket';


//获取巡检列表信息
function* getInspectList(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectionList;
  yield put({ type: TICKET_FETCH});
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

// 获取巡检工单详情
function* getInspectDetail(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectDetail;
  yield put({type: TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.params });  
    if(response.data.code === "10000"){
      yield put({ 
        type: GET_INSPECT_DETAIL_SUCCESS, 
        data: response.data.data, 
        params: action.params
      });      
    }else{
      yield put({ 
        type: GET_INSPECT_DETAIL_FAIL, 
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch(e) {
    console.log(e);
  }
}


// 获取巡检ID
function* setInspectId(action){
  yield put({
    type: SET_INSPECT_ID,
    data: action.params
  });
}

// 添加巡检异常
function* addInspectAbnormal(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.addInspectAbnormal;
  yield put({ type: TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, {params: action.params});
    if(response.data.code === "10000"){
      yield put({
        type: ADD_INSPECT_ABNORMAL_SUCCESS,
        data: response.data.data,
        params: action.params,
      })
    }
    else{
      yield put({
        type: ADD_INSPECT_ABNORMAL_FAIL,
        error:{
          code: response.data.code,
          message: response.data.message,
        }
      })
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchSetInspectId(){
  yield takeLatest(SET_INSPECT_ID_SAGA, setInspectId);
}

export function* watchGetInspectDetail(){
  yield takeLatest(GET_INSPECT_DETAIL_SAGA, getInspectDetail);
}

export function* watchAddInspectAbnormal(){
  yield takeLatest(ADD_INSPECT_ABNORMAL_SAGA, addInspectAbnormal);
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