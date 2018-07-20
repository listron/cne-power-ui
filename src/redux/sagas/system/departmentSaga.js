import { call, put, takeLatest,select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

import { departmentAction } from '../../../constants/actionTypes/system/departmentAction';

//存储payload指定参数，替换reducer-store属性。
function *changeDepartmentStore(action){
  const { payload } = action;
  yield put({
    type:  departmentAction.CHANGE_DEPARTMENT_STORE_SUCCESS,
    payload,
  })
}

//请求部门列表数据
function *getDepartmentList(action){
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
      },
    });
  }catch(e){
    console.log(e);
  }
}
//删除部门
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

//请求单部门详细数据信息
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

//新建部门信息
function *addDepartmentInfor(action){
  const { payload } = action;
  const url = '/mock/system/addDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.GET_DEPARTMENT_COMMON_FETCH_SUCCESS,
        payload:{
          showPage: 'list',
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}

//编辑部门信息
function *editDepartmentInfor(action){
  const { payload } = action;
  const url = '/mock/system/editDepartment';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}`
  try{
    yield put({ type:departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  departmentAction.GET_ENTERPRISE_COMMON_FETCH_SUCCESS,
        payload:{
          showPage: 'detail',
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}

//请求各部门及部门下各电站信息
function *getDepartmentWithStation(){

}

//请求各部门及部门下各用户信息
function *getDepartmentWithUser(){
  
}

export function* watchDepartment() {
  yield takeLatest(departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, changeDepartmentStore);
  yield takeLatest(departmentAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
  yield takeLatest(departmentAction.DELETE_DEPARTMENT_SAGA,deleteDepartment);
  yield takeLatest(departmentAction.GET_ALL_USERS_SAGA,getAllUsers);
  yield takeLatest(departmentAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
  yield takeLatest(departmentAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfor);
  yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);
}

