import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../constants/path';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';

function *changeAlarmStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  alarmAction.CHANGE_ALARM_STORE,
    payload,
  });
}

function *getRealtimeAlarm(action) {  // 请求实时告警
  const { payload } = action;
  // const realtimeAlarmUrl = Path.basePaths.newAPIBasePath + Path.APISubPaths.monitor.getRealtimeAlarm;
  const url = '/mock/monitor/getRealtimeAlarm';
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          realtimeAlarm: response.data.data
        },
      });      
    }  
  }catch(e){
    console.log(e);
  }
}


export function* watchAlarmMonitor() {
  yield takeLatest(alarmAction.CHANGE_ALARM_STORE_SAGA, changeAlarmStore);
  yield takeLatest(alarmAction.GET_REALTIME_ALARM_SAGA, getRealtimeAlarm);
}


