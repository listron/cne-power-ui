import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import Cookie from 'js-cookie';
import request from '@utils/request';
import path from '@path';
import { commonAction } from '../../../alphaRedux/commonAction';
import { message } from 'antd';
import { personnelManageAction } from './personnelManageReducer';

const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { system } = APISubPaths;

function* easyPut(actionName, payload){
  yield put({
    type: personnelManageAction[actionName],
    payload,
  });
}

function *getAllUserBase(){ // 进入页面预请求: 所有用户基础信息 => 用于分配人员
  try {
    const url = `${APIBasePath}${system.getAllUserBase}`;
    const response = yield call(request.post, url); // departmentId 此处也可以传输部门id用于获取部门下用户
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        allBaseUserData: response.data.map(e => ({ ...e, key: e.userId })) || [],
      });
    } else { throw response.message; }
  } catch(error) {
    message.error(`获取所有用户基础信息失败, 分配人员功能将不可用, 请刷新重试! ${error}`);
  }
}

function *downloadTemplate(){ // 下载导入模板
  const url = `${APIBasePath}${system.downLoadUserTemplate}`;
  const authData = localStorage.getItem('authData') || '';
  yield put({
    type: commonAction.downLoadFile,
    payload: {
      url,
      actionName: personnelManageAction.fetchSuccess,
      loadingName: 'templateLoading',
      method: 'get',
      fileName: '导入用户模板.xlsx',
      headers: { 'Authorization': 'bearer ' + authData },
    },
  });
}

function *getDepartmentTreeData() { // 获取部门树结构
  try {
    const url = `${APIBasePath}${system.getDepartmentTreeData}`;
    const response = yield call(request.get, url);
    yield call(easyPut, 'changeStore', { departmentTreeLoading: true });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        departmentTreeLoading: false,
        departmentTree: response.data || [],
      });
    } else { throw response.message; }
  } catch(error) {
    message.error(`获取部门树失败, 请刷新重试! ${error}`);
  }
}

function *addNewDepartment({ payload }){ // 添加部门
  try {
    const url = `${APIBasePath}${system.handleDepartment}`;
    /** payload: 
     * departmentName	String	否	部门名称
     * departmentId	String	是	所属部门ID => 是否有父级部门;
     * stationCodes	String[]	是	负责电站（多选）
     */
    yield call( easyPut, 'changeStore', { addDepartmentLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'changeStore', {
        addDepartmentLoading: false,
        addDepartmentSuccess: true,
      });
      yield call(getDepartmentTreeData); // 添加部门成功, 重新请求部门树
    } else { throw response.message; }
  } catch(error) {
    yield call( easyPut, 'changeStore', {
      addDepartmentLoading: false,
      addDepartmentSuccess: false,
    });
    message.error(`添加新部门失败, ${error}`);
  }
}

