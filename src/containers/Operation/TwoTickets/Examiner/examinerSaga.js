import { put, takeLatest, takeEvery, select, call, fork } from 'redux-saga/effects';
import { examinerAction } from './warehouseManageReducer';
import path from '../../../../constants/path';
import { message } from 'antd';
import axios from 'axios';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

function* getSettingList({ payload }) { // 获取工作票/操作票配置列表
  const url = `${APIBasePath}${operation.getSettingList}`;
  try {
    const { templateType } = yield select(state => state.operation.examiner.toJS());
    const response =  yield call(axios.post, url, { ...payload, templateType });
    if (response.data.code === '10000') {
      yield put({
        type: examinerAction.fetchSuccess,
        payload: {
          settingList: response.data.data.dataList || [],
          total: response.data.data.pageCount || 0,
        }
      })
    } else { throw response.data }
  } catch (e) {
    message.error('获取设置列表失败, 请重试');
    yield put({
      type: examinerAction.changeStore,
      payload: { settingList: [], total: 0 }
    })
  }
}

function* getSettableNodes({ payload }) { // 获取可配置属性节点
  try {
    const { templateType } = yield select(state => state.operation.examiner.toJS());
    const url = `${APIBasePath}/${templateType}/needDistributionNodes`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: examinerAction.fetchSuccess,
        payload: { settableNodes: response.data.data || [] }
      })
    } else { throw response.data }
  } catch (error) {
    message.error(`配置项获取失败, ${error.message}`);
  }
}

function* createSettedInfo({ payload }){ // 保存 电站审核人设置
  const url = `${APIBasePath}${operation.createSettedInfo}`;
  try {
    const { templateType, tableParam } = yield select(state => state.operation.examiner.toJS());
    const response = yield call(axios.post, url, { ...payload, templateType });
    if (response.data.code === '10000') { // 重新请求
      yield fork(getSettingList, { ...tableParam });
    } else { throw response.data }
  } catch (error) {
    message.error(`审核人设置失败, ${error.message}`);
  }
}

function* editSettedInfo({ payload }){ // 编辑 电站审核人信息
  const url = `${APIBasePath}${operation.editSettedInfo}`;
  try {
    const { tableParam } = yield select(state => state.operation.examiner.toJS());
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') { // 重新请求
      yield fork(getSettingList, { ...tableParam });
    } else { throw response.data }
  } catch (error) {
    message.error(`编辑失败, ${error.message}`);
  }
}

function* getSettedInfo({ payload }){ // 查看 电站审核人信息
  const url = `${APIBasePath}${operation.getSettedInfo}/${payload.distributionId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') { // 重新请求
      yield put({
        type: examinerAction.fetchSuccess,
        payload: { settedDetail: response.data.data || [] }
      });
    } else { throw response.data }
  } catch (error) {
    message.error(`获取详情失败, ${error.message}`);
  }
}

function* getSettableUsers({ payload }){ // 查看可配置的人员列表 GET
  const { userGather } = yield select(state => state.operation.examiner.toJS());
  const url = `${APIBasePath}${operation.getSettableUsers}/${payload.nodeCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: examinerAction.fetchSuccess,
        payload: {
          userGather: {
            ...userGather,
            [userGather[payload.gatherName]]: response.data.data || [],
          }
        }
      })
    } else { throw response.data }
  } catch (error) {
    message.error(`人员信息获取失败, ${error.message}`);
  }
}

export function* watchExaminer() {
  yield takeLatest(examinerAction.getSettingList, getSettingList);
  yield takeLatest(examinerAction.getSettableNodes, getSettableNodes);
  yield takeLatest(examinerAction.createSettedInfo, createSettedInfo);
  yield takeLatest(examinerAction.editSettedInfo, editSettedInfo);
  yield takeLatest(examinerAction.getSettedInfo, getSettedInfo);
  yield takeEvery(examinerAction.getSettableUsers, getSettableUsers);
}

