import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment'
import Path from '../../../../constants/path';
import { realtimeWarningAction } from './realtimeWarningAction.js';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor

function* getRealtimeWarningStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  //const url = '/mock/cleanWarning/totalEffect';
  try {
    const response = yield call(axios.get, url);

    if (response.data.code === '10000') {
      const result = response.data && response.data.data;
      yield put({
        type: realtimeWarningAction.changeRealtimeWarningStore,
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
      type: realtimeWarningAction.changeRealtimeWarningStore,
      payload: {
        oneWarningNum: '--',
        twoWarningNum: '--',
        threeWarningNum: '--',
        fourWarningNum: '--',
      },
    });
  }
}
function* getRealtimeWarning(action) {  // 请求实时告警
  const { payload, } = action;
  const { stationCodes, rangTime, } = payload;
  const url = `${APIBasePath}${monitor.getRealtimeAlarm}`
  try {
    yield put({
      type: realtimeWarningAction.changeRealtimeWarningStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      stationCode: stationCodes,
      startTime: rangTime,
    });
    const lastUpdateTime = moment().format('YYYY-MM-DD HH:mm');
    if (response.data.code === '10000') {
      const { payload } = action;
      yield put({
        type: realtimeWarningAction.changeRealtimeWarningStore,
        payload: {
          realtimeWarning: response.data.data || [],
          loading: false,
          ...payload,
          lastUpdateTime,
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: realtimeWarningAction.changeRealtimeWarningStore,
      payload: { ...payload, loading: false, realtimeWarning: [] },
    })
  }
}
function* transferWarning(action) {  // 转工单
  const { payload } = action;
  const url = `${APIBasePath}${monitor.transferAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: realtimeWarningAction.changeRealtimeWarningStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.monitor.realtimeWarningReducer.get('warningLevel'),
        stationType: state.monitor.realtimeWarningReducer.get('stationType'),
        stationCodes: state.monitor.realtimeWarningReducer.get('stationCodes'),
        deviceTypeCode: state.monitor.realtimeWarningReducer.get('deviceTypeCode'),
        rangTime: state.monitor.realtimeWarningReducer.get('rangTime'),
        warningTypeStatus: state.monitor.realtimeWarningReducer.get('warningTypeStatus'),
        warningType: state.monitor.realtimeWarningReducer.get('warningType'),
      }));
      yield put({
        type: realtimeWarningAction.getRealtimeWarning,
        payload: params
      });
    }else{
      throw response.data.data
    }
  } catch (e) {
    console.log(e);
  }
}
function* HandleRemoveWarning(action) {  // 手动解除告警
  const { payload } = action;
  const url = `${APIBasePath}${monitor.relieveAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: realtimeWarningAction.changeRealtimeWarningStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.monitor.realtimeWarningReducer.get('warningLevel'),
        stationType: state.monitor.realtimeWarningReducer.get('stationType'),
        stationCodes: state.monitor.realtimeWarningReducer.get('stationCodes'),
        deviceTypeCode: state.monitor.realtimeWarningReducer.get('deviceTypeCode'),
        rangTime: state.monitor.realtimeWarningReducer.get('rangTime'),
        warningTypeStatus: state.monitor.realtimeWarningReducer.get('warningTypeStatus'),
        warningType: state.monitor.realtimeWarningReducer.get('warningType'),
      }));
      yield put({
        type: realtimeWarningAction.getRealtimeWarning,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}


export function* watchMonitorRealtimeWarning() {
  yield takeLatest(realtimeWarningAction.getRealtimeWarningStatistic, getRealtimeWarningStatistic);
  yield takeLatest(realtimeWarningAction.getRealtimeWarning, getRealtimeWarning);
  yield takeLatest(realtimeWarningAction.transferWarning, transferWarning);
  yield takeLatest(realtimeWarningAction.HandleRemoveWarning, HandleRemoveWarning);
}