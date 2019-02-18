import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { historyAction } from './historyReducer';
import { message } from 'antd';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getPointInfo(action) { // 获取可选测点
  const { payload } = action;
  const url = '/mock/monitor/dataAnalysisPoints'; // `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          pointInfo: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *getHistory(action) { // 历史趋势chart数据获取
  const { payload } = action;
  const url = '/mock/monitor/dataAnalysis/allHistory'; // `${APIBasePath}${monitor.getAllHistory}`;
  try{
    const historyType = { payload };
    delete payload.historyType;
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') { // chart数据图时，数据存入all，若为列表数据，存入part
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: historyType === 'chart' ? {
          allHistory: response.data.data || [],
        } : {
          partHistory: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取历史数据趋势失败!');
    console.log(e);
  }
}

export function* watchDataHistoryMonitor() {
  yield takeLatest(historyAction.getPointInfo, getPointInfo);
  yield takeLatest(historyAction.getHistory, getHistory);
}
