import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {
  BEGIN_FETCH, 
  GET_DEFECT_LIST_SAGA, 
  GET_DEFECT_LIST_SUCCESS, 
  GET_DEFECT_LIST_FAIL,
  DELETE_BATCH_DEFECT_SAGA,
  DELETE_BATCH_DEFECT_FAIL,
  SEND_BATCH_DEFECT_SAGA,
  SEND_BATCH_DEFECT_FAIL,
  REJECT_BATCH_DEFECT_SAGA,
  REJECT_BATCH_DEFECT_FAIL,
  CHECK_BATCH_DEFECT_SAGA,
  CHECK_BATCH_DEFECT_FAIL,
  CLOSE_BATCH_DEFECT_SAGA,
  CLOSE_BATCH_DEFECT_FAIL,
  SET_DEFECT_ID_SAGA,
  SET_DEFECT_ID,
  SET_SELECTED_DEFECT_SAGA,
  SET_SELECTED_DEFECT,
  GET_DEFECT_DETAIL_SAGA,
  GET_DEFECT_DETAIL_SUCCESS,
  GET_DEFECT_DETAIL_FAIL,
  GET_DEFECT_LANGUAGE_SAGA,
  GET_DEFECT_LANGUAGE_SUCCESS,
  GET_DEFECT_LANGUAGE_FAIL,
  SEND_DEFECT_SAGA,
  SEND_DEFECT_FAIL,
  REJECT_DEFECT_SAGA,
  REJECT_DEFECT_FAIL,
  CLOSE_DEFECT_SAGA,
  CLOSE_DEFECT_FAIL,
  HANDLE_DEFECT_SAGA,
  HANDLE_DEFECT_FAIL,
  CHECK_DEFECT_SAGA,
  CHECK_DEFECT_FAIL,
  CHANGE_SHOW_CONTAINER_SAGA,
  GET_DEFECTTYPES_SAGA,
  GET_DEFECTTYPES_SAGA_SUCCESS,
  GET_DEFECTTYPES_SAGA_FAIL,
  DEFECT_CREATE_SAGA,
  DEFECT_CREATE_SAGA_SUCCESS,
  DEFECT_CREATE_SAGA_FAIL,
  CLEAR_DEFECT_STATE_SAGA,
  CLEAR_DEFECT_STATE
} from '../../../../constants/actionTypes/Ticket';

