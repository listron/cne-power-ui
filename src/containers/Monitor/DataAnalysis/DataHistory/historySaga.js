import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { historyAction } from './historyReducer';
import { message } from 'antd';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getPointInfo(action) { // 获取可选测点
  const { payload } = action;
  const { deviceFullCode } = payload;
  const url = '/mock/monitor/dataAnalysisPoints'; // `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(axios.post, url, { deviceId: deviceFullCode.map(e => e.deviceCode) });
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          deviceFullCode,
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

function *getChartHistory(action) { // 历史趋势chart数据获取
  const { payload } = action;
  const { queryParam } = payload;
  const url = '/mock/monitor/dataAnalysis/allHistory'; // `${APIBasePath}${monitor.getAllHistory}`;
  try{
    const { devicePoint } = queryParam;
    console.log()
    console.log(devicePoint)
    const response = yield call(axios.post, url, {
      ...queryParam,
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    console.log('chart error')
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          queryParam,
          allHistory: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    console.log(e);
  }
}

function *getListHistory(action) { // 表格数据获取
  const { payload } = action;
  const { queryParam, listParam } = payload;
  const url = '/mock/monitor/dataAnalysis/listHistory'; // `${APIBasePath}${monitor.getListHistory}`;
  try{
    const { devicePoint } = queryParam;
    console.log(queryParam)
    console.log(devicePoint)
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    console.log('list error')
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          queryParam,
          listParam,
          partHistory: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    console.log(e);
  }
}

export function* watchDataHistoryMonitor() {
  yield takeLatest(historyAction.getPointInfo, getPointInfo);
  yield takeLatest(historyAction.getChartHistory, getChartHistory);
  yield takeLatest(historyAction.getListHistory, getListHistory);
}
