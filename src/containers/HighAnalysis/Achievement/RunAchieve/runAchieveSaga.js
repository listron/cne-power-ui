import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { runAchieveAction } from './runAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *getDevices({ payload }){
  const url = `${APIBasePath}${highAnalysis.getDevices}`;
  try {
    const { stationCode } = payload || {};
    const response = yield call(request.post, url, {
      stationCodes: [stationCode],
      deviceTypeCode: 101,
    });
    if (response.code === '10000') {
      console.log(response.data, 'response.data');
      const originData = response.data.dataList || [];
      const modeDevices = originData.map(e => ({
        value: e.deviceModeCode,
        label: e.deviceModeName,
        children: (e.devices && e.devices.length > 0) ? e.devices.map(m => ({
          value: m.deviceFullcode,
          label: m.deviceName,
        })) : [],
      }));
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          modeDevices,
        },
      });
    } else{
      throw response.data;
    }
  } catch (error) {
    message.error('获取设备失败, 请刷新重试');
  }
}

export function* watchRunAhieve() {
  yield takeLatest(runAchieveAction.getDevices, getDevices);
}