function *getStationOfDepartment({ payload }){ // 获取指定部门下的电站信息 => 部门编辑 、查看部门页面信息两个地方可用
  // payload : {departmentEditInfo} 或者 {departmentId}
  // 直接传departmentId时, 为查看右侧部门信息; => reducer记录为departmentStations
  // 传departmentEditInfo时, 为点击左侧部门树编辑; => reducer记录进入departmentEditInfo的stations字段;
  try{
    const { departmentEditInfo } = payload;
    const departmentId = departmentEditInfo ? departmentEditInfo.departmentId : payload.departmentId;
    const url = `${APIBasePath}${system.getStationOfDepartment}/${departmentId}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', departmentEditInfo ? {
        departmentEditInfo: {
          ...departmentEditInfo,
          stations: response.data || [],
        },
        departmentDrawerKey: 'edit',
      } : {
        departmentStations: response.data || [],
      });
    } else { throw response.message;}
  } catch (error) {
    message.error(`获取部门电站信息失败, 请重试! ${error}`);
  }
}

function *editDepartment({ payload }){ // 编辑部门
  try {
    /** payload: 
     * departmentName	String	否	部门名称
     * departmentId	String	是	所属部门ID => 是否有父级部门;
     * stationCodes	String[]	是	负责电站（多选）
     */
    const url = `${APIBasePath}${system.handleDepartment}`;
    yield call( easyPut, 'changeStore', { addDepartmentLoading: true });
    const response = yield call(request.put, url, payload);
    if (response.code === '10000') {
      yield call( easyPut, 'changeStore', {
        addDepartmentLoading: false,
        addDepartmentSuccess: response.code === '10000',
      });
      yield call(getDepartmentTreeData); // 添加部门成功, 重新请求部门树
    } else { throw response.message; }
  } catch(error) {
    yield call( easyPut, 'changeStore', {
      addDepartmentLoading: false,
      addDepartmentSuccess: false,
    });
    message.error(`编辑部门失败, ${error}`);
  }
}

function *preDeleteDepartmentCheck({ payload }){ // 删除部门前的检查、
  try {
    const { departmentInfo } = payload || {};
    const { departmentId } = departmentInfo || {};
    const url = `${APIBasePath}${system.preDeleteDepartmentCheck}/${departmentId}`;
    const response = yield call(request.get, url);
    yield call(easyPut, 'changeStore', {
      preDeleteText: response.message || '删除后, 将取消成员关联! ',
    });
  } catch (err) {
    message.error('删除失败, 请重试');
  }
}

function *deleteDepartment({ payload }){ // 删除部门
  try {
    const { departmentId } = payload || {};
    const url = `${APIBasePath}${system.handleDepartment}/${departmentId}`;
    const response = yield call(request.delete, url);
    if (response.code === '10000') {
      yield call(easyPut, 'changeStore', {
        preDeleteText: '', // 删除弹框隐藏
        deleteDepartmentSuccess: true,
      });
    } else { throw response.message; }
    yield call(getDepartmentTreeData); // 重新请求部门树结构
  } catch (error) {
    yield call(easyPut, 'changeStore', { deleteDepartmentSuccess: false });
    message.error(`删除部门失败, 请重试 ${error}`);
  }
}

function *getDepartmentAllUser({ payload }){ // 获取指定部门所有用户列表; => 分配用户; 模糊搜索均用;
  try {
    const url = `${APIBasePath}${system.getDepartmentAllUser}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        departmentAllUsers: response.data || [],
      });
    } else { throw response.message; }
  } catch(error) {
    message.error(`获取该部门下人员信息失败, 请重试! ${error}`);
  }
}

function *assignUsers({ payload }) { // 为部门分配用户
  // payload: { userIds: [], departmentId: [] }
  try {
    const url = `${APIBasePath}${system.assignUsers}`;
    yield call(easyPut, 'changeStore', {
      assignUserLoading: true,
      assignUserSuccess: false,
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        assignUserLoading: false,
        assignUserSuccess: true,
      });
      yield call(getUserList);
    } else { throw response.message; }
    // 重新请求相关主页面的用户id列表, 用户详细列表;
  } catch(error) {
    yield call(easyPut, 'changeStore', { assignUserSuccess: false });
    message.error(`分配人员信息失败, 请重试! ${error}`);
  }
}

function *getUserList({ payload = {} } = {}) { // payload不存在时, 使用缓存参数继续请求;
  try {
    const { userListParams, userListPageInfo } = yield select(state => state.system.personnelManage);
    const url = `${APIBasePath}${system.getUserPagelist}`;
    yield call(easyPut, 'changeStore', { userListLoading: true });
    const response = yield call(request.post, url, {
      ...userListParams,
      ...userListPageInfo,
      ...payload,
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        userListLoading: false,
        selectedRowKeys: [], // 列表数据变化, 清空选中行
        userList: response.data.dataList.map(e => ({ ...e, key: e.userId })) || [],
        userListTotalNum: response.data.pageCount || 0,
      });
    } else { throw response.message; }
  } catch(error) {
    yield call(easyPut, 'changeStore', { userListLoading: false });
    message.error(`获取用户列表失败, 请重试, ${error}`);
  }
}

function *editDepartmentStations({ payload }){ // 修改部门负责的电站
  // payload = { departmentId, departmentName, stationCodes }
  try{
    const url = `${APIBasePath}${system.editDepartmentStations}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') { // 修改电站成功 => 再次请求
      const { departmentId } = payload;
      yield call(getStationOfDepartment, {
        payload: { departmentId },
      });
    } else { throw response.message; }
  }catch(error){
    message.error(`修改部门负责电站失败, ${error}`);
  }
}

function* getUserDetailInfo({ payload }) { // 获取用户详情 => 默认得到后进入详情页面
  try {
    const { userId, pageKey= 'detailPersonnel' } = payload;
    const url = `${APIBasePath}${system.getUserDetailInfo}/${userId}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        userDetailInfo: response.data || {},
        pageKey,
      });
    } else { throw response.message; }
  } catch (err) {
    message.error(`获取用户详情失败, 请重试, ${err}`);
  }
}

