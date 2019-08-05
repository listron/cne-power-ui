import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { groupAchieveAction } from './groupAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *testGroup(action) { // 用户所有区域与电站
  try {
    // const url = `${APIBasePath}${highAnalysis.getAreaStation}/0`;
    const response = yield call(console.log, 'test');
    // if (response.data.code === '10000') {
    yield put({
      type: groupAchieveAction.fetchSuccess,
      payload: { initData: true }, // 得到初始数据.
    });
    // } else { throw response.data; }
  } catch(error) {
    message.error('test');
  }
}

export function* watchGroupAhieve() {
  yield takeLatest(groupAchieveAction.testGroup, testGroup);
}

