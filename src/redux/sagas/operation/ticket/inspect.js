import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
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
  GET_DEVICE_TYPE_LIST_SAGA,
  GET_DEVICE_TYPE_LIST_SUCCESS,
  GET_DEVICE_TYPE_LIST_FAIL,
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

// 获取巡检工单详情
function* getInspectDetail(action){
  let detailUrl = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectDetail;
  let typeListUrl = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDeviceTypeList;
  yield put({type: BEGIN_FETCH });
  try {
    const [detail, typeList] = yield [
      call(axios.get, detailUrl, { params: action.params.inspectId }),
      call(axios.get, typeListUrl, { params: action.params.stationCodes })
    ];
    console.log(detail, typeList)
    console.log("==================")
    console.log(detail.data.code)    
    if(detail.data.code === "10000"){
      yield put({ 
        type: GET_INSPECT_DETAIL_SUCCESS, 
        data:{
          detailData: detail.data.data,
          typeListData: typeList.data.data,
          params: action.params,
        },
      });      
    }else{
      yield put({ 
        type: GET_INSPECT_DETAIL_FAIL, 
        error:{
          code: detail.data.code,
          message: detail.data.message
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

// 添加巡检详情
function* addInspectAbnormal(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.addInspectAbnormal;
  yield put({ type: BEGIN_FETCH })
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

// 获取设备类型，设备名称，缺陷类型列表
function* getTotalData(action){
  let getDeviceTypeList = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDeviceTypeList;
  console.log(action);
  yield put({ type: BEGIN_FETCH })
  try{
    const response = yield call(axios.get, getDeviceTypeList, {params: action.params});
    console.log(response);
    if(response.data.code === "10000"){
      yield put({
        type: GET_DEVICE_TYPE_LIST_SUCCESS,
        data: response.data.data,
        params: action.params,
      })
    }
    else{
      yield put({
        type: GET_DEVICE_TYPE_LIST_FAIL,
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

export function* watchGetTotalData(){
  yield takeLatest(GET_DEVICE_TYPE_LIST_SAGA, getTotalData);
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