import { call, put, takeLatest, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
// import request from '@utils/request';
import path from '@path';
import { commonAction } from '../../../alphaRedux/commonAction';
import { message } from 'antd';
import { personnelManageAction } from './personnelManageReducer';

const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { system } = APISubPaths;
// const { operation } = APISubPaths;

function *getUserList({ payload }) {
  console.log(payload);
}

function* easyPut(actionName, payload){
  yield put({
    type: personnelManageAction[actionName],
    payload,
  });
}

function *getAllUserBase(){ // 接口1 所有用户基础信息 => 用于分配人员
  try {
    // const url = '';
    // const response = yield call(request.get, url, {});
    // if (response.code === '10000') {
    //   yield call(easyPut, 'fetchSuccess', {
    //     allBaseUserData: response.data || [],
    //   });
    // } else { throw response.message; }
    yield delay(1000);
    yield call(easyPut, 'fetchSuccess', {
      allBaseUserData: [{
        name: '李大庆',
        call: '183',
        depart: '1,2,3,4组',
      }],
    });
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
    // const url = '';
    // const response = yield call(request.get, url, {});
    // if (response.code === '10000') {
    //   yield call(easyPut, 'fetchSuccess', {
    //     allBaseUserData: response.data || [],
    //   });
    // } else { throw response.message; }
    yield call(easyPut, 'changeStore', { departmentTreeLoading: true });
    yield delay(3000);
    yield call(easyPut, 'fetchSuccess', {
      departmentTreeLoading: false,
      departmentTree: [{
        departmentId: '1',
        departmentName: '未分配人员部门',
        parentDepartmentId: '0',
      }, {
        departmentId: '2',
        departmentName: '测试父部门一',
        parentDepartmentId: '0',
      }, {
        departmentId: '3',
        departmentName: '测试父部门二',
        parentDepartmentId: '0',
        list: [{
          departmentId: '4',
          departmentName: '子',
          parentDepartmentId: '3',
        }],
      }],
    });
  } catch(error) {
    message.error(`获取部门树失败, 请刷新重试! ${error}`);
  }
}

// 左侧: 树区请求: 
// 新增部门
// 编辑部门
// 删除部门预请求
// 删除部门
// 为指定部门分配人员

// 右侧: 列表区请求
// 获取部门的电站
// 获取部门的用户名/真实姓名
// 获取部门的用户表格信息

// 用户注销预请求
// 用户注销
// 用户审核
// 新增用户
// 编辑用户

// function *import(){ // 模板下载

// }

export function* watchPersonnelManage() {
  yield takeLatest(personnelManageAction.getAllUserBase, getAllUserBase);
  yield takeLatest(personnelManageAction.downloadTemplate, downloadTemplate);
  yield takeLatest(personnelManageAction.getDepartmentTreeData, getDepartmentTreeData);

  yield takeLatest(personnelManageAction.getUserList, getUserList);
}
