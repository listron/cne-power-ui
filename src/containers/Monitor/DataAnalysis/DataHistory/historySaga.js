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
  const url = `${APIBasePath}${monitor.getPointsInfo}` // '/mock/monitor/dataAnalysisPoints';
  try {
    const response = yield call(axios.post, url, { deviceIds: deviceFullCode.map(e => e.deviceId) });
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

function *getChartHistory(action) { // 历史趋势chart数据获取
  const { payload } = action;
  const { queryParam } = payload;
  const url = `${APIBasePath}${monitor.getAllHistory}`; // '/mock/monitor/dataAnalysis/allHistory';
  try{
    const { devicePoint, startTime, endTime, deviceFullCode } = queryParam;
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { queryParam, chartLoading: true }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      deviceFullCodes: deviceFullCode.map(e => e.deviceCode),
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          chartTime: moment().unix(), // 用于比较
          allHistory: response.data.data || {},
          chartLoading: false
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { chartLoading: false }
    })
    console.log(e);
  }
}

function *getListHistory(action) { // 表格数据获取
  const { payload } = action;
  const { queryParam, listParam } = payload;
  const url = `${APIBasePath}${monitor.getListHistory}`; // /mock/monitor/dataAnalysis/listHistory;
  try{
    const { devicePoint, startTime, endTime, deviceFullCode } = queryParam;
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { queryParam, listParam, tableLoading: true }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      deviceFullCodes: deviceFullCode.map(e => e.deviceCode),
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    const { totalCount = 0 } = response.data.data;
    let { pageNum, pageSize } = listParam;
    const maxPage = Math.ceil(totalCount / pageSize);
    if (totalCount === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          listParam: {
            tableLoading: false,
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
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { tableLoading: false }
    })
    console.log(e);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const { queryParam } = yield select(state => state.monitor.dataHistory.toJS());
    const url = `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}` // '/mock/monitor/dataAnalysisSecendInteral';
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [1, 5 ,10] : [5 ,10],
          queryParam: {
            ...queryParam,
            timeInterval: hasSecond === 1 ? 1 : 5,
          }
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
