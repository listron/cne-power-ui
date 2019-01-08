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
   const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  //const url = '/mock/cleanWarning/totalEffect';
  try {
    const response = yield call(axios.get, url);
    const lastUpdateTime=moment().format('YYYY-MM-DD HH:mm');
    if (response.data.code === '10000') {
      const result=response.data&&response.data.data;
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          oneWarningNum: (result.oneWarningNum ||  result.oneWarningNum===0)?result.oneWarningNum:'--',
          twoWarningNum: (result.twoWarningNum ||  result.twoWarningNum===0)?result.twoWarningNum:'--',
          threeWarningNum: (result.threeWarningNum ||  result.threeWarningNum===0)?result.threeWarningNum:'--',
          fourWarningNum: (result.fourWarningNum ||  result.fourWarningNum===0)?result.fourWarningNum:'--',
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
  const { payload, } = action;
  const{stationCodes,stationCode,rangTime,startTime,endTime}=payload;
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
      stationCode:stationCodes,
      startTime:rangTime,
      // endTime:rangTime?rangTime[1]:endTime,
    });
    if(response.data.code === '10000') {
      const { payload } = action;
      const time=payload.createTimeStart?payload.createTimeStart:payload.startTime;
      const endtime=payload.createTimeEnd?payload.createTimeEnd:payload.endTime;
      console.log(time,endtime,'test');
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          realtimeWarning: response.data.data||[],
          loading:false,
          ...payload,
         
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
        stationCode: state.highAanlysisReducer.realtimeWarningReducer.get('stationCode'),
        deviceTypeCode: state.highAanlysisReducer.realtimeWarningReducer.get('deviceTypeCode'),
        startTime: state.highAanlysisReducer.realtimeWarningReducer.get('rangTime'),
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
function* HandleRemoveWarning(action) {  // 手动解除告警
  const { payload } = action;
  const url = `${APIBasePath}${monitor.relieveAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type:realtimeWarningActive.changeRealtimeWarningStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.highAanlysisReducer.realtimeWarningReducer.get('warningLevel'),
        stationCode: state.highAanlysisReducer.realtimeWarningReducer.get('stationCode'),
        deviceTypeCode: state.highAanlysisReducer.realtimeWarningReducer.get('deviceTypeCode'),
        startTime: state.highAanlysisReducer.realtimeWarningReducer.get('startTime'),
        warningTypeStatus: state.highAanlysisReducer.realtimeWarningReducer.get('warningTypeStatus'),
      }));
      yield put({
        type: realtimeWarningActive.getRealtimeWarning,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}


export function* watchRealtimeWarning() {
  yield takeLatest(realtimeWarningActive.getRealtimeWarningStatistic, getRealtimeWarningStatistic);
  yield takeLatest(realtimeWarningActive.getRealtimeWarning, getRealtimeWarning);
  yield takeLatest(realtimeWarningActive.transferWarning, transferWarning);
  yield takeLatest(realtimeWarningActive.HandleRemoveWarning, HandleRemoveWarning);
}