import { call, put, takeLatest, select } from 'redux-saga/effects';
// import request from '@utils/request';
// import path from '@path';
// import { message } from 'antd';
import { personnelManageAction } from './personnelManageReducer';

// const { basePaths, APISubPaths } = path;
// const { APIBasePath } = basePaths;
// const { operation } = APISubPaths;

function *getUserList({ payload }) {
  console.log(payload);
}

function *downloadTemplate(){ // 模板下载

}

// function *import(){ // 模板下载

// }

export function* watchPersonnelManage() {
  yield takeLatest(personnelManageAction.getUserList, getUserList);
}
