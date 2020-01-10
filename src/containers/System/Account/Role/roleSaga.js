import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { replacePathParams } from '../../../../utils';
import Cookie from 'js-cookie';
import { roleAction } from './roleAction';
import { message } from 'antd';

function *changeRoleStore(action){//不是异步请求，仅修改reducer的函数
  const { payload } = action;
  yield put({
    type: roleAction.CHANGE_ROLE_STORE,
    payload,
  })
}

function *resetRole(action){
  yield put({
    type: roleAction.RESET_ROLE,
  });
}

//请求角色列表数据
function *getRoleList(action){
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getRoleList}/${payload.enterpriseId}`;
  try{
    yield put({
      type: roleAction.CHANGE_ROLE_STORE,
      payload: {
        roleTableLoading: true,
        ...payload,
      },
    });
    const response = yield call(axios.get, url);
    if(response.data.code === '10000') {
      yield put({
        type: roleAction.GET_ROLE_FETCH_SUCCESS,
        payload: {
          roleTableLoading: false,
          roleData: response.data.data,
        },
      });
    }
  }catch(e){
    message.error('获取角色列表失败，请重试!');
    yield put({
      type: roleAction.CHANGE_ROLE_STORE,
      payload: { roleTableLoading: false },
    });
    console.log(e);
  }
}

//请求功能权限列表数据
function *getMenuList(action){
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getMenuList;
  try{
    const response = yield call(axios.get,url);
    if(response.data.code === '10000') {
      yield put({
        type:  roleAction.GET_ROLE_FETCH_SUCCESS,
        payload:{
          menuData: response.data.data || [],
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *getDefaultMenuList(action){ // 获取默认权限
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDefaultRight}`;
  try{
    const response = yield call(axios.get,url);
    if(response.data.code === '10000') {
      yield put({
        type:  roleAction.GET_ROLE_FETCH_SUCCESS,
        payload:{
          defaultMenuData: response.data.data || [],
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}

//新建角色
function *createRole(action){
  const { payload } = action;
  const { enterpriseId, roleDesc, rightId, continueAdd, operateId } = payload;
  const data = {
    enterpriseId,
    roleDesc,
    rightId,
    operateId,
  }
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.createRole}`
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.post,url,data);
    if(response.data.code === '10000') {
      yield put({
        type: roleAction.GET_ROLE_LIST_SAGA,
        payload: {
          enterpriseId: enterpriseId
        },
      });
      yield put({
        type: roleAction.CHANGE_ROLE_STORE_SAGA,
        payload: {
          showPage: continueAdd?'create':'list',
          continueAdd
        },
      });
    } else {
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          loading: false,
        }
      });
      message.error('新建角色失败，请重试！');
    }
  }catch(e){
    console.log(e);
  }
}

//编辑角色
function *editRole(action){
  const { payload, enterpriseId } = action;
  const url = replacePathParams(Path.basePaths.APIBasePath + Path.APISubPaths.system.createRole, enterpriseId);
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: roleAction.GET_ROLE_LIST_SAGA,
        payload: {
          enterpriseId: payload.enterpriseId
        },
      });
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          showPage: 'list',
          selectedRole: []
        },
      });
    } else {
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          loading: false,
        }
      });
      message.error('编辑角色失败，请重试！');
    }
  }catch(e){
    console.log(e);
  }
}

function *deleteRole(action) { // 删除角色
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteRole}/${payload.roleId}`;
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.delete,url);
    if(response.data.code === '10000') {
      yield put({
        type: roleAction.GET_ROLE_LIST_SAGA,
        payload: {
          enterpriseId: Cookie.get('enterpriseId')
        },
      });
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          selectedRole: []
        },
      });
      message.success('角色删除成功!');
    } else if(response.data.code === '20020') {
      console.log(response.data)
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          loading: false,
        }
      });
      message.error('有关联用户,取消关联后，可删除', 2);
    }else{
      message.error(response.data.message);
      console.log(response.data);
      yield put({
        type: roleAction.CHANGE_ROLE_STORE,
        payload: {
          loading: false,
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *getOperatetype(){ // 获得权限操作类型
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getOperatetype;
  try{
    const response = yield call(axios.get, url);
    if(response.data.code === '10000') {
      yield put({
        type: roleAction.GET_ROLE_FETCH_SUCCESS,
        payload: {
          operatetypeData: response.data.data || [],
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}



export function* watchRole() {
  yield takeLatest(roleAction.CHANGE_ROLE_STORE_SAGA, changeRoleStore);
  yield takeLatest(roleAction.GET_ROLE_LIST_SAGA, getRoleList);
  yield takeLatest(roleAction.GET_MENU_LIST_SAGA, getMenuList);
  yield takeLatest(roleAction.GET_DEFAULT_MENU_LIST_SAGA, getDefaultMenuList);
  yield takeLatest(roleAction.CREATE_ROLE_SAGA, createRole);
  yield takeLatest(roleAction.EDIT_ROLE_SAGA, editRole);
  yield takeLatest(roleAction.DELETE_ROLE_SAGA, deleteRole);
  yield takeLatest(roleAction.RESET_ROLE_SAGA, resetRole);
  yield takeLatest(roleAction.GET_OPERATE_TYPE, getOperatetype);
}

