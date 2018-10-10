import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { userAction } from './userAction';
import Cookie from 'js-cookie';

// 切换页面 -> 列表页 详情页 编辑页
function* changeUserStore(action) {
  const { payload } = action;
  yield put({
    type: userAction.CHANGE_USER_STORE,
    payload,
  });
}

function* resetUserState(action) {
  yield put({
    type: userAction.RESET_USER,
  });
}

// 请求用户列表
function* getUserList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getUserList;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {

      const totalNum = response.data.data.totalNum || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if(totalNum === 0){ // 总数为0时，展示0页
        pageNum = 0;
      }else if(maxPage < pageNum){ // 当前页已超出
        pageNum = maxPage;
      }

      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          ...payload,
          totalNum,
          pageNum,
          userData: response.data.data.userData || [],
        }
      });
      let tmpUserData= response.data.data.userData;
      if(payload.selectedKey && payload.selectedKey.toJS().length>0){
        tmpUserData = payload.selectedKey.toJS().map(e=>{
          return tmpUserData.find((item,i)=>i===e);
        })
        yield put({
          type: userAction.CHANGE_USER_STORE_SAGA,
          payload: {
            selectedUser: tmpUserData,
            selectedKey: payload.selectedKey,
          }
        })
      }
    } else {
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  } catch (e) {
    yield put({ type: userAction.GET_USER_FETCH_FAIL });
    console.log(e);
  }
}
// 更改企业用户状态
function* changeUserStatus(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.changeUserStatus;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          ...payload,
        }
      })
      const params = yield select(state => ({//继续请求用户列表
        enterpriseId: Cookie.get('enterpriseId'),
        roleId: state.system.user.get('roleId'),
        userStatus: state.system.user.get('userStatus'),
        username: state.system.user.get('username'),
        stationName: state.system.user.get('stationName'),
        phoneNum: state.system.user.get('phoneNum'),
        pageSize: state.system.user.get('pageSize'),
        pageNum: state.system.user.get('pageNum'),
        selectedKey: payload.selectedKey,
      }));
      yield put({
        type: userAction.GET_USER_LIST_SAGA,
        payload: params,
      });
    } else if(response.data.code === '20030'){//唯一企业管理员不可删除
      yield put({ type: userAction.GET_USER_FETCH_FAIL })
      message.error('唯一企业管理员不可删除！');
    }else {
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
  }
}

// 请求用户详情
function* getUserDetail(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getUserDetail + payload.userId;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          userDetail: response.data.data || {},
          showPage: payload.showPage,
        }
      })
    } else {
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  }
  catch (e) {
    console.log(e);
  }
}

// 邀请用户信息
function* getInviteLink(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getInviteLink;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.get, url, { params: { enterpriseId: payload.enterpriseId } });
    if (response.data.code === '10000') {
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          inviteData: response.data.data || {},
          showPage: payload.showPage,
        }
      })
    } else {
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  }
  catch (e) {
    console.log(e);
  }
}

// 获取企业角色列表
function* getRoleAllList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.getRoleAllList;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.post, url, payload);
    if (payload.roleType === "0") {//获取普通角色
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          roleAllList: response.data.data || [],
        }
      })
    } else if (payload.roleType === "1") {//获取特殊权限
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          specialRoleList: response.data.data || [],
        }
      })
    }
  }
  catch (e) {
    console.log(e);
  }
}

// 编辑用户信息
function* editUserInfo(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.editUserInfo;
  try {
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      const { userLogo } = payload;
      userLogo && Cookie.set('userLogo', userLogo);
      yield put({ type: userAction.GET_USER_FETCH_SUCCESS });
      const params = yield select(state => ({//继续请求用户列表
        enterpriseId: Cookie.get('enterpriseId'),
        roleId: state.system.user.get('roleId'),
        userStatus: state.system.user.get('userStatus'),
        username: state.system.user.get('username'),
        stationName: state.system.user.get('stationName'),
        phoneNum: state.system.user.get('phoneNum'),
        pageSize: state.system.user.get('pageSize'),
        pageNum: state.system.user.get('pageNum'),
      }));
      yield put({
        type: userAction.GET_USER_LIST_SAGA,
        payload: params,
      });
    } else if(response.data.code === '20030'){
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error('唯一企业管理员不可删除!');
    }else {
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
  }
}
// 新建用户信息
function* createUserInfo(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.createUserInfo;
  yield put({ type: userAction.USER_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000' || response.data.code === '20013') {
      yield put({ type: userAction.GET_USER_FETCH_SUCCESS });
      const params = yield select(state => ({//继续请求用户列表
        enterpriseId: Cookie.get('enterpriseId'),
        roleId: state.system.user.get('roleId'),
        userStatus: state.system.user.get('userStatus'),
        username: state.system.user.get('username'),
        stationName: state.system.user.get('stationName'),
        phoneNum: state.system.user.get('phoneNum'),
        pageSize: state.system.user.get('pageSize'),
        pageNum: state.system.user.get('pageNum'),
      }));
      yield put({
        type: userAction.GET_USER_LIST_SAGA,
        payload: params,
      });
    }else if(response.data.code === '20015'){
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error('用户名已被注册');
    }else if(response.data.code === '20016'){
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error('手机号已被注册');
    }else{
      yield put({ type: userAction.GET_USER_FETCH_FAIL });
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchUser() {
  yield takeLatest(userAction.CHANGE_USER_STORE_SAGA, changeUserStore);
  yield takeLatest(userAction.GET_USER_LIST_SAGA, getUserList);
  yield takeLatest(userAction.GET_USER_DETAIL_SAGA, getUserDetail);
  yield takeLatest(userAction.EDIT_USER_INFO_SAGA, editUserInfo);
  yield takeLatest(userAction.CHANGE_USER_STATUS_SAGA, changeUserStatus);
  yield takeLatest(userAction.CREATE_USER_INFO_SAGA, createUserInfo);
  yield takeLatest(userAction.GET_INVITE_LINK_SAGA, getInviteLink);
  yield takeEvery(userAction.GET_ROLE_ALL_LIST_SAGA, getRoleAllList);
  yield takeEvery(userAction.RESET_USER_STATE_SAGA, resetUserState);
}
