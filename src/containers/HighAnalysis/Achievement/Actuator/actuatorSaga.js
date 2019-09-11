import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import moment from 'moment';
import path from '../../../../constants/path';
import { actuatorAction } from './actuatorReducer';


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
        type: actuatorAction.fetchSuccess,
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

function *getYawRank(action){
  const url = `${APIBasePath}${highAnalysis.getYawRank}`;
  const { payload } = action;
  try {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        yawRankLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: actuatorAction.fetchSuccess,
        payload: {
          yawRankData: response.data,
          yawRankTime: moment().unix(), //时间戳
          yawRankLoading: false,
        },
      });
    } else{
      yield put({
        type: actuatorAction.changeStore,
        payload: {
          yawRankLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        yawRankLoading: false,
      },
    });
    message.error('获取各机组偏航时长及次数失败, 请刷新重试');
  }
}

function *getReleaseRank(action){
  const url = `${APIBasePath}${highAnalysis.getReleaseRank}`;
  const { payload } = action;
  try {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        releaseRankLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      // console.log(response.data, 'response.data');
      yield put({
        type: actuatorAction.fetchSuccess,
        payload: {
          releaseRankData: response.data,
          releaseRankTime: moment().unix(), //时间戳
          releaseRankLoading: false,
        },
      });
    } else{
      yield put({
        type: actuatorAction.changeStore,
        payload: {
          releaseRankLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        releaseRankLoading: false,
      },
    });
    message.error('获取各机组解缆时长及次数失败, 请刷新重试');
  }
}

function *getYawRend(action){
  const url = `${APIBasePath}${highAnalysis.getYawRend}`;
  const { payload } = action;
  try {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        yawRendLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      // console.log(response.data, 'response.data');
      yield put({
        type: actuatorAction.fetchSuccess,
        payload: {
          yawRendData: response.data,
          yawRendTime: moment().unix(), //时间戳
          yawRendLoading: false,
        },
      });
    } else{
      yield put({
        type: actuatorAction.changeStore,
        payload: {
          yawRendLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        yawRendLoading: false,
      },
    });
    message.error('获取每月偏航时长及次数失败, 请刷新重试');
  }
}


function *getReleaseRend(action){
  const url = `${APIBasePath}${highAnalysis.getReleaseRend}`;
  const { payload } = action;
  try {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        releaseRendLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      // console.log(response.data, 'response.data');
      yield put({
        type: actuatorAction.fetchSuccess,
        payload: {
          releaseRendData: response.data,
          releaseRendTime: moment().unix(), //时间戳
          releaseRendLoading: false,
        },
      });
    } else{
      yield put({
        type: actuatorAction.changeStore,
        payload: {
          releaseRendLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: actuatorAction.changeStore,
      payload: {
        releaseRendLoading: false,
      },
    });
    message.error('获取每月解缆时长及次数失败, 请刷新重试');
  }
}




export function* watchActuatorAchieve() {
  yield takeLatest(actuatorAction.getDevices, getDevices);
  yield takeLatest(actuatorAction.getYawRank, getYawRank);
  yield takeLatest(actuatorAction.getReleaseRank, getReleaseRank);
  yield takeLatest(actuatorAction.getYawRend, getYawRend);
  yield takeLatest(actuatorAction.getReleaseRend, getReleaseRend);
}
