import { call, put, takeLatest,select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';

import { departmentAction } from '../../../../constants/actionTypes/system/account/departmentAction';


function *changeDepartmentStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  departmentAction.CHANGE_DEPARTMENT_STORE,
    payload,
  })
}

function *getDepartmentList(action){//请求部门列表数据
  const { payload } = action;
  const url = '/mock/system/departmentList';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        ...payload,
        departmentData: response.data.data.departmentData,
        totalNum: response.data.data.totalNum,
        buttonLoading: false
      },
    });
  }catch(e){
    console.log(e);
  }
}
//todo - 删除部门
function *deleteDepartment(action){
  const { payload } = action;
  const url = '/mock/system/deleteDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.delete,url,payload);
    if(response.data.code === "10000"){
      yield put({//清空选中项
        type:  departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          selectedDepartment: [],
        },
      })
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.department.get('departmentSource'),
        departmentName: state.department.get('departmentName'),
        parentDepartmentName: state.department.get('parentDepartmentName'),
        stationName: state.department.get('stationName'), 
        sort: state.department.get('sort'),
        ascend: state.department.get('ascend'),
        pageNum: state.department.get('pageNum'),
        pageSize: state.department.get('pageSize'),
      }));
      yield put({
        type:  departmentAction.GET_DEPARTMENT_LIST_SAGA,
        payload: params,
      });
    }
  }catch(e){
    console.log(e);
  }
}

//获取该企业所有用户，用于部门分配用户数据
function *getAllUser(action){
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getAllUser}/${payload.enterpriseId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        userList: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getAllDepartment(action){//获取所有部门基础信息
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getAllDepartment}/${payload.enterpriseId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        allDepartment: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getAllStation(action){//获取所有电站
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getAllStation}/${payload.enterpriseId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        allStation: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getDepartmentDetail(action){// 请求单部门详细数据信息
  const { payload } = action;
  const url = '/mock/system/departmentDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfo}/${payload.departmentId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        departmentDetail: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getOtherPageDetail(action){//部门详情页第一条查看前一条详情/最后一条看下一条详情=>翻页+请求详情
  const { payload, previous } = action;
  const listUrl = '/mock/system/departmentList';
  // const listUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const listResponse = yield call(axios.post,listUrl,payload);
    const { departmentData, totalNum } = listResponse.data.data;
    const { departmentId } = previous?departmentData[departmentData.length - 1]:departmentData[0];
    const detailUrl = '/mock/system/departmentDetail';
    // const detailUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfo}/${departmentId}`
    const detailResponse = yield call(axios.get,detailUrl);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload:{
        ...payload,
        departmentData,
        totalNum,
        departmentDetail: detailResponse.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *addDepartmentInfo(action){//新建部门信息
  const { payload } = action;
  const url = '/mock/system/addDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfo}`
  try{
    yield put({ //按钮的loading
      type:departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: {
        buttonLoading: !payload.continueAdd,
        continueAddLoading: payload.continueAdd,
      } 
    });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.CHANGE_DEPARTMENT_STORE,
        payload:{
          showPage: payload.continueAdd?'add':'list',
          buttonLoading: false,
          continueAddLoading: false,
        }
      });
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.department.get('departmentSource'),
        departmentName: state.department.get('departmentName'),
        parentDepartmentName: state.department.get('parentDepartmentName'),
        stationName: state.department.get('stationName'), 
        sort: state.department.get('sort'),
        ascend: state.department.get('ascend'),
        pageNum: state.department.get('pageNum'),
        pageSize: state.department.get('pageSize'),
      }));
      yield put({
        type:  departmentAction.GET_DEPARTMENT_LIST_SAGA,
        payload: params,
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *editDepartmentInfo(action){//编辑部门信息
  const { payload } = action;
  const url = '/mock/system/editDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfo}`
  try{
    yield put({ //按钮的loading
      type:departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: { buttonLoading: true } 
    });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.CHANGE_DEPARTMENT_STORE,
        payload:{
          showPage: 'list',
        }
      });
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.department.get('departmentSource'),
        departmentName: state.department.get('departmentName'),
        parentDepartmentName: state.department.get('parentDepartmentName'),
        stationName: state.department.get('stationName'), 
        sort: state.department.get('sort'),
        ascend: state.department.get('ascend'),
        pageNum: state.department.get('pageNum'),
        pageSize: state.department.get('pageSize'),
      }));
      yield put({
        type:  departmentAction.GET_DEPARTMENT_LIST_SAGA,
        payload: params,
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *setDepartmentUser(action) {
  const { payload } = action;
  // const url = '/mock/system/editDepartment';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.setDepartmentUser}`
  try{
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      const showPage = yield select(state => state.system.department.get('showPage'));
      if(showPage === 'detail') {
        yield put({
          type:  departmentAction.GET_DEPARTMENT_DETAIL_SAGA,
          payload:{
            departmentId: payload.departmentId,
          }
        });
      }
    }
  }catch(e){
    console.log(e);
  }
}

function *setDepartmentStation(action) {
  const { payload } = action;
  // const url = '/mock/system/editDepartment';
  const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.setDepartmentStation}`
  try{
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      const showPage = yield select(state => state.system.department.get('showPage'));
      if(showPage === 'detail') {
        yield put({
          type:  departmentAction.GET_DEPARTMENT_DETAIL_SAGA,
          payload:{
            departmentId: payload.departmentId,
          }
        });
      }
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.department.get('departmentSource'),
        departmentName: state.department.get('departmentName'),
        parentDepartmentName: state.department.get('parentDepartmentName'),
        stationName: state.department.get('stationName'), 
        sort: state.department.get('sort'),
        ascend: state.department.get('ascend'),
        pageNum: state.department.get('pageNum'),
        pageSize: state.department.get('pageSize'),
      }));
      yield put({
        type:  departmentAction.GET_DEPARTMENT_LIST_SAGA,
        payload: params,
      });
    }
  }catch(e){
    console.log(e);
  }
}


export function* watchDepartment() {
  yield takeLatest(departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, changeDepartmentStore);
  yield takeLatest(departmentAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
  yield takeLatest(departmentAction.DELETE_DEPARTMENT_SAGA,deleteDepartment);
  yield takeLatest(departmentAction.GET_ALL_USER_SAGA,getAllUser);
  yield takeLatest(departmentAction.GET_ALL_DEPARTMENT_SAGA,getAllDepartment);
  yield takeLatest(departmentAction.GET_ALL_STATION_SAGA,getAllStation);
  yield takeLatest(departmentAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
  yield takeLatest(departmentAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA,getOtherPageDetail);
  yield takeLatest(departmentAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfo);
  yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfo);
  yield takeLatest(departmentAction.SET_DEPARTMENT_USER_SAGA,setDepartmentUser);
  yield takeLatest(departmentAction.SET_DEPARTMENT_STATION_SAGA,setDepartmentStation);
}

