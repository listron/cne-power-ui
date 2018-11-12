import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { ticketAction } from '../ticketAction';

function *changeInspectStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  ticketAction.CHANGE_INSPECT_STORE,
    payload,
  })
}
//获取巡检列表信息
function* getInspectList(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectionList;
  yield put({ type: ticketAction.TICKET_FETCH});
  try{
    const response = yield call(axios.post, url, payload);
    if(response.data.code === "10000"){
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if(total === 0){ // 总数为0时，展示0页
        pageNum = 0;
      }else if(maxPage < pageNum){ // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          ...payload,
          total,
          pageNum,
          inspectStatusStatistics: response.data.data.inspectStatusStatistics,
          inspectList: response.data.data.inspectList,
          selectedRowKeys: [],
        }
        
      });
    }
  }catch(e){
    console.log(e);
  }
}

//获取巡检工单Id列表(用于上一个，下一个)
function* getInspectIdList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectIdList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      yield put({ 
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS, 
        payload: {
          inspectIdList: response.data.data
        }
      });      
    }
  } catch (e) {
    console.log(e);
  }
}

// 获取巡检工单详情
function* getInspectDetail(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectDetail;
  yield put({type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: payload });  
    if(response.data.code === "10000"){
      yield put({ 
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS, 
        payload: {
          inspectDetail: response.data.data,
          ...payload
        }
      });      
    }
  } catch(e) {
    console.log(e);
  }
}

// 巡检添加异常
function* addInspectAbnormal(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.addInspectAbnormal;
  yield put({ type: ticketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, payload);
    if(response.data.code === "10000"){
      message.success('添加成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: ticketAction.GET_INSPECT_DETAIL_SAGA,
        payload: {
          inspectId,
        }
      })
    }
    else{
      message.error(response.data.message);
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
    type: ticketAction.CLEAR_INSPECT_STATE, 
  }); 
}

