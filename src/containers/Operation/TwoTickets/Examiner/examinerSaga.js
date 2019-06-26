import { put, takeLatest, takeEvery, select, call, fork } from 'redux-saga/effects';
import { examinerAction } from './examinerReducer';
import path from '../../../../constants/path';
import { message } from 'antd';
import axios from 'axios';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;


function* easyPut(actionName, payload){ // 懒得每次都写yield put + type: + payload: ~顺手偷个懒。
  yield put({
    type: examinerAction[actionName],
    payload
  });
}

function* getSettingList({ payload }) { // 获取工作票/操作票配置列表
  const url = `${APIBasePath}${operation.getSettingList}`;
  try {
    const { templateType } = yield select(state => state.operation.examiner.toJS());
    yield call(easyPut, 'changeStore', { listLoading: true });
    const response =  yield call(axios.post, url, { ...payload, templateType });
    if (response.data.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        settingList: response.data.data.dataList || [],
        listLoading: false,
        total: response.data.data.pageCount || 0,
      })
    } else { throw response.data }
  } catch (e) {
    message.error('获取设置列表失败, 请重试');
    yield call(easyPut, 'changeStore', {
      settingList: [],
      total: 0,
      listLoading: false
    });
  }
}

function* getSettableNodes() { // 获取可配置属性节点
  try {
    const { templateType } = yield select(state => state.operation.examiner.toJS());
    const url = `${APIBasePath}${operation.getSettableNodes}/${templateType}/needDistributionNodes`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        settableNodes: response.data.data || []
      });
      for(let node of response.data.data ){
        yield call(getSettableUsers, {
          payload: { nodeCode: node.nodeCode }
        })
      }
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
      yield call(easyPut, 'changeStore', { editLoading: 'success' });
      yield fork(getSettingList, { ...tableParam });
    } else { throw response.data }
  } catch (error) {
    yield call(easyPut, 'changeStore', { editLoading: 'normal' });
    message.error(`审核人设置失败, ${error.message}`);
  }
}

function* editSettedInfo({ payload }){ // 编辑 电站审核人信息
  const url = `${APIBasePath}${operation.editSettedInfo}`;
  try {
    const { tableParam } = yield select(state => state.operation.examiner.toJS());
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') { // 重新请求
      yield call(easyPut, 'changeStore', { editLoading: 'success' });
      yield fork(getSettingList, { ...tableParam });
    } else { throw response.data }
  } catch (error) {
    yield call(easyPut, 'changeStore', { editLoading: 'normal' });
    message.error(`编辑失败, ${error.message}`);
  }
}

function* getSettedInfo({ payload }){ // 查看 电站审核人信息
  const { distributionId, modalType } = payload;
  const url = `${APIBasePath}${operation.getSettedInfo}/${distributionId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') { // 重新请求
      yield call(easyPut, 'fetchSuccess', {
        settedDetail: response.data.data || [],
        handleDistributionId: distributionId,
        [modalType]: true // 详情弹框 或者 编辑弹框 展示
      });
    } else { throw response.data }
  } catch (error) {
    message.error(`获取详情失败, ${error.message}`);
  }
}

function* getSettableUsers({ payload }){ // 查看可配置的人员列表 GET
  const { userGather } = yield select(state => state.operation.examiner.toJS());
  const { nodeCode } = payload;
  const url = `${APIBasePath}${operation.getSettableUsers}/${nodeCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        userGather: {
          ...userGather,
          [nodeCode]: response.data.data || [],
        }
      });
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

