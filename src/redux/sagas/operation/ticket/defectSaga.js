import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';
import { message } from 'antd';

function *changeTicketStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  TicketAction.GET_DEFECT_COMMON_FETCH_SUCCESS,
    payload,
  })
}

//获取缺陷工单列表
function* getDefectList(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SUCCESS, 
        data: response.data.data, 
        params: action.params 
      });      
    }else{
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: {defectId:action.params.defectId}});
    if(response.data.code === '10000'){
      yield put({ 
        type: TicketAction.GET_DEFECT_DETAIL_SUCCESS, 
        data: response.data.data, 
        params: action.params 
      });  
      if(action.params.editNewDefect){
        yield put({
          type: TicketAction.CHANGE_SHOW_CONTAINER,
          data: {
            container: 'create',
            editNewDefect:true
          },
        });
      }    
    }else{
      yield put({ 
        type: TicketAction.GET_DEFECT_DETAIL_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: TicketAction.GET_DEFECT_LANGUAGE_SUCCESS, 
        data: response.data.data.data
      });      
    }else{
      yield put({ 
        type: TicketAction.GET_DEFECT_LANGUAGE_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      message.success('批量删除成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.DELETE_BATCH_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('批量关闭成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.CLOSE_BATCH_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('批量下发成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.SEND_BATCH_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('批量驳回成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.REJECT_BATCH_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('批量验收成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.CHECK_BATCH_DEFECT_FAIL, 
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
    type: TicketAction.SET_DEFECT_ID, 
    data: action.params
  }); 
}

function* setSelectedDefect(action) {
  yield put({ 
    type: TicketAction.SET_SELECTED_DEFECT, 
    data: action.params
  }); 
}

//下发工单
function* sendDefect(action) {
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.sendDefect;
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('下发成功！');
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });      
    } else{
      yield put({ 
        type: TicketAction.SEND_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('驳回成功！');
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });     
    } else{
      yield put({ 
        type: TicketAction.REJECT_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('关闭成功！'); 
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });       
    } else{
      yield put({ 
        type: TicketAction.CLOSE_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('处理缺陷成功！');
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });   
    } else{
      yield put({ 
        type: TicketAction.HANDLE_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    console.log(response)
    if(response.data.code === '10000'){
      message.success('验收成功！');
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });     
    } else{
      yield put({ 
        type: TicketAction.CHECK_DEFECT_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: action.params});
    if(response.data.code === '10000'){
      yield put({ 
        type: TicketAction.GET_DEFECTTYPES_SAGA_SUCCESS, 
        params: {
          data: response.data.data.data, 
          params: action.params 
        }
      });       
    } else{
      yield put({ 
        type: TicketAction.GET_DEFECTTYPES_SAGA_FAIL, 
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
  yield put({ type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === '10000'){
      message.success('创建成功！');
      const pageSize = yield select(state => state.operation.defect.get('currentPageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: TicketAction.GET_DEFECT_LIST_SAGA, 
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
        type: TicketAction.CHANGE_SHOW_CONTAINER,
        data: {
          container: 'list',
        },
      })       
    } else{
      yield put({ 
        type: TicketAction.DEFECT_CREATE_FAIL, 
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
    type: TicketAction.CLEAR_DEFECT_STATE, 
  }); 
}


export function* watchGetDefectList() {
  yield takeLatest(TicketAction.GET_DEFECT_LIST_SAGA, getDefectList);
  yield takeLatest(TicketAction.CHANGE_DEFECT_STORE_SAGA ,changeTicketStore);
}

export function* watchBatchDeleteDefect() {
  yield takeLatest(TicketAction.DELETE_BATCH_DEFECT_SAGA, batchDeleteDefect);
}

export function* watchBatchSendDefect() {
  yield takeLatest(TicketAction.SEND_BATCH_DEFECT_SAGA, batchSendDefect);
}

export function* watchBatchClosedDefect() {
  yield takeLatest(TicketAction.CLOSE_BATCH_DEFECT_SAGA, batchCloseDefect);
}

export function* watchBatchRejectDefect() {
  yield takeLatest(TicketAction.REJECT_BATCH_DEFECT_SAGA, batchRejectDefect);
}

export function* watchBatchCheckdDefect() {
  yield takeLatest(TicketAction.CHECK_BATCH_DEFECT_SAGA, batchChecktDefect);
}

export function* watchSetDefectId() {
  yield takeLatest(TicketAction.SET_DEFECT_ID_SAGA, setDefectId);
}

export function* watchSetSelectedDefect() {
  yield takeLatest(TicketAction.SET_SELECTED_DEFECT_SAGA, setSelectedDefect);
}

export function* watchGetDefectDetail() {
  yield takeLatest(TicketAction.GET_DEFECT_DETAIL_SAGA, getDefectDetail);
}

export function* watchGetDefectCommonList() {
  yield takeLatest(TicketAction.GET_DEFECT_LANGUAGE_SAGA, getDefectCommonList);
}

export function* watchSendDefect() {
  yield takeLatest(TicketAction.SEND_DEFECT_SAGA, sendDefect);
}

export function* watchRejectDefect() {
  yield takeLatest(TicketAction.REJECT_DEFECT_SAGA, rejectDefect);
}

export function* watchCloseDefect() {
  yield takeLatest(TicketAction.CLOSE_DEFECT_SAGA, closeDefect);
}

export function* watchHandleDefect() {
  yield takeLatest(TicketAction.HANDLE_DEFECT_SAGA, handleDefect);
}

export function* watchCheckDefect() {
  yield takeLatest(TicketAction.CHECK_DEFECT_SAGA, checkDefect);
}

export function* watchGetDefectTypes() {
  yield takeLatest(TicketAction.GET_DEFECTTYPES_SAGA, getDefectTypes);
}

export function* watchCreateNewDefect() {
  yield takeLatest(TicketAction.DEFECT_CREATE_SAGA, createNewDefect);
}
export function* watchClearDefect() {
  yield takeLatest(TicketAction.CLEAR_DEFECT_STATE_SAGA, clearDefect);
}
