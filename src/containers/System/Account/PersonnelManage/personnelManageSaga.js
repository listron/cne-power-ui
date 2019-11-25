import { call, put, takeLatest, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
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
    // const url = ''; // POST /api/v3/department
    /** payload: 
     * departmentName	String	否	部门名称
     * departmentId	String	是	所属部门ID => 是否有父级部门;
     * stationCodes	String[]	是	负责电站（多选）
     */
    yield call( easyPut, 'changeStore', { addDepartmentLoading: true });
    yield delay(1000);
    // const response = yield call(request.post, payload)
    yield call( easyPut, 'changeStore', {
      addDepartmentLoading: false,
      addDepartmentSuccess: true, // response.code === '10000',
    });
    // response.code !== '10000' && throw response.message;
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
    // const departmentId = departmentEditInfo ? departmentEditInfo.departmentId : payload.departmentId;
    // const url = GET /api/v3/department/station/list/{departmentId}
    // const response = yield call(request.post, payload)
    yield delay(1000);
    const mockStation = [{
      stationId: '11223344',
      stationName: '永仁',
      stationCode: 56,
    }];
    // if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', departmentEditInfo ? {
        departmentEditInfo: {
          ...departmentEditInfo,
          stations: mockStation, // response.data || [],
        },
        departmentDrawerKey: 'edit',
      } : {
        departmentStations: mockStation, // response.data || [],
      });
    // } else { throw response.message;}
  } catch (error) {
    message.error(`获取部门电站信息失败, 请重试! ${error}`);
  }
}

function *editDepartment({ payload }){ // 编辑部门
  try {
    // const url = ''; // POST /api/v3/department/update
    /** payload: 
     * departmentName	String	否	部门名称
     * departmentId	String	是	所属部门ID => 是否有父级部门;
     * stationCodes	String[]	是	负责电站（多选）
     */
    yield call( easyPut, 'changeStore', { addDepartmentLoading: true });
    yield delay(1000);
    // const response = yield call(request.post, url, payload);
    yield call( easyPut, 'changeStore', {
      addDepartmentLoading: false,
      addDepartmentSuccess: true, // response.code === '10000',
    });
    // response.code !== '10000' && throw response.message;
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
    const { departmentId } = payload || {};
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
    // const url = ''; // DELETE /api/v3/department/{departmentId}
    yield delay(1000);
    // const response = yield call(request.delete, url)
    yield call(easyPut, 'changeStore', {
      preDeleteText: '', // 删除弹框隐藏
      deleteDepartmentSuccess: true, // response.code === '10000',
    });
    // response.code !== '10000' && throw response.message;
    yield call(getDepartmentTreeData); // 重新请求部门树结构
  } catch (error) {
    yield call(easyPut, 'changeStore', { deleteDepartmentSuccess: false });
    message.error(`删除部门失败, 请重试 ${error}`);
  }
}

function *getDepartmentAllUser({ payload }){ // 获取指定部门所有用户列表; => 分配用户; 模糊搜索均用;
  try {
    // const url = ''; post /api/v3/user/all/list
    // const response = yield call(request.post, url, {});
    // if (response.code === '10000') {
    //   yield call(easyPut, 'fetchSuccess', {
    //     departmentAllUsers: response.data || [],
    //   });
    // } else { throw response.message; }
    yield delay(1000);
    yield call(easyPut, 'fetchSuccess', {
      departmentAllUsers: [{
        userId: '1122',
        username: 'hellokitty',
        userFullName: '贺罗凯缇',
      }],
    });
  } catch(error) {
    message.error(`获取该部门下人员信息失败, 请重试! ${error}`);
  }
}

function *assignUsers({ payload }) { // 为部门分配用户
  try {
    // const url = ''; post /api/v3/user/list/departmentInfolist
    // const response = yield call(request.post, url, {});
    // if (response.code === '10000') {
    //   yield call(easyPut, 'fetchSuccess', {
    //     allBaseUserData: response.data || [],
    //   });
    // } else { throw response.message; }
    yield call(easyPut, 'changeStore', { assignUserLoading: true });
    yield delay(1000);
    yield call(easyPut, 'changeStore', {
      assignUserLoading: false,
      assignUserSuccess: true, // response.code === '10000',
    });
    // response.code !== '10000' && throw response.message;
    // 重新请求相关主页面的用户id列表, 用户详细列表;
  } catch(error) {
    yield call(easyPut, 'changeStore', { assignUserSuccess: false });
    message.error(`获取该部门下人员信息失败, 请重试! ${error}`);
  }
}

// 右侧: 列表区请求
// 获取部门的电站
// 获取部门的用户名/真实姓名
// 获取部门的用户表格信息
function *getUserList({ payload }) {
  console.log(payload);
}

// 用户注销预请求
// 用户注销
// 用户审核
// 新增用户
// 编辑用户

// function *import(){ // 模板下载

// }

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

  yield takeLatest(personnelManageAction.getUserList, getUserList);
}
