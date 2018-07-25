import { call, put, takeLatest,select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import { departmentAction } from '../../../constants/actionTypes/system/departmentAction';


function *changeDepartmentStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  departmentAction.CHANGE_DEPARTMENT_STORE_SUCCESS,
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
      type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
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
  console.log(action)
  // const { payload } = action;
  // const url = '/mock/system/deleteDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
  try{
    // yield put({ type:departmentAction.DEPARTMENT_FETCH });
    // const response = yield call(axios.post,url,payload);
    // yield put({
    //   type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
    //   payload:{
    //     ...payload,
    //     departmentData: response.data.data.departmentData,
    //     totalNum: response.data.data.totalNum,
    //   },
    // });
  }catch(e){
    console.log(e);
  }
}

//获取所有用户--todo 获取该企业所有用户，用于分配所有用户数据
function *getAllUsers(action){
  try{
    //todo
  }catch(e){
    console.log(e)
  }
}

function *getAllDepartment(action){//获取所有部门基础信息
  const { payload } = action;
  const url = '/mock/system/allDepartments';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentAllList}/${payload.enterpriseId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
      payload:{
        allDepartment: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

//todo - 请求单部门详细数据信息
function *getDepartmentDetail(action){
  const { payload } = action;
  const url = '/mock/system/departmentDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}/${payload.departmentId}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
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
    // const detailUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}/${departmentId}`
    const detailResponse = yield call(axios.get,detailUrl);
    yield put({
      type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
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

function *addDepartmentInfor(action){//新建部门信息
  const { payload } = action;
  const url = '/mock/system/addDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}`
  try{
    yield put({ //按钮的loading
      type:departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
      payload: {
        buttonLoading: !payload.continueAdd,
        continueAddLoading: payload.continueAdd,
      } 
    });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
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

function *editDepartmentInfor(action){//编辑部门信息
  const { payload } = action;
  const url = '/mock/system/editDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}`
  try{
    yield put({ //按钮的loading
      type:departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
      payload: { buttonLoading: true } 
    });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
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

//todo - 请求各部门及部门下各电站信息
function *getDepartmentWithStation(){

}

//todo - 请求各部门及部门下各用户信息
function *getDepartmentWithUser(){
  
}

export function* watchDepartment() {
  yield takeLatest(departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, changeDepartmentStore);
  yield takeLatest(departmentAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
  yield takeLatest(departmentAction.DELETE_DEPARTMENT_SAGA,deleteDepartment);
  yield takeLatest(departmentAction.GET_ALL_USERS_SAGA,getAllUsers);
  yield takeLatest(departmentAction.GET_ALL_DEPARTMENT,getAllDepartment);
  yield takeLatest(departmentAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
  yield takeLatest(departmentAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA,getOtherPageDetail);
  yield takeLatest(departmentAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfor);
  yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);
}

