import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import { replacePathParams } from '../../../utils';

import { roleAction } from '../../../constants/actionTypes/system/roleAction';

//不是异步请求，仅修改reducer的函数
function *changeRoleStore(action){
  const { payload } = action;
  yield put({
    type: roleAction.CHANGE_ROLE_STORE,
    payload,
  })
}

//请求角色列表数据
function *getRoleList(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getRoleList;
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.get,url,{params: payload});
    yield put({
      type:  roleAction.GET_ROLE_FETCH_SUCCESS,
      payload:{
        roleData: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

//请求功能列表数据
function *getMenuList(action){
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getMenuList;
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  roleAction.GET_ROLE_FETCH_SUCCESS,
      payload:{
        menuData: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}


//新建角色
function *createRole(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.createRole;
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.post,url,payload);
    // yield put({
    //   type:  roleAction.MODIFT_ROLE_SUCCESS,
    //   payload,
    // });
  }catch(e){
    console.log(e);
  }
}

//编辑角色
function *editRole(action){
  const { payload, enterpriseId } = action;
  const url = replacePathParams(Path.basePaths.newAPIBasePath + Path.APISubPaths.system.createRole, enterpriseId);
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.put,url,payload);
    // yield put({
    //   type:  roleAction.MODIFT_ROLE_SUCCESS,
    //   payload,
    // });
  }catch(e){
    console.log(e);
  }
}

//删除角色
function *deleteRole(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.deleteRole;
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.delete,url,{data: payload});
    // yield put({
    //   type:  roleAction.MODIFT_ROLE_SUCCESS,
    //   payload,
    // });
  }catch(e){
    console.log(e);
  }
}



export function* watchRole() {
  yield takeLatest(roleAction.CHANGE_ROLE_STORE_SAGA, changeRoleStore);
  yield takeLatest(roleAction.GET_ROLE_LIST_SAGA, getRoleList);
  yield takeLatest(roleAction.GET_MENU_LIST_SAGA, getMenuList);
  yield takeLatest(roleAction.CREATE_ROLE_SAGA, createRole);
  yield takeLatest(roleAction.EDIT_ROLE_SAGA, editRole);
  yield takeLatest(roleAction.DELETE_ROLE_SAGA, deleteRole);
}

