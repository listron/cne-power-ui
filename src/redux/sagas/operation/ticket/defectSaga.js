import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { ticketAction } from '../../../../constants/actionTypes/operation/ticketAction';
import { message } from 'antd';

function *changeTicketStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  ticketAction.CHANGE_DEFECT_STORE,
    payload,
  })
}

//获取缺陷工单列表
function* getDefectList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      yield put({ 
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS, 
        payload: {
          ...payload,
          total: response.data.data.total,
          defectList: response.data.data.defectList,
          selectedRowKeys: [],
          defectStatusStatistics: response.data.data.defectStatusStatistics,
        }
      });      
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷工单详情
function* getDefectDetail(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectDetail;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: payload});
    if(response.data.code === '10000'){
      yield put({ 
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS, 
        payload: {
          defectDetail: response.data.data,
          ...payload
        }
      });  
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷常用语
function* getDefectCommonList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getCommonList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: payload});
    if(response.data.code === '10000'){
      yield put({ 
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS, 
        payload: {
          commonList: response.data.data.data
        }
      });      
    }
  } catch (e) {
    console.log(e);
  }
}

//批量删除工单
function* batchDeleteDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchDeleteDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: payload});
    if(response.data.code === '10000'){
      message.success('批量删除成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
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
        type: ticketAction.DELETE_BATCH_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchCloseDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('批量关闭成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
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
        type: ticketAction.CLOSE_BATCH_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchSendDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('批量下发成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
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
        type: ticketAction.SEND_BATCH_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchRejectDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('批量驳回成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
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
        type: ticketAction.REJECT_BATCH_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchCheckDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('批量验收成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
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
        type: ticketAction.CHECK_BATCH_DEFECT_FAIL, 
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

//下发工单
function* sendDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.sendDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('下发成功！');
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });      
    } else{
      yield put({ 
        type: ticketAction.SEND_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.rejectDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('驳回成功！');
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });     
    } else{
      yield put({ 
        type: ticketAction.REJECT_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.closeDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('关闭成功！'); 
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });       
    } else{
      yield put({ 
        type: ticketAction.CLOSE_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.handleDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('处理缺陷成功！');
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });   
    } else{
      yield put({ 
        type: ticketAction.HANDLE_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.checkDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    console.log(response)
    if(response.data.code === '10000'){
      message.success('验收成功！');
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });     
    } else{
      yield put({ 
        type: ticketAction.CHECK_DEFECT_FAIL, 
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectTypes;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, {params: payload});
    if(response.data.code === '10000'){
      yield put({ 
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS, 
        payload: {
          defectTypes: response.data.data.data,
        }
      });       
    }
  } catch (e) {
    console.log(e);
  }
}
//生成缺陷
function *createNewDefect(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.createNewDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      message.success('创建成功！');
      const pageSize = yield select(state => state.operation.defect.get('pageSize'));
      const status = yield select(state => state.operation.defect.get('status'));
      const sort = yield select(state => state.operation.defect.get('sort'));
      yield put({ 
        type: ticketAction.GET_DEFECT_LIST_SAGA, 
        payload: {
          defectSource: '3',
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER,
        payload: {
          container: 'list',
        },
      })       
    } else{
      yield put({ 
        type: ticketAction.DEFECT_CREATE_FAIL, 
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
    type: ticketAction.CLEAR_DEFECT_STATE, 
  }); 
}

export function* watchDefect() {
  yield takeLatest(ticketAction.GET_DEFECT_LIST_SAGA, getDefectList);
  yield takeLatest(ticketAction.CHANGE_DEFECT_STORE_SAGA ,changeTicketStore);
  yield takeLatest(ticketAction.DELETE_BATCH_DEFECT_SAGA, batchDeleteDefect);
  yield takeLatest(ticketAction.SEND_BATCH_DEFECT_SAGA, batchSendDefect);
  yield takeLatest(ticketAction.CLOSE_BATCH_DEFECT_SAGA, batchCloseDefect);
  yield takeLatest(ticketAction.REJECT_BATCH_DEFECT_SAGA, batchRejectDefect);
  yield takeLatest(ticketAction.CHECK_BATCH_DEFECT_SAGA, batchChecktDefect);
  yield takeLatest(ticketAction.GET_DEFECT_DETAIL_SAGA, getDefectDetail);
  yield takeLatest(ticketAction.GET_DEFECT_LANGUAGE_SAGA, getDefectCommonList);
  yield takeLatest(ticketAction.SEND_DEFECT_SAGA, sendDefect);
  yield takeLatest(ticketAction.REJECT_DEFECT_SAGA, rejectDefect);
  yield takeLatest(ticketAction.CLOSE_DEFECT_SAGA, closeDefect);
  yield takeLatest(ticketAction.HANDLE_DEFECT_SAGA, handleDefect);
  yield takeLatest(ticketAction.CHECK_DEFECT_SAGA, checkDefect);
  yield takeLatest(ticketAction.GET_DEFECT_TYPE_SAGA, getDefectTypes);
  yield takeLatest(ticketAction.DEFECT_CREATE_SAGA, createNewDefect);
  yield takeLatest(ticketAction.CLEAR_DEFECT_STATE_SAGA, clearDefect);
  
}



















