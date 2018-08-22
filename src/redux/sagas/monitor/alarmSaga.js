import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment'
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
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getRealtimeAlarm;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          realtimeAlarm: response.data.data,
          lastUpdateTime: moment().format('YYYY-MM-DD HH:mm')
        },
      });
      if(payload.warningLevel.length===0&&payload.stationType==='2'&&
      payload.stationCode.length===0&&payload.deviceTypeCode.length===0&&
      payload.warningConfigName.length===0&&payload.startTime===''&&
      payload.endTime===''&&payload.deviceName==='') {
        // const delay = (ms)=>new Promise((resolve)=> {
        //   setTimeout(resolve, ms);
        // });
        // yield call(delay, 10000);
        // yield put({
        //   type: alarmAction.GET_REALTIME_ALARM_SAGA,
        //   payload,
        // });
      }      
    }  
  }catch(e){
    console.log(e);
  }
}

function *getAlarmNum(action) {  // 请求告警个数
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getAlarmNum;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.get,url,{params:payload});
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          alarmNum: response.data.data
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
  yield takeLatest(alarmAction.GET_ALARM_NUM_SAGA, getAlarmNum);
}


