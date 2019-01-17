import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { historyWarningActive } from './historyWarningActive';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor
function *getHistoryarningList(action) {  // 请求告警列表
  const { payload, } = action;
  const{stationCodes,rangTime,}=payload;
  const url =`${APIBasePath}${monitor.getHistoryAlarm}`
  try{
    yield put({
      type:historyWarningActive.changeHistoryWarningStore,
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
        type:historyWarningActive.changeHistoryWarningStore,
        payload: {
          historyWarningList: response.data.data||[],
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
      type:historyWarningActive.changeHistoryWarningStore,
      payload: { ...payload, loading: false ,historyWarningList:[]},
    })
  }
}
function* getHistoryTicketInfo(action) {  // 请求工单详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getTicketInfo}/${payload.workOrderId}`;
  try {
   
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type:historyWarningActive.changeHistoryWarningStore,
        payload: {
          ticketInfo: response.data.data||{}
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getHistoryRelieveInfo(action) {  // 请求屏蔽详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getRelieveInfo}/${payload.operateId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: historyWarningActive.changeHistoryWarningStore,
        payload: {
          relieveInfo: response.data.data||{}
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchHistoryWarning() {
  yield takeLatest(historyWarningActive.getHistoryarningList, getHistoryarningList);
  yield takeLatest(historyWarningActive.getHistoryTicketInfo, getHistoryTicketInfo);
  yield takeLatest(historyWarningActive.getHistoryRelieveInfo, getHistoryRelieveInfo);
}