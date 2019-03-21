import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { powerReportAction } from './powerReportAction';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor

function *getPowerReportList(action) {  // 请求报表列表
  const { payload } = action;
  const{stationCodes,rangTime,}=payload;
  const url =`${APIBasePath}${monitor.getHistoryAlarm}`
  try{
    yield put({
      type:powerReportAction.changePowerReportStore,
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
        type:powerReportAction.changePowerReportStore,
        payload: {
          total:response.data.data.total||0,
          powerReportList: response.data.data.list||[],
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
      type:powerReportAction.changePowerReportStore,
      payload: { ...payload, loading: false ,powerReportList:[]},
    })
  }
}


export function* watchMonitorPowerReport() {
  yield takeLatest(powerReportAction.getPowerReportList, getPowerReportList);
}