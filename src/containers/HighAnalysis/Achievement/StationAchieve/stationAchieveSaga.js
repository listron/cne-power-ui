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
        stopElec: response.data || [],
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopElec: [],
    });
  }
}

function *getStopRank({ payload }){ // 停机 - 设备停机时长及次数
  const url = `${APIBasePath}${highAnalysis.getStopRank}`;
  try {
    yield call(easyPut, 'changeStore', { stopRankLoading: true });
    const { parentFaultId } = payload;
    const response = yield call(request.post, url, {
      ...payload,
      parentFaultId: (parentFaultId === 'all' || !parentFaultId) ? undefined : parentFaultId,
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
    const { parentFaultId } = payload;
    const response = yield call(request.post, url, {
      ...payload,
      parentFaultId: (parentFaultId === 'all' || !parentFaultId) ? undefined : parentFaultId,
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

function *getCurveDevices({ payload }) { // 获取各机组曲线
  const url = `${APIBasePath}${highAnalysis.getCurveDevices}`;
  try {
    yield call(easyPut, 'changeStore', { curveDevicesLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveDevices: response.data || [],
        curveDevicesLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveDevices: [],
      curveDevicesLoading: false,
    });
  }
}

function *getCurveDevicesAep({ payload }) { // 各机组aep与风速
  const url = `${APIBasePath}${highAnalysis.getCurveDevicesAep}`;
  try {
    yield call(easyPut, 'changeStore', { curveDevicesAepLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveDevicesAep: response.data || [],
        curveDevicesAepLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveDevicesAep: [],
      curveDevicesAepLoading: false,
    });
  }
}

function *getCurveDevicesPsd({ payload }) { // 各机组聚合度psd
  const url = `${APIBasePath}${highAnalysis.getCurveDevicesPsd}`;
  try {
    yield call(easyPut, 'changeStore', { curveDevicesPsdLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveDevicesPsd: response.data || [],
        curveDevicesPsdLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveDevicesPsd: [],
      curveDevicesPsdLoading: false,
    });
  }
}

function *getCurveMonths({ payload }){ // 某机组各月功率曲线
  const url = `${APIBasePath}${highAnalysis.getCurveMonths}`;
  try {
    yield call(easyPut, 'changeStore', { curveMonthsLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveMonths: response.data || [],
        curveMonthsLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveMonths: [],
      curveMonthsLoading: false,
    });
  }
}

function *getCurveMonthAep({ payload }){ // 某机组各月aep及风速
  const url = `${APIBasePath}${highAnalysis.getCurveMonthAep}`;
  try {
    yield call(easyPut, 'changeStore', { curveMonthAepLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveMonthAep: response.data || [],
        curveMonthAepLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveMonthAep: [],
      curveMonthAepLoading: false,
    });
  }
}

function *getCurveMonthPsd({ payload }){ // 某机组psd聚合度
  const url = `${APIBasePath}${highAnalysis.getCurveMonthPsd}`;
  try {
    yield call(easyPut, 'changeStore', { curveMonthPsdLoading: true });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        curveMonthPsd: response.data || [],
        curveMonthPsdLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      curveMonthPsd: [],
      curveMonthPsdLoading: false,
    });
  }
}

function *resetLost({ payload }){
  yield call(easyPut, 'changeStore', {
    lostStringify: payload.lostStringify,
    lostChartDevice: null,
    lostChartTime: null,
    lostChartTimeMode: 'month',
  });
}

function *resetStop({ payload }){ // 停机重置。
  yield call(easyPut, 'changeStore', {
    stopTopStringify: payload.stopTopStringify,
    stopElecType: 'all',
    stopType: '',
    stopChartDevice: null,
    stopChartTime: null,
    stopChartTimeMode: 'month',
    stopChartTypes: null,
  });
}

function *resetCurve({ payload }){
  yield call(easyPut, 'changeStore', {
    curveTopStringify: payload.curveTopStringify,
    curveDeviceFullcode: null,
    curveDeviceName: null,
    curveDevicesTime: null,
    curveCheckedMonths: [],
    curveAllMonths: [],
  });
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
  yield takeLatest(stationAchieveAction.getCurveDevices, getCurveDevices);
  yield takeLatest(stationAchieveAction.getCurveDevicesAep, getCurveDevicesAep);
  yield takeLatest(stationAchieveAction.getCurveDevicesPsd, getCurveDevicesPsd);
  yield takeLatest(stationAchieveAction.getCurveMonths, getCurveMonths);
  yield takeLatest(stationAchieveAction.getCurveMonthAep, getCurveMonthAep);
  yield takeLatest(stationAchieveAction.getCurveMonthPsd, getCurveMonthPsd);
  yield takeLatest(stationAchieveAction.resetLost, resetLost);
  yield takeLatest(stationAchieveAction.resetStop, resetStop);
  yield takeLatest(stationAchieveAction.resetCurve, resetCurve);
}

