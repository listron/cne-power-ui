import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../../utils/request';
import {message} from 'antd';
import path from '../../../../constants/path';
import {areaAchieveAction} from './areaAchieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

function* getStationCapacity(action) { // 各电站装机容量
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getStationCapacity}`;
    const response = yield call(request.post, url, payload);
    console.log(response, 'response');
    if (response.code === '10000') {
      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {capacityInfo: response.data},
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取装机容量失败, 请刷新重试!');
  }
}

export function* watchAreaAchieve() {
  yield takeLatest(areaAchieveAction.getStationCapacity, getStationCapacity);
}

