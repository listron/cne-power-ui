import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';


//获取巡检列表信息
function* getInspectList(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectionList;
  yield put({ type: TicketAction.TICKET_FETCH});
  const { params } = action;
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      yield put({
        type: TicketAction.GET_INSPECT_COMMON_FETCH_SUCCESS,
        ...params,
        total: response.data.data.total,
        inspectStatusStatistics: response.data.data.inspectStatusStatistics,
        inspectList: response.data.data.inspectList,
      });
    }else{
      yield put({ 
        type: TicketAction.GET_INSPECT_LIST_FAIL, 
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
  yield put({type: TicketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: action.params });  
    if(response.data.code === "10000"){
      yield put({ 
        type: TicketAction.GET_INSPECT_DETAIL_SUCCESS, 
        data: response.data.data, 
        params: action.params
      });      
    }else{
      yield put({ 
        type: TicketAction.GET_INSPECT_DETAIL_FAIL, 
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
    type: TicketAction.SET_INSPECT_ID,
    data: action.params
  });
}

// 巡检添加异常
function* addInspectAbnormal(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.addInspectAbnormal;
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params);
    if(response.data.code === "10000"){
      message.success('添加成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: TicketAction.GET_INSPECT_DETAIL_SAGA,
        params: {
          inspectId: inspectId,
        }
      })
    }
    else{
      message.error(response.data.message);
      yield put({
        type: TicketAction.ADD_INSPECT_ABNORMAL_FAIL,
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
    type: TicketAction.CLEAR_INSPECT_STATE, 
  }); 
}

// 巡检异常设备转为工单
function *transformDefect(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.transformDefect;
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params );
    if(response.data.code === "10000"){
      message.success('转工单成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: TicketAction.GET_INSPECT_DETAIL_SAGA,
        params: {
          inspectId: inspectId,
        }
      })
    }else{
      message.success('转工单失败！');
      yield put({
        type: TicketAction.TRANSFORM_DEFECT_FAIL,
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
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){ 
      message.success('验收成功！');
      const pageSize = yield select(state => state.operation.inspect.get('pageSize'));
      const status = yield select(state => state.operation.inspect.get('status'));
      const sort = yield select(state => state.operation.inspect.get('sort'));
      yield put({
        type: TicketAction.GET_INSPECT_LIST_SAGA,
        params:{
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });
    }else{
      message.error('验收失败！')
      yield put({
        type: TicketAction.SET_INSPECT_CHECK_FAIL,
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
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){
      message.success('执行工单转入待验收成功！');
      const pageSize = yield select(state => state.operation.inspect.get('pageSize'));
      const status = yield select(state => state.operation.inspect.get('status'));
      const sort = yield select(state => state.operation.inspect.get('sort'));
      yield put({
        type: TicketAction.GET_INSPECT_LIST_SAGA,
        params:{
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      });
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });
    }else{
      message.error('执行工单转验收失败！')
      yield put({
        type: TicketAction.FINISH_INSPECT_FAIL,
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
// 创建巡检
function *createInspect(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.createInspect;
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){
      message.success('创建成功！')
      const pageSize = yield select(state => state.operation.inspect.get('pageSize'));
      const status = yield select(state => state.operation.inspect.get('status'));
      const sort = yield select(state => state.operation.inspect.get('sort'));
      yield put({
        type: TicketAction.GET_INSPECT_LIST_SAGA,
        params:{
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort,
        }
      })
      yield put({
        type: TicketAction.CHANGE_SHOW_CONTAINER_SAGA,
        params: {container: 'list'},
      });
    }else{
      message.error('创建失败！');
      yield put({
        type: TicketAction.CREATE_INSPECT_FAIL,
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
// 删除异常设备
function *deleteAbnormal(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.deleteAbnormal;
  yield put({ type: TicketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.get, url, {params: action.params })
    if(response.data.code === "10000"){
      message.success('删除成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: TicketAction.GET_INSPECT_DETAIL_SAGA,
        params: { inspectId: inspectId}
      })
    }else{
      message.error('删除失败！');
      yield put({
        type: TicketAction.DELETE_ABNORMAL_FAIL,
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
// 获取巡检标准
function *getInspectStandard(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.getInspectStandard;
  yield put({type: TicketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.get, url, {params: action.params} )
    if(response.data.code === "10000"){
      yield put({
        type: TicketAction.GET_INSPECT_STANDARD_SUCCESS,
        data: response.data.data,
        params: action.params,
      })
    }else{
      yield put({
        type: TicketAction.GET_INSPECT_STANDARD_FAIL,
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
// 巡检批量验收
function *inspectCheckBatch(action){
  let url = Path.basePaths.newAPIBasePath + Path.APISubPaths.ticket.inspectCheckBatch;
  yield put({type: TicketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.post, url, action.params)
    if(response.data.code === "10000"){
      const pageSize = yield select(state => state.operation.inspect.get('pageSize'));
      const status = yield select(state => state.operation.inspect.get('status'));
      const sort = yield select(state => state.operation.inspect.get('sort'));
      yield put({
        type: TicketAction.GET_INSPECT_LIST_SAGA,
        params:{
          stationType: '2',
          status: status,
          pageNum: 0,
          pageSize: pageSize,
          sort: sort
        }
      })
    }else{
      yield put({
        type: TicketAction.INSPECT_CHECK_BATCH_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message,
        }
      })
    }
  }catch(e){
    console.log(e)
  }
}

export function* watchSetInspectId(){
  yield takeLatest(TicketAction.SET_INSPECT_ID_SAGA, setInspectId);
}
export function* watchGetInspectDetail(){
  yield takeLatest(TicketAction.GET_INSPECT_DETAIL_SAGA, getInspectDetail);
}
export function* watchAddInspectAbnormal(){
  yield takeLatest(TicketAction.ADD_INSPECT_ABNORMAL_SAGA, addInspectAbnormal);
}
export function* watchGetInspectList() {
  yield takeLatest(TicketAction.GET_INSPECT_LIST_SAGA, getInspectList);
}
export function* watchClearInspect() {
  yield takeLatest(TicketAction.CLEAR_INSPECT_STATE_SAGA, clearInspect);
}
export function* watchTransformDefect(){
  yield takeLatest(TicketAction.TRANSFORM_DEFECT_SAGA, transformDefect);
}
export function* watchSetInspectCheck(){
  yield takeLatest(TicketAction.SET_INSPECT_CHECK_SAGA, setInspectCheck);
}
export function* watchFinishInspect(){
  yield takeLatest(TicketAction.FINISH_INSPECT_SAGA, finishInspect);
}
export function* watchCreateInspect(){
  yield takeLatest(TicketAction.CREATE_INSPECT_SAGA, createInspect);
}
export function* watchDeleteAbnormal(){
  yield takeLatest(TicketAction.DELETE_ABNORMAL_SAGA, deleteAbnormal);
}
export function* watchGetInspectStandard(){
  yield takeLatest(TicketAction.GET_INSPECT_STANDARD_SAGA, getInspectStandard);
}
export function* watchInspectCheckBatch(){
  yield takeLatest(TicketAction.INSPECT_CHECK_BATCH_SAGA, inspectCheckBatch);
}