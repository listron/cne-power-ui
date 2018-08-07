import { call, put, takeLatest, select } from 'redux-saga/effects';
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
  console.log(payload);
  // const url = '/mock/api/v3/user/list';
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getUserList;
  try{
    yield put({type: userAction.USER_FETCH});
    const response = yield call(axios.post, url, payload);
    console.log(response);
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
    const response = yield call(axios.put, url);
    if(response.data.code === '10000'){
      yield put({
        type: userAction.GET_USER_FETCH_SUCCESS,
        payload: {
          ...payload,
        }
      })
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
  // const url = '/mock/api/v3/userDetail';
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.getUserDetail + payload.userId;
  console.log(action)
  try{
    yield put({ type: userAction.USER_FETCH});
    const response = yield call(axios.get, url,payload);
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS,
      payload: {
        userDetail: response.data.data,
      }
    })
  }
  catch(e){
    console.log(e);
  }
}

// 编辑用户信息
function *editUserInfo(action){
  const { payload } =action;
  // const url = '/api/v3/user';
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.editUserInfo;
  try{
    yield put({ type: userAction.USER_FETCH });
    const response = yield call(axios.put, url);
    yield put({
      type: userAction.GET_USER_FETCH_SUCCESS
    })
  }catch(e){
    console.log(e);
  }
}
// 新建用户信息
function *createUserInfo(action){
  const { payload } = action;
  // const url = '/api/v3/createUser';
  const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.createUserInfo;
  yield put({ type: userAction.USER_FETCH});
  try{
    const response = yield call(axios.post, url, payload);
    if(response.data.code === '10000'){
      yield put({ type: userAction.GET_USER_FETCH_SUCCESS});
      message.success(response.data.message);
      yield put({ type: userAction.CHANGE_USER_STORE_SAGA, payload:{showPage: payload.showPage}})
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        // roleId: state.user.get('roleId'),
        userStatus: state.user.get('userStatus'),
        userName: state.user.get('userName'),
        stationName: state.user.get('stationName'),
        phoneNum: state.user.get('phoneNum'), 
        pageSize: state.user.get('pageSize'),
        pageNum: state.user.get('pageNum'),
      }));
      yield put({
        type:  userAction.GET_USER_LIST_SAGA,
        payload,
      });
    }else{
      yield put({ type: userAction.GET_USER_FETCH_FAIL});
      message.error(response.data.message);
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
}
