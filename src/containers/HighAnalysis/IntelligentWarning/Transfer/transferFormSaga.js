import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { transferFormActive } from './transferFormActive.js';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor
function* getTransferFormStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
   const url = `${APIBasePath}${monitor.getAlarmNum}`
  //const url = '/mock/cleanWarning/totalEffect';
  try {
   
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        payload: {
          oneWarningNum: (response.data.oneWarningNum ||  response.data.oneWarningNum===0)?response.data.oneWarningNum:'--',
          twoWarningNum: (response.data.twoWarningNum ||  response.data.twoWarningNum===0)?response.data.twoWarningNum:'--',
          threeWarningNum: (response.data.threeWarningNum ||  response.data.threeWarningNum===0)?response.data.threeWarningNum:'--',
          fourWarningNum: (response.data.fourWarningNum ||  response.data.fourWarningNum===0)?response.data.fourWarningNum:'--',
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function* watchTransferForm() {
  yield takeLatest(transferFormActive.getTransferFormStatistic, getTransferFormStatistic);
}