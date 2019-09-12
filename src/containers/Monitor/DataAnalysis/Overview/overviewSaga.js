import { call, put, takeLatest } from 'redux-saga/effects';
import request from '@utils/request';
import { message } from 'antd';
import moment from 'moment';
import path from '@path';
import { overviewAction } from './overviewReducer';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

const dateType = {
  day: 1,
  month: 2,
};

function* easyPut(actionName, payload){
  yield put({
    type: overviewAction[actionName],
    payload,
  });
}


function *getOverviewStation({ payload }){ // 电站相关数据信息
  try {
    const { stationCode, pageKey } = payload || {};
    const url = `${APIBasePath}${monitor.getOverviewStation}/${stationCode}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        [`${pageKey}TopData`]: response.data || {}, // 根据不同页面，生成: stationTopData, deviceTopData, pointTopData
        [`${pageKey}Unix`]: moment().unix(),
      });
    } else { throw response; }
  } catch (error) {
    console.log(error);
    message.error('获取电站基础信息失败, 请刷新重试');
  }
}

function *getOverviewDates({ payload }){ // 电站各日完整率
  try {
    const { stationCode, deviceTypeCode, month } = payload;
    const url = `${APIBasePath}${monitor.getOverviewDates}/${stationCode}/${deviceTypeCode}/${month}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stationDatesRate: response.data || [],
      });
    } else { throw response; }
  } catch (error) {
    console.log(error);
    yield call(easyPut, 'changeStore', {
      stationDatesRate: [],
    });
  }
}

function *getOverviewDevices({ payload }){ // 获取所有设备数据信息
  const url = `${APIBasePath}${monitor.getOverviewDevices}`;
  //post /api/v3/ dataoverriew/point
  // params: stationCode, deviceTypeCode, dateType, date, pointCodes
  try {
    const response = yield call(request.post, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        devicesData: response.data || {},
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      devicesData: {},
    });
  }
}

function *getOverviewPoints({ payload }){ // 获取各测点详情
  const url = `${APIBasePath}${monitor.getOverviewPoints}`;
  try {
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        pointsData: response.data || [],
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      pointsData: [],
    });
  }
}

export function* watchMonitorDataOverview() {
  yield takeLatest(overviewAction.getOverviewStation, getOverviewStation);
  yield takeLatest(overviewAction.getOverviewDates, getOverviewDates);
  yield takeLatest(overviewAction.getOverviewDevices, getOverviewDevices);
  yield takeLatest(overviewAction.getOverviewPoints, getOverviewPoints);
}

