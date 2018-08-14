import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { userAction } from '../../../../constants/actionTypes/system/account/userAction';

// 切换页面 -> 列表页 详情页 编辑页
function *changeUserStore(action){
  const { payload } = action;
  yield put({
    type: userAction.CHANGE_USER_STORE,
    payload,
  })
}

// 请求用户列表
function *getUserList(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getUserList;
  try{
    yield put({type: userAction.USER_FETCH});
    const response = yield call(axios.post, url, payload);
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS,
      payload: {
        ...payload,
        totalNum: response.data.data.totalNum,
        userData: response.data.data.userData,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 更改企业用户状态
function *changeUserStatus(action){
  const { payload } =action;
  // const url = '/api/v3/user/status';
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.changeUserStatus;
  try{
    yield put({type: userAction.USER_FETCH});
    const response = yield call(axios.put, url, payload);
    if(response.data.code === '10000'){
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          ...payload,
        }
      })
      const params = yield select(state => ({//继续请求用户列表
        enterpriseId: state.login.get('enterpriseId'),
        roleId: state.system.user.get('roleId'),
        userStatus: state.system.user.get('userStatus'),
        userName: state.system.user.get('userName'),
        stationName: state.system.user.get('stationName'),
        phoneNum: state.system.user.get('phoneNum'), 
        pageSize: state.system.user.get('pageSize'),
        pageNum: state.system.user.get('pageNum'),
      }));
      yield put({
        type:  userAction.GET_USER_LIST_SAGA,
        payload: params,
      });
    }else{
      yield put({ type: userAction.CHANGE_USER_STATUS_FAIL})
      message.error(response.data.message);
    }
  }catch(e){
    console.log(e);
  }
}

// 请求用户详情
function *getUserDetail(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getUserDetail + payload.userId;
  try{
    yield put({ type: userAction.USER_FETCH});
    const response = yield call(axios.get, url,payload);
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS,
      payload: {
        userDetail: response.data.data,
        showPage: payload.showPage,
        userId: payload.userId,
      }
    })
  }
  catch(e){
    console.log(e);
  }
}

// 邀请用户信息
function *getInviteLink(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getInviteLink;
  try{
    yield put({ type: userAction.USER_FETCH});
    const response = yield call(axios.get, url, {params: {enterpriseId: payload.enterpriseId}});
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS,
      payload: {
        inviteData: response.data.data,
        showPage: payload.showPage,
      }
    })
  }
  catch(e){
    console.log(e);
  }
}

// 获取企业角色列表
function *getRoleAllList(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getRoleAllList;
  try{
    yield put({ type: userAction.USER_FETCH});
    const response = yield call(axios.post, url, payload);
    if(payload.roleType==="0"){//获取普通角色
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          roleAllList: response.data.data,
        }
      })
    }else if(payload.roleType==="1"){//获取特殊权限
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          specialRoleList: response.data.data,
        }
      })
    }
    
  }
  catch(e){
    console.log(e);
  }
}

// 编辑用户信息
function *editUserInfo(action){
  const { payload } =action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.editUserInfo;
  try{
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.put, url, payload);
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS
    })
    yield put({ type: userAction.CHANGE_USER_STORE_SAGA, payload:{showPage: payload.showPage}})
    const params = yield select(state => ({//继续请求用户列表
      enterpriseId: payload.enterpriseId,
      roleId: state.system.user.get('roleId'),
      userStatus: state.system.user.get('userStatus'),
      userName: state.system.user.get('userName'),
      stationName: state.system.user.get('stationName'),
      phoneNum: state.system.user.get('phoneNum'), 
      pageSize: state.system.user.get('pageSize'),
      pageNum: state.system.user.get('pageNum'),
    }));
    yield put({
      type:  userAction.GET_USER_LIST_SAGA,
      payload: params,
    });
  }catch(e){
    console.log(e);
  }
}
// 新建用户信息
function *createUserInfo(action){
  const { payload } = action;
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.createUserInfo;
  yield put({ type: userAction.USER_FETCH});
  try{
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '00000'){
      yield put({ type: userAction.GET_USER_FETCH_FAIL});
      message.error(response.data.message);
    }else{
      yield put({ type: userAction.GET_USER_FETCH_SUCCESS});
      yield put({ type: userAction.CHANGE_USER_STORE_SAGA, payload:{showPage: payload.showPage}})
      const params = yield select(state => ({//继续请求用户列表
        enterpriseId: payload.enterpriseId,
        roleId: state.system.user.get('roleId'),
        userStatus: state.system.user.get('userStatus'),
        userName: state.system.user.get('userName'),
        stationName: state.system.user.get('stationName'),
        phoneNum: state.system.user.get('phoneNum'), 
        pageSize: state.system.user.get('pageSize'),
        pageNum: state.system.user.get('pageNum'),
      }));
      yield put({
        type:  userAction.GET_USER_LIST_SAGA,
        payload: params,
      });
    }
  }catch(e){
    console.log(e);
  }
}


export function* watchUser(){
  yield takeLatest(userAction.CHANGE_USER_STORE_SAGA, changeUserStore);
  yield takeLatest(userAction.GET_USER_LIST_SAGA, getUserList);
  yield takeLatest(userAction.GET_USER_DETAIL_SAGA, getUserDetail);
  yield takeLatest(userAction.EDIT_USER_INFO_SAGA, editUserInfo);
  yield takeLatest(userAction.CHANGE_USER_STATUS_SAGA, changeUserStatus);
  yield takeLatest(userAction.CREATE_USER_INFO_SAGA, createUserInfo);
  yield takeLatest(userAction.GET_INVITE_LINK_SAGA, getInviteLink);
  yield takeEvery(userAction.GET_ROLE_ALL_LIST_SAGA, getRoleAllList);
}
