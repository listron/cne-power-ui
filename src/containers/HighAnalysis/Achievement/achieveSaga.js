import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../utils/request';
import { message } from 'antd';
import path from '../../../constants/path';
import { achieveAction } from './achieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *getAreaStation(action) { // 用户所有区域与电站
  try {
    const url = `${APIBasePath}${highAnalysis.getAreaStation}/0`;
    const response = yield call(request.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: { areaStation: response.data },
      });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: achieveAction.changeStore,
      payload: { areaStation: [] },
    });
    message.error('获取区域信息失败, 请刷新重试!');
  }
}

function *getQuotaInfo(action) { // 可选指标信息
  try {
    const url = `${APIBasePath}${highAnalysis.getQuotaInfo}`;
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(request.get, { url });
    if (response.data.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {
          quotaInfo: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch(error) {
    yield put({
      type: achieveAction.changeStore,
      payload: { quotaInfo: [] },
    });
    message.error('获取指标失败, 请刷新重试!');
  }
}

export function* watchAhieveLayout() {
  yield takeLatest(achieveAction.getAreaStation, getAreaStation);
  yield takeLatest(achieveAction.getQuotaInfo, getQuotaInfo);
}

