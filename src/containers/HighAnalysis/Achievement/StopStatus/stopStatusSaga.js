import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { stopStatusAction } from './stopStatusReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function* easyPut(actionName, payload){
  yield put({
    type: stopStatusAction[actionName],
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

function *getStopStatus({ payload }){ // 损失根源 - 指标排名
  const url = `${APIBasePath}${highAnalysis.getStopStatus}`;
  try {
    yield call(easyPut, 'changeStore', { stopStatusLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      deviceFullcodes: payload.deviceCodes,
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stopStatusList: response.data || [],
        stopStatusLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stopStatusList: [],
      stopStatusLoading: false,
    });
  }
}

export function* watchStopAhieve() {
  yield takeLatest(stopStatusAction.getDevices, getDevices);
  yield takeLatest(stopStatusAction.getStopStatus, getStopStatus);
}

