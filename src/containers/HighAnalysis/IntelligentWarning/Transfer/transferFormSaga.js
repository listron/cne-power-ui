import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment'
import Path from '../../../../constants/path';
import { transferFormActive } from './transferFormActive.js';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor
function* getTransferFormStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
   const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  try {
    const response = yield call(axios.get, url);
  
    if (response.data.code === '10000') {
      const result=response.data&&response.data.data;
      yield put({
        type:transferFormActive.changeTransferFormStore,
        payload: {
          oneWarningNum: (result.oneWarningNum ||  result.oneWarningNum===0)?result.oneWarningNum:'--',
          twoWarningNum: (result.twoWarningNum ||  result.twoWarningNum===0)?result.twoWarningNum:'--',
          threeWarningNum: (result.threeWarningNum ||  result.threeWarningNum===0)?result.threeWarningNum:'--',
          fourWarningNum: (result.fourWarningNum ||  result.fourWarningNum===0)?result.fourWarningNum:'--',
        },
      });
    }else{
      yield put({
        type:transferFormActive.changeTransferFormStore,
        payload: {
          oneWarningNum:'--',
          twoWarningNum: '--',
          threeWarningNum: '--',
          fourWarningNum: '--',
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function *getTransferForm(action) {  // 请求告警列表
  const { payload, } = action;
  const{stationCodes,rangTime,}=payload;
  const url =`${APIBasePath}${monitor.getHistoryAlarm}`
  try{
    yield put({
      type:transferFormActive.changeTransferFormStore,
      payload: {
        loading: true,
      },
    });  
    const response = yield call(axios.post,url,{
      ...payload,
      stationCode:stationCodes,
      startTime:rangTime,
    });
    if(response.data.code === '10000') {
      const { payload } = action;
      yield put({
        type:transferFormActive.changeTransferFormStore,
        payload: {
          transferFormList: response.data.data||[],
          loading:false,
          ...payload,
        },
      });     
    }else{
      throw response.data
    }  
  }catch(e){
    console.log(e);
    yield put({
      type:transferFormActive.changeTransferFormStore,
      payload: { ...payload, loading: false ,transferFormList:[]},
    })
  }
}
function* getTransferInfo(action) {  // 请求工单详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getTicketInfo}/${payload.workOrderId}`;
  try {
   
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type:transferFormActive.changeTransferFormStore,
        payload: {
          ticketInfo: response.data.data||[]
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function* watchTransferForm() {
  yield takeLatest(transferFormActive.getTransferFormStatistic, getTransferFormStatistic);
  yield takeLatest(transferFormActive.getTransferForm, getTransferForm);
  yield takeLatest(transferFormActive.getTransferInfo, getTransferInfo);
}