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
        id: '12345',
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
    // const url = ''; GET /api/v3/department/tree
    // const response = yield call(request.get, url, {});
    // if (response.code === '10000') {
    //   yield call(easyPut, 'fetchSuccess', {
    //     allBaseUserData: response.data || [],
    //   });
    // } else { throw response.message; }
    yield call(easyPut, 'changeStore', { departmentTreeLoading: true });
    yield delay(1000);
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
          departmentName: '子部门4-1',
          parentDepartmentId: '3',
        }],
      }],
    });
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
  } catch(error) {
    yield call( easyPut, 'changeStore', {
      addDepartmentLoading: false,
      addDepartmentSuccess: false,
    });
    message.error(`获取所有用户基础信息失败, 分配人员功能将不可用, 请刷新重试! ${error}`);
  }
}

function *getStationOfDepartment({ payload }){ // 获取指定部门下的电站信息 => 部门编辑 、查看部门页面信息两个地方可用
  // payload : {departmentEditInfo} 或者 {departmentId}
  // 直接传departmentId时, 为查看右侧部门信息; => reducer记录为departmentStations
  // 传departmentEditInfo时, 为点击左侧部门树编辑; => reducer记录进入departmentEditInfo的stations字段;
  try{
    const { departmentEditInfo } = payload;
    const departmentId = departmentEditInfo ? departmentEditInfo.departmentId : payload.departmentId;
    // const url = GET /api/v3/department/station/list/{departmentId}
    // const response = yield call(request.post, payload)
    yield delay(1000);
    const mockStation = [{
      stationId: '11223344',
      stationName: '永仁',
      StationCode: 56,
    }];
    // if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', departmentId ? {
        departmentStations: mockStation, // response.data || [],
      } : {
        departmentEditInfo: {
          ...departmentEditInfo,
          stations: mockStation, // response.data || [],
        },
        departmentDrawerKey: 'edit', // 开启编辑页面
      });
    // } else { throw response.message;}
  } catch (error) {
    message.error(`获取部门电站信息失败, 请重试! ${error}`)
  }
}
// 左侧: 树区请求: 
// 编辑部门
// 删除部门预请求
// 删除部门
// 为指定部门分配人员

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
  yield takeLatest(personnelManageAction.downloadTemplate, downloadTemplate);
  yield takeLatest(personnelManageAction.getDepartmentTreeData, getDepartmentTreeData);
  yield takeLatest(personnelManageAction.addNewDepartment, addNewDepartment);
  yield takeLatest(personnelManageAction.getStationOfDepartment, getStationOfDepartment);

  yield takeLatest(personnelManageAction.getUserList, getUserList);
}
