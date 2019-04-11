import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment'
import Path from '../../../../constants/path';
import { alarmCountAction } from './alarmCountAction.js';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor;


function* getAlarmStatistic(action) {  // 请求多电站告警统计
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationsAlarmStatistic;
  try {
    yield put({
      type: alarmCountAction.changeAlarmCountStore,
      payload: {
        queryPramas:payload,
      }
    });
    const response = yield call(axios.post, url,payload );
    if (response.data.code === '10000') {
      yield put({
        type: alarmCountAction.changeAlarmCountStore,
        payload: {
          alarmStatistic: response.data.data,
        }
      });
    }else{throw response.data}
  } catch (e) {
    message.warn('获取信息失败')
    yield put({
      type: alarmCountAction.changeAlarmCountStore,
      payload: {
        alarmStatistic: []
      }
    });
  }
}

function* getSingleAlarmStatistic(action) {  // 请求单电站告警统计
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getSingleStationAlarmStatistic;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: alarmCountAction.changeAlarmCountStore,
        payload: {
          singleAlarmStatistic: response.data.data.alarmChart,
          singleAlarmSummary: response.data.data.alarmSummary,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


export function* watchAlarmCount() {
  yield takeLatest(alarmCountAction.getAlarmStatistic, getAlarmStatistic);
  yield takeLatest(alarmCountAction.getSingleAlarmStatistic, getSingleAlarmStatistic);

}