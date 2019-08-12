import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { stationAchieveAction } from './stationAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

const timeType = {
  day: '1',
  month: '2',
  year: '3',
};

const stopElecType = {
  all: 0,
  faultGen: 1,
  planShutdownGen: 2,
  substationGen: 3,
  courtGen: 4,
  otherGen: 5,
};

function* easyPut(actionName, payload){
  yield put({
    type: stationAchieveAction[actionName],
    payload,
  });
}

function *getDevices({ payload }){
  const url = `${APIBasePath}${highAnalysis.getDevices}`;
  try {
    const { stationCode } = payload || {};
    const response = yield call(request.post, url, {
      stationCodes: [stationCode],
      deviceTypeCode: 101,
    });
    if (response.code === '10000') {
      const originData = response.data.dataList || [];
      const modeDevices = originData.map(e => ({
        value: e.deviceModeCode,
        label: e.deviceModeName,
        children: (e.devices && e.devices.length > 0) ? e.devices.map(m => ({
          value: m.deviceFullcode,
          label: m.deviceName,
        })) : [],
      }));
      yield call(easyPut, 'fetchSuccess', { modeDevices });
    }
  } catch (error) {
    message.error('获取设备失败, 请刷新重试');
  }
}

function *getLostRank({ payload }){ // 损失根源 - 指标排名
  const url = `${APIBasePath}${highAnalysis.getLostRank}`;
  try {
    yield call(easyPut, 'changeStore', { lostRankLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        lostRank: response.data || [],
        lostRankLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostRank: [],
      lostRankLoading: false,
    });
  }
}

function *getLostTrend({ payload }){ // 损失根源 - 指标趋势
  const url = `${APIBasePath}${highAnalysis.getLostTrend}`;
  try {
    yield call(easyPut, 'changeStore', { lostTrendLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      type: timeType[payload.type],
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        lostTrend: response.data || [],
        lostTrendLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostTrend: [],
      lostTrendLoading: false,
    });
  }
}

function *getLostTypes({ payload }){ // 损失根源 - 损失电量分解
  const url = `${APIBasePath}${highAnalysis.getLostTypes}`;
  try {
    yield call(easyPut, 'changeStore', { lostTypesLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        lostTypes: response.data || {},
        lostTypesLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      lostTypes: {},
      lostTypesLoading: false,
    });
  }
}

function *getStopElec({ payload }){ // 停机 - 损失电量
  const url = `${APIBasePath}${highAnalysis.getStopElec}`;
  try {
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stopElec: response.data || {},
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopElec: {},
    });
  }
}

function *getStopRank({ payload }){ // 停机 - 设备停机时长及次数
  const url = `${APIBasePath}${highAnalysis.getStopRank}`;
  try {
    yield call(easyPut, 'changeStore', { stopRankLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      parentFaultId: stopElecType[payload.parentFaultId],
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stopRank: response.data || [],
        stopRankLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopRank: [],
      stopRankLoading: false,
    });
  }
}

function *getStopTrend({ payload }){ // 停机 - 日月年 停机时长次数趋势图
  const url = `${APIBasePath}${highAnalysis.getStopTrend}`;
  try {
    yield call(easyPut, 'changeStore', { stopTrendLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      type: timeType[payload.type],
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stopTrend: response.data || [],
        stopTrendLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopTrend: [],
      stopTrendLoading: false,
    });
  }
}

function *getStopTypes({ payload }){ // 停机 - 各类停机时长及次数
  const url = `${APIBasePath}${highAnalysis.getStopTypes}`;
  try {
    yield call(easyPut, 'changeStore', { stopTypesLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stopTypes: response.data || [],
        stopTypesLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopTypes: [],
      stopTypesLoading: false,
    });
  }
}

export function* watchStationAhieve() {
  yield takeLatest(stationAchieveAction.getDevices, getDevices);
  yield takeLatest(stationAchieveAction.getLostRank, getLostRank);
  yield takeLatest(stationAchieveAction.getLostTrend, getLostTrend);
  yield takeLatest(stationAchieveAction.getLostTypes, getLostTypes);
  yield takeLatest(stationAchieveAction.getStopElec, getStopElec);
  yield takeLatest(stationAchieveAction.getStopRank, getStopRank);
  yield takeLatest(stationAchieveAction.getStopTrend, getStopTrend);
  yield takeLatest(stationAchieveAction.getStopTypes, getStopTypes);
}

