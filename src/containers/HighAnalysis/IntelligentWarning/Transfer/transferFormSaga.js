import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment'
import Path from '../../../../constants/path';
import { transferFormAction } from './transferFormAction.js';
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
        type:transferFormAction.changeTransferFormStore,
        payload: {
          oneWarningNum: (result.oneWarningNum ||  result.oneWarningNum===0)?result.oneWarningNum:'--',
          twoWarningNum: (result.twoWarningNum ||  result.twoWarningNum===0)?result.twoWarningNum:'--',
          threeWarningNum: (result.threeWarningNum ||  result.threeWarningNum===0)?result.threeWarningNum:'--',
          fourWarningNum: (result.fourWarningNum ||  result.fourWarningNum===0)?result.fourWarningNum:'--',
        },
      });
    }else{
      yield put({
        type:transferFormAction.changeTransferFormStore,
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
      type:transferFormAction.changeTransferFormStore,
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
      const total = response.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type:transferFormAction.changeTransferFormStore,
        payload: {
          total : response.data.total,
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
      type:transferFormAction.changeTransferFormStore,
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
        type:transferFormAction.changeTransferFormStore,
        payload: {
          ticketInfo: response.data.data||{}
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function* watchTransferForm() {
  yield takeLatest(transferFormAction.getTransferFormStatistic, getTransferFormStatistic);
  yield takeLatest(transferFormAction.getTransferForm, getTransferForm);
  yield takeLatest(transferFormAction.getTransferInfo, getTransferInfo);
}