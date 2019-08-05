import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { stationAchieveAction } from './stationAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function* easyPut(actionName, payload){
  yield put({
    type: stationAchieveAction[actionName],
    payload,
  });
}

function *getLostRank(){ // 损失根源 - 指标排名
  const url = `${APIBasePath}${highAnalysis.getLostRank}`;
  try {
    yield call(easyPut, 'changeStore', { lostRankLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostRank: [],
      lostRankLoading: false,
    });
  }
}

function *getLostTrend(){ // 损失根源 - 指标趋势
  const url = `${APIBasePath}${highAnalysis.getLostTrend}`;
  try {
    yield call(easyPut, 'changeStore', { lostTrendLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostTrend: [],
      lostTrendLoading: false,
    });
  }
}

function *getLostTypes(){ // 损失根源 - 损失电量分解
  const url = `${APIBasePath}${highAnalysis.getLostTypes}`;
  try {
    yield call(easyPut, 'changeStore', { lostTypesLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostTypes: [],
      lostTypesLoading: false,
    });
  }
}

function *getStopElec(){ // 停机 - 损失电量
  const url = `${APIBasePath}${highAnalysis.getStopElec}`;
  try {
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    return; // 没错，我就是故意吞了错误，咋地。
  }
}

function *getStopRank(){ // 停机 - 设备停机时长及次数
  const url = `${APIBasePath}${highAnalysis.getStopRank}`;
  try {
    yield call(easyPut, 'changeStore', { stopRankLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopRank: [],
      stopRankLoading: false,
    });
  }
}

function *getStopTrend(){ // 停机 - 日月年 停机时长次数趋势图
  const url = `${APIBasePath}${highAnalysis.getStopTrend}`;
  try {
    yield call(easyPut, 'changeStore', { stopTrendLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopTrend: [],
      stopTrendLoading: false,
    });
  }
}

function *getStopTypes(){ // 停机 - 各类停机时长及次数
  const url = `${APIBasePath}${highAnalysis.getStopTypes}`;
  try {
    yield call(easyPut, 'changeStore', { stopTypesLoading: true });
    const response = yield call(request.post, url, {
      a: 1,
      b: 2,
    });
    console.log(response);
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopTypes: [],
      stopTypesLoading: false,
    });
  }
}

export function* watchStationAhieve() {
  yield takeLatest(stationAchieveAction.getLostRank, getLostRank);
  yield takeLatest(stationAchieveAction.getLostTrend, getLostTrend);
  yield takeLatest(stationAchieveAction.getLostTypes, getLostTypes);
  yield takeLatest(stationAchieveAction.getStopElec, getStopElec);
  yield takeLatest(stationAchieveAction.getStopRank, getStopRank);
  yield takeLatest(stationAchieveAction.getStopTrend, getStopTrend);
  yield takeLatest(stationAchieveAction.getStopTypes, getStopTypes);
}

