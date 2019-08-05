import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { areaAchieveAction } from './areaAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *testArea(action) { // 用户所有区域与电站
  try {
    // const url = `${APIBasePath}${highAnalysis.getAreaStation}/0`;
    const response = yield call(console.log, 'testArea calling');
    // if (response.data.code === '10000') {
    //   yield put({
    //     type: achieveAction.fetchSuccess,
    //     payload: { areaStation: response.data },
    //   });
    // } else { throw response.data; }
  } catch(error) {
    message.error('test');
  }
}

export function* watchAreaAhieve() {
  yield takeLatest(areaAchieveAction.testArea, testArea);
}

