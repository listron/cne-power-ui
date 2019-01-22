import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { handleRemoveActive } from './handleRemoveActive.js';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor
function* getHandleRemoveStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      const result = response.data && response.data.data;
      yield put({
        type: handleRemoveActive.changeHandleRemoveStore,
        payload: {
          oneWarningNum: (result.oneWarningNum || result.oneWarningNum === 0) ? result.oneWarningNum : '--',
          twoWarningNum: (result.twoWarningNum || result.twoWarningNum === 0) ? result.twoWarningNum : '--',
          threeWarningNum: (result.threeWarningNum || result.threeWarningNum === 0) ? result.threeWarningNum : '--',
          fourWarningNum: (result.fourWarningNum || result.fourWarningNum === 0) ? result.fourWarningNum : '--',

        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: handleRemoveActive.changeHandleRemoveStore,
      payload: {
        oneWarningNum: '--',
        twoWarningNum: '--',
        threeWarningNum: '--',
        fourWarningNum: '--',
      },
    });
  }
}
function* getHandleRemoveList(action) {  // 请求手动解除告警列表
  const { payload, } = action;
  const { stationCodes, rangTime, } = payload;
  const url = `${APIBasePath}${monitor.getHistoryAlarm}`
  try {
    yield put({
      type: handleRemoveActive.changeHandleRemoveStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      stationCode: stationCodes,
      startTime: rangTime,
    });
    if (response.data.code === '10000') {
      const { payload } = action;
      yield put({
        type: handleRemoveActive.changeHandleRemoveStore,
        payload: {
          handleRemoveList: response.data.data || [],
          loading: false,
          ...payload,
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: handleRemoveActive.changeHandleRemoveStore,
      payload: { ...payload, loading: false, realtimeWarning: [] },
    })
  }
}
function* getHandleRemoveTransfer(action) {  // 转工单
  const { payload } = action;
  const url = `${APIBasePath}${monitor.transferAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveActive.changeHandleRemoveStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.highAanlysisReducer.realtimeWarningReducer.get('warningLevel'),
        stationCode: state.highAanlysisReducer.realtimeWarningReducer.get('stationCodes'),
        deviceTypeCode: state.highAanlysisReducer.realtimeWarningReducer.get('deviceTypeCode'),
        startTime: state.highAanlysisReducer.realtimeWarningReducer.get('rangTime'),
        warningTypeStatus: state.highAanlysisReducer.realtimeWarningReducer.get('warningTypeStatus'),
      }));
      yield put({
        type: handleRemoveActive.getRealtimeWarning,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* cancleHandleRemove(action) {  // 取消手动解除告警
  const { payload } = action;
  const url = `${APIBasePath}${monitor.resetRelieveAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveActive.changeHandleRemoveStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.highAanlysisReducer.realtimeWarningReducer.get('warningLevel'),
        stationCode: state.highAanlysisReducer.realtimeWarningReducer.get('stationCodes'),
        deviceTypeCode: state.highAanlysisReducer.realtimeWarningReducer.get('deviceTypeCode'),
        startTime: state.highAanlysisReducer.realtimeWarningReducer.get('startTime'),
        warningTypeStatus: state.highAanlysisReducer.realtimeWarningReducer.get('warningTypeStatus'),
      }));
      yield put({
        type: handleRemoveActive.getRealtimeWarning,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getHandleRemoveInfo(action) {  // 请求屏蔽详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getRelieveInfo}/${payload.operateId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveActive.changeHandleRemoveStore,
        payload: {
          relieveInfo: response.data.data||{}
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function* watchHandleWarning() {
  yield takeLatest(handleRemoveActive.getHandleRemoveStatistic, getHandleRemoveStatistic);
  yield takeLatest(handleRemoveActive.getHandleRemoveList, getHandleRemoveList);
  yield takeLatest(handleRemoveActive.getHandleRemoveTransfer, getHandleRemoveTransfer);
  yield takeLatest(handleRemoveActive.cancleHandleRemove, cancleHandleRemove);
  yield takeLatest(handleRemoveActive.getHandleRemoveInfo, getHandleRemoveInfo);
}