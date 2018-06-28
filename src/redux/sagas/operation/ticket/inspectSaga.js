import { call, put, takeLatest, select } from 'redux-saga/effects';
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
  CLEAR_INSPECT_STATE,
  TRANSFORM_DEFECT_SAGA,
  TRANSFORM_DEFECT_SUCCESS,
  TRANSFORM_DEFECT_FAIL,
  SET_INSPECT_CHECK_SAGA,
  SET_INSPECT_CHECK_FAIL,
  FINISH_INSPECT_SAGA,
  FINISH_INSPECT_SUCCESS,
  FINISH_INSPECT_FAIL,
  CHANGE_SHOW_CONTAINER_SAGA,
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
// 清除Inspect
function* clearInspect(action) {
  yield put({ 
    type: CLEAR_INSPECT_STATE, 
  }); 
}

// 巡检异常设备转为工单
function *transformDefect(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.transformDefect;
  yield put({ type: TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params );
    if(response.data.code === "10000"){
      yield put({
        type: TRANSFORM_DEFECT_SUCCESS,
        data: response.data.data,
        params: action.params,
      })
    }else{
      yield put({
        type: TRANSFORM_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message,
        }
      })
    }
  }catch(e){
    console.log(e);
  }
}

// 巡检验收
function *setInspectCheck(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.setInspectCheck;
  yield put({ type: TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){
      // const newState = yield select();
      // console.log(newState);  
      const pageSize = yield select(state => state.opration.inspect.get('pageSize'));
      const status = yield select(state => state.opration.inspect.get('status'));
      const sort = yield select(state => state.opration.inspect.get('sort'));
      yield put({
        type: GET_INSPECT_LIST_SAGA,
        params:{
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });
      yield put({
        type: CHANGE_SHOW_CONTAINER_SAGA,
        params: 'list'
      });
    }else{
      yield put({
        type: SET_INSPECT_CHECK_FAIL,
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
// 完成巡检
function *finishInspect(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.finishInspect;
  yield put({ type: TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){
      yield put({
        type: FINISH_INSPECT_SUCCESS,
        data: response.data.data,
        params: action.params,
      })
    }else{
      yield put({
        type: FINISH_INSPECT_FAIL,
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
export function* watchGetInspectList() {
  yield takeLatest(GET_INSPECT_LIST_SAGA, getInspectList);
}
export function* watchClearInspect() {
  yield takeLatest(CLEAR_INSPECT_STATE_SAGA, clearInspect);
}
export function* watchTransformDefect(){
  yield takeLatest(TRANSFORM_DEFECT_SAGA, transformDefect);
}
export function* watchSetInspectCheck(){
  yield takeLatest(SET_INSPECT_CHECK_SAGA, setInspectCheck);
}
export function* watchFinishInspect(){
  yield takeLatest(FINISH_INSPECT_SAGA, finishInspect);
}