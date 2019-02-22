import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { historyAction } from './historyReducer';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getPointInfo(action) { // 获取可选测点
  const { payload } = action;
  const { deviceFullCode } = payload;
  const url = '/mock/monitor/dataAnalysisPoints'; // `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(axios.post, url, { deviceId: deviceFullCode.map(e => e.deviceCode) });
    const { queryParam } = yield select(state => state.monitor.dataHistory.toJS());
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          queryParam: { ...queryParam, deviceFullCode },
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
    const { devicePoint, startTime, endTime } = queryParam;
    const response = yield call(axios.post, url, {
      ...queryParam,
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          queryParam,
          chartTime: moment().unix(), // 用于比较
          allHistory: response.data.data || {},
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
    const { devicePoint, startTime, endTime } = queryParam;
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    const { total = 0 } = response.data.data;
    let { pageNum, pageSize } = listParam;
    const maxPage = Math.ceil(total / pageSize);
    if(total === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          queryParam,
          listParam: {
            ...listParam,
            pageNum, 
            pageSize
          },
          partHistory: response.data.data || {},
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

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const url = '/mock/monitor/dataAnalysisSecendInteral'; // `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [1, 5 ,10] : [5 ,10],
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取企业数据时间间隔信息失败!');
    console.log(error);
  }
}

export function* watchDataHistoryMonitor() {
  yield takeLatest(historyAction.getPointInfo, getPointInfo);
  yield takeLatest(historyAction.getChartHistory, getChartHistory);
  yield takeLatest(historyAction.getListHistory, getListHistory);
  yield takeLatest(historyAction.getSecendInterval, getSecendInterval);
}