// 巡检异常设备转为工单
function *transformDefect(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.transformDefect;
  yield put({ type: ticketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, payload );
    if(response.data.code === "10000"){
      message.success('转工单成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: ticketAction.GET_INSPECT_DETAIL_SAGA,
        payload: {
          inspectId,
        }
      });
    }else{
      message.success('转工单失败！');
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.setInspectCheck;
  yield put({ type: ticketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, payload)
    if(response.data.code === "10000"){ 
      message.success('验收成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        sort: state.operation.defect.get('sort'),
        // handleUser: state.operation.defect.get('handleUser'),
        // hasAbnormal: state.operation.defect.get('hasAbnormal'),
      }));
      yield put({
        type: ticketAction.GET_INSPECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });
    }else{
      message.error('验收失败！')
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
// 完成巡检
function *finishInspect(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.finishInspect;
  yield put({ type: ticketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.post, url, payload)
    if(response.data.code === "10000"){
      message.success('执行工单转入待验收成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        sort: state.operation.defect.get('sort'),
        // handleUser: state.operation.defect.get('handleUser'),
        // hasAbnormal: state.operation.defect.get('hasAbnormal'),
      }));
      yield put({
        type: ticketAction.GET_INSPECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {container: 'list'},
      });
    }else{
      message.error('执行工单转验收失败！')
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.createInspect;
  yield put({ type: ticketAction.TICKET_FETCH });
  const isContinueAdd = payload.isContinueAdd;
  delete payload.isContinueAdd;
  try{
    const response = yield call(axios.post, url, payload)
    if(response.data.code === "10000"){
      message.success('创建成功！')
      if(!isContinueAdd) {
        yield put({
          type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
          payload: {container: 'list'},
        });
      }
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        sort: state.operation.defect.get('sort'),
        // handleUser: state.operation.defect.get('handleUser'),
        // hasAbnormal: state.operation.defect.get('hasAbnormal'),
      }));
      yield put({
        type: ticketAction.GET_INSPECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.GET_INSPECT_ID_LIST_SAGA,
        payload: params
      });
    }else{
      message.error('创建失败！');
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.deleteAbnormal;
  yield put({ type: ticketAction.TICKET_FETCH })
  try{
    const response = yield call(axios.get, url, {params: payload })
    if(response.data.code === "10000"){
      message.success('删除成功！');
      const inspectId = yield select(state => state.operation.inspect.get('inspectId'));
      yield put({
        type: ticketAction.GET_INSPECT_DETAIL_SAGA,
        payload: { inspectId }
      })
    }else{
      message.error('删除失败！');
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectStandard;
  yield put({type: ticketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.get, url, {params: payload} )
    if(response.data.code === "10000" && response.data.data.collection !== '0'){
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          inspectStandard: response.data.data.data,
        }
      })
    }
  }catch(e){
    console.log(e);
  }
}
// 巡检批量验收
function *inspectCheckBatch(action){
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.inspectCheckBatch;
  yield put({type: ticketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.post, url, payload)
    if(response.data.code === "10000"){
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        sort: state.operation.defect.get('sort'),
        // handleUser: state.operation.defect.get('handleUser'),
        // hasAbnormal: state.operation.defect.get('hasAbnormal'),
      }));
      yield put({
        type: ticketAction.GET_INSPECT_LIST_SAGA,
        payload: params
      });
    }else{
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
function *getInspectDetailRecord(action){//获取巡检记录的table列表数据
  const { payload } = action;
  let url='/mock/operation/inspectionList';
  //let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectDetailRecord;
  yield put({type: ticketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.get, url, {params: payload} )
    if(response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          inspectDetailRecord: response.data.data.recordData||[],
          totalCount:response.data.data.totalCount||0    
        },
      });     
    }  else{
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
function *getInspectUsers(action){//获得该电站下的巡检人
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectUsers;
  yield put({type: ticketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.get, url )
    if(response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          inspectUsers: response.data.data||[],          
        },
      });     
    }  else{
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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
function *getInspectOrbit(action){//获得巡检人的巡检轨迹
  const { payload } = action;
   let url='/mock/operation/inspect/track';
  //let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getInspectOrbit;
  yield put({type: ticketAction.TICKET_FETCH})
  try{
    const response = yield call(axios.get, url,{ params: payload } )
    if(response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_INSPECT_FETCH_SUCCESS,
        payload: {
          inspectUserData: response.data.data.userData||[],          
          inspectTrackData: response.data.data.trackData||[],          
        },
      });     
    }  else{
      yield put({
        type: ticketAction.SET_INSPECT_FAIL,
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

export function* watchInspect() {
  yield takeLatest(ticketAction.GET_INSPECT_DETAIL_SAGA, getInspectDetail);
  yield takeLatest(ticketAction.CHANGE_INSPECT_STORE_SAGA ,changeInspectStore);
  yield takeLatest(ticketAction.ADD_INSPECT_ABNORMAL_SAGA, addInspectAbnormal);
  yield takeLatest(ticketAction.GET_INSPECT_LIST_SAGA, getInspectList);
  yield takeLatest(ticketAction.GET_INSPECT_ID_LIST_SAGA, getInspectIdList);
  yield takeLatest(ticketAction.CLEAR_INSPECT_STATE_SAGA, clearInspect);
  yield takeLatest(ticketAction.TRANSFORM_DEFECT_SAGA, transformDefect);
  yield takeLatest(ticketAction.SET_INSPECT_CHECK_SAGA, setInspectCheck);
  yield takeLatest(ticketAction.FINISH_INSPECT_SAGA, finishInspect);
  yield takeLatest(ticketAction.CREATE_INSPECT_SAGA, createInspect);
  yield takeLatest(ticketAction.DELETE_ABNORMAL_SAGA, deleteAbnormal);
  yield takeLatest(ticketAction.GET_INSPECT_STANDARD_SAGA, getInspectStandard);
  yield takeLatest(ticketAction.CHECK_BATCH_INSPECT_SAGA, inspectCheckBatch);
  yield takeLatest(ticketAction.getInspectDetailRecord, getInspectDetailRecord);
  yield takeLatest(ticketAction.getInspectUsers, getInspectUsers);
  yield takeLatest(ticketAction.getInspectOrbit, getInspectOrbit);
}