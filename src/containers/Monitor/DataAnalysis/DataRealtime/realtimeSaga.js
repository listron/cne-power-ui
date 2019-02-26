import { call, put, takeLatest, select, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { realtimeAction } from './realtimeReducer';
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
    const { queryParam } = yield select(state => state.monitor.dataRealtime.toJS());
    if (response.data.code === '10000') {
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          queryParam: {
            ...queryParam,
            deviceFullCode,
            devicePoint: [],
          },
          pointInfo: response.data.data || [],
          chartRealtime: {},
          listRealtime: {},
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

function *getRealtimeChart(action) { // 实时chart数据获取
  const { payload } = action;
  const { queryParam } = payload;
  const url = '/mock/monitor/dataAnalysisChartRealtime'; // `${APIBasePath}${monitor.getRealtimeChart}`;
  try{
    const { devicePoint } = queryParam;
    const response = yield call(axios.post, url, {
      ...queryParam,
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    if (response.data.code === '10000') {
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          queryParam,
          dataTime: moment().unix(), // 用于比较
          chartRealtime: response.data.data || {},
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

function *getRealtimeList(action) { // 实时表格数据获取
  const { payload } = action;
  const { queryParam, listParam } = payload;
  const url = '/mock/monitor/dataAnalysisListRealtime'; // `${APIBasePath}${monitor.getRealtimeList}`;
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
        type: realtimeAction.GET_REALTIME_SUCCESS,
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
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? 1 : 5, // 1s级数据与5s级数据。
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

export function* watchDataRealtimeMonitor() {
  yield takeLatest(realtimeAction.getPointInfo, getPointInfo);
  yield takeLatest(realtimeAction.getRealtimeChart, getRealtimeChart);
  yield takeLatest(realtimeAction.getRealtimeList, getRealtimeList);
  yield takeLatest(realtimeAction.getSecendInterval, getSecendInterval);
}