function* setUserStatus({ payload }){ // 修改用户状态 => 审核/注销
  // payload {userId: '', enterpriseId:'', enterpriseUserStatus:'', departmentIds: [], roleIds: []};
  const tmpInfo = {
    3: 'examineSuccess',
    6: 'examineSuccess',
    7: 'logoutSuccess',
  };
  try{
    const { enterpriseUserStatus } = payload;
    const url= `${APIBasePath}${system.setUserStatus}`;
    yield call(easyPut, 'changeStore', { examineLoading: true });
    const response = yield call(request.put, url, payload);
    if (response.code === '10000') { // 审核/注销成功, 重新请求当前用户列表
      yield call(easyPut, 'fetchSuccess', {
        [tmpInfo[enterpriseUserStatus]]: true,
        examineLoading: false,
      });
      yield call(getUserList);
    } else { throw response.message; }
  }catch(error){
    yield call(easyPut, 'changeStore', { examineLoading: false });
    message.error(`操作失败, 请重试, ${error}`);
  }
}

function* getRoleAllList() { // 获取企业角色 + 特殊权限列表 
  try {
    const enterpriseId = Cookie.get('enterpriseId') || '';
    const url = `${APIBasePath}${system.getRoleAllList}`;
    const [tmpList, tmpSpecialList] = yield all([ // roleType "0"普通角色 / "1"特殊权限
      yield call(request.post, url, { roleType: '0', enterpriseId }),
      yield call(request.post, url, { roleType: '1', enterpriseId }),
    ]);
    yield call(easyPut, 'fetchSuccess', {
      roleAllList: tmpList.data || [],
      specialRoleList: tmpSpecialList.data || [],
    });
  } catch (err) {
    message.error(`角色列表获取失败, 新增和编辑用户功能将不可用, 请刷新重试, ${err}`);
  }
}

function* addUser({ payload }){ // 新增用户
  // payload: {username, userLogo, userFullname, phoneNum, email, roleIds[], specialRoleIds[], departmentIds[]}
  try{
    const url = `${APIBasePath}${system.addUser}`;
    yield call(easyPut, 'changeStore', { addUserLoading: true, addUserSuccess: false });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        addUserLoading: false, addUserSuccess: true,
      });
    }
  } catch(err) {
    yield call(easyPut, 'changeStore', { addUserLoading: false });
    message.error(`添加用户失败, 请重试, ${err}`);
  }
}

function* editUser({ payload }){ // 编辑用户
  // payload: {userFullname, userLogo, email, roleIds[], specialRoleIds[], departmentIds[]}
  try{
    const url = `${APIBasePath}${system.editUser}`;
    yield call(easyPut, 'changeStore', { addUserLoading: true, addUserSuccess: false });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        addUserLoading: false, addUserSuccess: true,
      });
    }
  } catch(err) {
    yield call(easyPut, 'changeStore', { addUserLoading: false });
    message.error(`修改用户信息失败, 请重试, ${err}`);
  }
}

export function* watchPersonnelManage() {
  yield takeLatest(personnelManageAction.getAllUserBase, getAllUserBase);
  yield takeLatest(personnelManageAction.getDepartmentAllUser, getDepartmentAllUser);
  yield takeLatest(personnelManageAction.assignUsers, assignUsers);
  yield takeLatest(personnelManageAction.downloadTemplate, downloadTemplate);
  yield takeLatest(personnelManageAction.getDepartmentTreeData, getDepartmentTreeData);
  yield takeLatest(personnelManageAction.addNewDepartment, addNewDepartment);
  yield takeLatest(personnelManageAction.getStationOfDepartment, getStationOfDepartment);
  yield takeLatest(personnelManageAction.editDepartment, editDepartment);
  yield takeLatest(personnelManageAction.preDeleteDepartmentCheck, preDeleteDepartmentCheck);
  yield takeLatest(personnelManageAction.deleteDepartment, deleteDepartment);
  yield takeLatest(personnelManageAction.editDepartmentStations, editDepartmentStations);
  yield takeLatest(personnelManageAction.getUserDetailInfo, getUserDetailInfo);
  yield takeLatest(personnelManageAction.setUserStatus, setUserStatus);
  yield takeLatest(personnelManageAction.getRoleAllList, getRoleAllList);
  yield takeLatest(personnelManageAction.addUser, addUser);
  yield takeLatest(personnelManageAction.editUser, editUser);

  yield takeLatest(personnelManageAction.getUserList, getUserList);
}
