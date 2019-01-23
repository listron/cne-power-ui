import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { historyWarningAction } from './historyWarningAction';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor
function *getHistoryarningList(action) {  // 请求告警列表
  const { payload, } = action;
  const{stationCodes,rangTime,}=payload;
  const url =`${APIBasePath}${monitor.getHistoryAlarm}`
  try{
    yield put({
      type:historyWarningAction.changeHistoryWarningStore,
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
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type:historyWarningAction.changeHistoryWarningStore,
        payload: {
          total : response.data.data.total||0,
          historyWarningList: response.data.data.list||[],
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
      type:historyWarningAction.changeHistoryWarningStore,
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
        type:historyWarningAction.changeHistoryWarningStore,
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
        type: historyWarningAction.changeHistoryWarningStore,
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
  yield takeLatest(historyWarningAction.getHistoryarningList, getHistoryarningList);
  yield takeLatest(historyWarningAction.getHistoryTicketInfo, getHistoryTicketInfo);
  yield takeLatest(historyWarningAction.getHistoryRelieveInfo, getHistoryRelieveInfo);
}