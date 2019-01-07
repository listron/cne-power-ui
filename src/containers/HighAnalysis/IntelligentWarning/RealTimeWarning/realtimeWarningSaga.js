import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment'
import Path from '../../../../constants/path';
import { realtimeWarningActive } from './realtimeWarningActive.js';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor

function* getRealtimeWarningStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
  console.log(payload);
   const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  //const url = '/mock/cleanWarning/totalEffect';
  try {
    const response = yield call(axios.get, url);
    const lastUpdateTime=moment().format('YYYY-MM-DD HH:mm');
    console.log(lastUpdateTime);
    if (response.data.code === '10000') {
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          oneWarningNum: (response.data.oneWarningNum ||  response.data.oneWarningNum===0)?response.data.oneWarningNum:'--',
          twoWarningNum: (response.data.twoWarningNum ||  response.data.twoWarningNum===0)?response.data.twoWarningNum:'--',
          threeWarningNum: (response.data.threeWarningNum ||  response.data.threeWarningNum===0)?response.data.threeWarningNum:'--',
          fourWarningNum: (response.data.fourWarningNum ||  response.data.fourWarningNum===0)?response.data.fourWarningNum:'--',
          lastUpdateTime
        },
      });
    }else{
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          oneWarningNum:'--',
          twoWarningNum: '--',
          threeWarningNum: '--',
          fourWarningNum: '--',
          lastUpdateTime
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function *getRealtimeWarning(action) {  // 请求实时告警
  const { payload } = action;
  const url =`${APIBasePath}${monitor.getRealtimeAlarm}`
  try{
    yield put({
      type:realtimeWarningActive.changeRealtimeWarningStore,
      payload: {
        loading: true,
      },
    });  
    const response = yield call(axios.post,url,{
      ...payload,
      stationCode:payload.stationCodes?payload.stationCodes:payload.stationCode,
      startTime:payload.rangTime?payload.rangTime:payload.startTime,
    });
    if(response.data.code === '10000') {
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          realtimeWarning: response.data.data||[],
          loading:false
        },
      });     
    }  
  }catch(e){
    console.log(e);
  }
}
function *transferWarning(action) {  // 转工单
  const { payload } = action;
  const url = `${APIBasePath}${monitor.transferAlarm}`
  try{
    const response = yield call(axios.post,url,payload);
    if(response.data.code === '10000')
    {
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.highAanlysisReducer.realtimeWarningReducer.get('warningLevel'),
        stationType: state.highAanlysisReducer.realtimeWarningReducer.get('stationType'),
        stationCode: state.highAanlysisReducer.realtimeWarningReducer.get('stationCode'),
        deviceTypeCode: state.highAanlysisReducer.realtimeWarningReducer.get('deviceTypeCode'),
        warningConfigName: state.highAanlysisReducer.realtimeWarningReducer.get('warningConfigName'),
        startTime: state.highAanlysisReducer.realtimeWarningReducer.get('startTime'),
        deviceName: state.highAanlysisReducer.realtimeWarningReducer.get('deviceName'),
        isTransferWork: state.highAanlysisReducer.realtimeWarningReducer.get('isTransferWork'),
        isRelieveAlarm: state.highAanlysisReducer.realtimeWarningReducer.get('isRelieveAlarm'),
        warningTypeStatus: state.highAanlysisReducer.realtimeWarningReducer.get('warningTypeStatus'),
      }));
      yield put({
        type: realtimeWarningActive.getRealtimeWarning,
        payload: params
      });     
    }  
  }catch(e){
    console.log(e);
  }
}


export function* watchRealtimeWarning() {
  yield takeLatest(realtimeWarningActive.getRealtimeWarningStatistic, getRealtimeWarningStatistic);
  yield takeLatest(realtimeWarningActive.getRealtimeWarning, getRealtimeWarning);
  yield takeLatest(realtimeWarningActive.transferWarning, transferWarning);
}