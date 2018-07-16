import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';

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
  const url = '/mock/system/enterprisList';
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  roleAction.GET_ROLE_LIST_SUCCESS,
      payload:{
        ...payload,
        roleData: response.data.data.roleData,
        totalNum: response.data.data.totalNum,
      },
    });
  }catch(e){
    console.log(e);
  }
}


//新建+编辑企业信息
function *modifyRole(action){
  const { payload } = action;
  const url = '/mock/system/changeEnterprise';
  try{
    yield put({ type:roleAction.ROLE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  roleAction.MODIFT_ROLE_SUCCESS,
      payload,
    });
  }catch(e){
    console.log(e);
  }
}



export function* watchEnterpriseSaga() {
  yield takeLatest(roleAction.GET_ENTERPRISE_ATTR_CHANGE_SAGA, changeRoleStore);
  yield takeLatest(roleAction.GET_ENTERPRISE_LIST_SAGA, getRoleList);
  yield takeLatest(roleAction.CHANGE_SELECTED_ENTERPRISE_SAGA, modifyRole);
}

