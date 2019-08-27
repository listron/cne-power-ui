import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../utils/request';
import {message} from 'antd';
import path from '../../../constants/path';
import {achieveAction} from './achieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

function* getAreaStation() { // 用户所有区域与电站
  try {
    const url = `${APIBasePath}${highAnalysis.getAreaStation}`;
    const response = yield call(request.post, url, {stationType: 0});
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {areaStation: response.data},
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: achieveAction.changeStore,
      payload: {areaStation: []},
    });
    message.error('获取区域信息失败, 请刷新重试!');
  }
}

function* getQuotaInfo() { // 可选指标信息
  try {
    const url = `${APIBasePath}${highAnalysis.getQuotaInfo}`;
    const response = yield call(request.post, url);
    const quotaInfo = response.data.map(e => ({
      value: e.indicatorCode,
      label: e.indicatorName,
      unit: e.unitName,
      pointLength: e.pointLength,
      children: (e.children && e.children.length > 0) ? e.children.map(m => ({
        value: m.indicatorCode,
        label: m.indicatorName,
        unit: e.unitName,
        pointLength: e.pointLength,
      })) : undefined,
    }));
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: { quotaInfo },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: achieveAction.changeStore,
      payload: {quotaInfo: []},
    });
    message.error('获取指标失败, 请刷新重试!');
  }
}

export function* watchAchieveLayout() {
  yield takeLatest(achieveAction.getAreaStation, getAreaStation);
  yield takeLatest(achieveAction.getQuotaInfo, getQuotaInfo);
}