//获取缺陷工单列表
function* getDefectList(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEFECT_LIST_SUCCESS, 
        data: response.data.data, 
        params: action.params 
      });      
    }else{
      yield put({ 
        type: GET_DEFECT_LIST_FAIL, 
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷工单详情
function* getDefectDetail(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDefectDetail;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEFECT_DETAIL_SUCCESS, 
        data: response.data.data, 
        params: action.params 
      });      
    }else{
      yield put({ 
        type: GET_DEFECT_DETAIL_FAIL, 
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });        
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷常用语
function* getDefectCommonList(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getCommonList;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEFECT_LANGUAGE_SUCCESS, 
        data: response.data.data.data
      });      
    }else{
      yield put({ 
        type: GET_DEFECT_LANGUAGE_FAIL, 
        error: {
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
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.et('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });      
    } else{
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

//批量关闭工单
function* batchCloseDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.batchCloseDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });      
    } else{
      yield put({ 
        type: CLOSE_BATCH_DEFECT_FAIL, 
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

//批量下发工单
function* batchSendDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.batchSendDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      // console.log(state);
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });      
    } else{
      yield put({ 
        type: SEND_BATCH_DEFECT_FAIL, 
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

//批量驳回工单
function* batchRejectDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.batchRejectDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });      
    } else{
      yield put({ 
        type: REJECT_BATCH_DEFECT_FAIL, 
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

//批量验收工单
function* batchChecktDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.batchCheckDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });      
    } else{
      yield put({ 
        type: CHECK_BATCH_DEFECT_FAIL, 
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

function* setDefectId(action) {
  yield put({ 
    type: SET_DEFECT_ID, 
    data: action.params
  }); 
}

function* setSelectedDefect(action) {
  yield put({ 
    type: SET_SELECTED_DEFECT, 
    data: action.params
  }); 
}

//下发工单
function* sendDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.sendDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
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
    } else{
      yield put({ 
        type: SEND_DEFECT_FAIL, 
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

//驳回工单
function* rejectDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.rejectDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
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
    } else{
      yield put({ 
        type: REJECT_DEFECT_FAIL, 
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

//关闭工单
function* closeDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.closeDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
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
    } else{
      yield put({ 
        type: CLOSE_DEFECT_FAIL, 
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

//执行工单
function* handleDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.handleDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
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
    } else{
      yield put({ 
        type: HANDLE_DEFECT_FAIL, 
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

//验收工单
function* checkDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.checkDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      const pageSize = yield select(state => state.opration.defect.get('currentPageSize'));
      const status = yield select(state => state.opration.defect.get('status'));
      const sort = yield select(state => state.opration.defect.get('sort'));
      yield put({ 
        type: GET_DEFECT_LIST_SAGA, 
        params: {
          defectSource: '3',
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
    } else{
      yield put({ 
        type: CHECK_DEFECT_FAIL, 
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

//获取缺陷类型信息
function *getDefectTypes(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDefectTypes;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: GET_DEFECTTYPES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: GET_DEFECTTYPES_SAGA_FAIL, 
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
//生成缺陷
function *createNewDefect(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.createNewDefect;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({ 
        type: DEFECT_CREATE_SAGA_SUCCESS, 
        params: {
          data: response.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: DEFECT_CREATE_SAGA_FAIL, 
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
function* clearDefect(action) {
  yield put({ 
    type: CLEAR_DEFECT_STATE, 
  }); 
}

export function* watchGetDefectList() {
  yield takeLatest(GET_DEFECT_LIST_SAGA, getDefectList);
}

export function* watchBatchDeleteDefect() {
  yield takeLatest(DELETE_BATCH_DEFECT_SAGA, batchDeleteDefect);
}

export function* watchBatchSendDefect() {
  yield takeLatest(SEND_BATCH_DEFECT_SAGA, batchSendDefect);
}

export function* watchBatchClosedDefect() {
  yield takeLatest(CLOSE_BATCH_DEFECT_SAGA, batchCloseDefect);
}

export function* watchBatchRejectDefect() {
  yield takeLatest(REJECT_BATCH_DEFECT_SAGA, batchRejectDefect);
}

export function* watchBatchCheckdDefect() {
  yield takeLatest(CHECK_BATCH_DEFECT_SAGA, batchChecktDefect);
}

export function* watchSetDefectId() {
  yield takeLatest(SET_DEFECT_ID_SAGA, setDefectId);
}

export function* watchSetSelectedDefect() {
  yield takeLatest(SET_SELECTED_DEFECT_SAGA, setSelectedDefect);
}

export function* watchGetDefectDetail() {
  yield takeLatest(GET_DEFECT_DETAIL_SAGA, getDefectDetail);
}

export function* watchGetDefectCommonList() {
  yield takeLatest(GET_DEFECT_LANGUAGE_SAGA, getDefectCommonList);
}

export function* watchSendDefect() {
  yield takeLatest(SEND_DEFECT_SAGA, sendDefect);
}

export function* watchRejectDefect() {
  yield takeLatest(REJECT_DEFECT_SAGA, rejectDefect);
}

export function* watchCloseDefect() {
  yield takeLatest(CLOSE_DEFECT_SAGA, closeDefect);
}

export function* watchHandleDefect() {
  yield takeLatest(HANDLE_DEFECT_SAGA, handleDefect);
}

export function* watchCheckDefect() {
  yield takeLatest(CHECK_DEFECT_SAGA, checkDefect);
}

export function* watchGetDefectTypes() {
  yield takeLatest(GET_DEFECTTYPES_SAGA, getDefectTypes);
}

export function* watchCreateNewDefect() {
  yield takeLatest(DEFECT_CREATE_SAGA, createNewDefect);
}
export function* watchClearDefect() {
  yield takeLatest(CLEAR_DEFECT_STATE_SAGA, clearDefect);
}
