import { call, put, takeLatest, select } from 'redux-saga/effects';
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

function *changeAlarmStatisticStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  alarmAction.CHANGE_ALARM_STATISTIC_STORE,
    payload,
  });
}

function *resetAlarm(action) {//恢复reducer为默认初始值。
  yield put({
    type:  alarmAction.RESET_ALARM,
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
          lastUpdateTime: moment().format('YYYY-MM-DD HH:mm'),
          ...payload
        },
      });
      if(payload.warningLevel.length===0&&payload.stationType==='2'&&
      payload.stationCode.length===0&&payload.deviceTypeCode.length===0&&
      payload.warningConfigName.length===0&&payload.startTime.length===0&&
      payload.deviceName===''&&payload.isTransferWork===1&&payload.isRelieveAlarm===1) {
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

function *getHistoryAlarm(action) {  // 请求历史告警
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getHistoryAlarm;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          historyAlarm: response.data.data,
          ...payload
        },
      });     
    }  
  }catch(e){
    console.log(e);
  }
}

function *getStationsAlarmStatistic(action) {  // 请求多电站告警统计
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationsAlarmStatistic;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_STATISTIC_FETCH_SUCCESS,
        payload: {
          alarmStatistic: response.data.data,
          ...payload
        }   
      });
    }  
  }catch(e){
    console.log(e);
  }
}

function *getSingleStationAlarmStatistic(action) {  // 请求单电站告警统计
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getSingleStationAlarmStatistic;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_STATISTIC_FETCH_SUCCESS,
        payload: {
          singleAlarmStatistic: response.data.data.alarmChart,
          singleAlarmSummary: response.data.data.alarmSummary,
          startTime: payload.startTime,
          endTime: payload.endTime,
          singleStationCode: payload.stationCode,
          summaryType: payload.summaryType
        },
      });     
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

function *getTicketInfo(action) {  // 请求工单详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getTicketInfo}/${payload.workOrderId}`;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.get,url);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          ticketInfo: response.data.data
        },
      });      
    }  
  }catch(e){
    console.log(e);
  }
}

function *getRelieveInfo(action) {  // 请求屏蔽详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getRelieveInfo}/${payload.operateId}`;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.get,url);
    if(response.data.code === '10000') {
      yield put({
        type: alarmAction.GET_ALARM_FETCH_SUCCESS,
        payload: {
          relieveInfo: response.data.data
        },
      });      
    }  
  }catch(e){
    console.log(e);
  }
}

function *transferAlarm(action) {  // 转工单
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.transferAlarm;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000')
    {
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.monitor.alarm.get('warningLevel'),
        stationType: state.monitor.alarm.get('stationType'),
        stationCode: state.monitor.alarm.get('stationCode'),
        deviceTypeCode: state.monitor.alarm.get('deviceTypeCode'),
        warningConfigName: state.monitor.alarm.get('warningConfigName'),
        startTime: state.monitor.alarm.get('startTime'),
        endTime: state.monitor.alarm.get('endTime'),
        deviceName: state.monitor.alarm.get('deviceName'),
      }));
      yield put({
        type: alarmAction.GET_REALTIME_ALARM_SAGA,
        payload: params
      });     
    }  
  }catch(e){
    console.log(e);
  }
}

function *relieveAlarm(action) {  // 屏蔽告警
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.relieveAlarm;
  try{
    yield put({ type:alarmAction.ALARM_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000')
    {
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.monitor.alarm.get('warningLevel'),
        stationType: state.monitor.alarm.get('stationType'),
        stationCode: state.monitor.alarm.get('stationCode'),
        deviceTypeCode: state.monitor.alarm.get('deviceTypeCode'),
        warningConfigName: state.monitor.alarm.get('warningConfigName'),
        startTime: state.monitor.alarm.get('startTime'),
        endTime: state.monitor.alarm.get('endTime'),
        deviceName: state.monitor.alarm.get('deviceName'),
      }));
      yield put({
        type: alarmAction.GET_REALTIME_ALARM_SAGA,
        payload: params
      });     
    }  
  }catch(e){
    console.log(e);
  }
}


export function* watchAlarmMonitor() {
  yield takeLatest(alarmAction.CHANGE_ALARM_STORE_SAGA, changeAlarmStore);
  yield takeLatest(alarmAction.CHANGE_ALARM_STATISTIC_STORE_SAGA, changeAlarmStatisticStore);
  yield takeLatest(alarmAction.GET_REALTIME_ALARM_SAGA, getRealtimeAlarm);
  yield takeLatest(alarmAction.GET_HISTORY_ALARM_SAGA, getHistoryAlarm);
  yield takeLatest(alarmAction.GET_STATIONS_ALARM_STATISTIC_SAGA, getStationsAlarmStatistic);
  yield takeLatest(alarmAction.GET_SINGLESTATION_ALARM_STATISTIC_SAGA, getSingleStationAlarmStatistic);
  yield takeLatest(alarmAction.GET_ALARM_NUM_SAGA, getAlarmNum);
  yield takeLatest(alarmAction.GET_TICKET_INFO_SAGA, getTicketInfo);
  yield takeLatest(alarmAction.GET_RELIEVE_INFO_SAGA, getRelieveInfo);
  yield takeLatest(alarmAction.RESET_ALARM_SAGA, resetAlarm);
  yield takeLatest(alarmAction.TRANSFER_ALARM_SAGA, transferAlarm);
  yield takeLatest(alarmAction.RELIEVE_ALARM_SAGA, relieveAlarm);
}


