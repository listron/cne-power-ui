import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../constants/path';
import { homepageAction } from './homepageAction';
import moment from 'moment';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths, { homepage } = APISubPaths;

function *getRealTimeData(action){ // 电站概况，实时监控，设备状态等
  const { payload } = action;
  const { enterpriseId } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.realTimeData}/${enterpriseId}/${utcTime}`;
  // const url = '/mock/homepage/total';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        realTimeInfo: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getCompleteRate(action){ // 完成率
  const { payload } = action;
  const { enterpriseId } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.completeRate}/${enterpriseId}/${utcTime}`;
  // const url = '/mock/homepage/complete';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        completeRate: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getEnergySaving(action){ // 节能减排
  const { payload } = action;
  const { enterpriseId } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.energySaving}/${enterpriseId}/${utcTime}`;
  // const url = '/mock/homepage/saving';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        energySaving: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getMonthPower(action){ // 每月发电量
  const { payload } = action;
  const { enterpriseId, stationType } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.monthPower}/${enterpriseId}/${stationType}/${utcTime}`;
  // const url = '/mock/homepage/monthGen';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        monthPower: response.data.data || [],
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getEqpHours(action){ // 等效利用小时数
  const { payload } = action;
  const { enterpriseId, stationType } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.eqpHours}/${enterpriseId}/${stationType}/${utcTime}`;
  // const url = '/mock/homepage/eqpHour';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        eqpHour: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getFaultNumber(action){ // 故障台次
  const { payload } = action;
  const { enterpriseId, stationType } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.faultNumber}/${enterpriseId}/${stationType}/${utcTime}`;
  // const url = '/mock/homepage/faultNumber';
  try{
    const response = yield call(axios.get, url);
    const faultQueryTime = moment().format('x'); // 记录时间
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        faultNumber: response.data.data || [],
        faultQueryTime,
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getMapStation(action){ // 地图坐标及统计
  // const url = '/mock/homepage/map';
  const { payload } = action;
  const { enterpriseId } = payload;
  const url = `${APIBasePath}${homepage.mapStationList}/${enterpriseId}`;
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        mapStation: response.data.data || [],
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getSingleStation(action){ // 地图中某电站信息
  // const url = '/mock/homepage/singleStation';
  const { payload } = action;
  const { stationCode } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.singleStation}/${stationCode}/${utcTime}`;
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        singleStation: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getAlarmList(action){ // 告警列表
  const { payload } = action;
  const { enterpriseId } = payload;
  const utcTime = moment().utc().format();
  const url = `${APIBasePath}${homepage.alarmList}/${enterpriseId}/2/${utcTime}`;
  // const url = '/mock/homepage/alarm';
  try{
    const response = yield call(axios.get, url);
    const alarmeQueryTime = moment().format('x'); // 记录时间
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        alarmList: response.data.data || [],
        alarmeQueryTime,
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getOutputDiagram(action){ // 出力图表
  const { payload } = action;
  const { enterpriseId, stationType } = payload;
  // const url = '/mock/homepage/output';
  const endTime = moment().utc().format();
  const startTime = moment().startOf('day').utc().format();
  const url = `${APIBasePath}${homepage.outputDiagram}/${enterpriseId}/${stationType}/${startTime}/${endTime}`;
  try{
    const response = yield call(axios.get, url);
    const outputPowerTime = moment().format('x'); // 记录时间
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        outputPower: response.data.data || [],
        outputPowerTime,
      },
    });
  }catch(error){
    console.log(error);
  }
}

function* getOperationInfo(action){ // 运维情况
  const { payload } = action;
  const { enterpriseId } = payload;
  const startTime = `${moment().startOf('month').format('YYYY-MM-DD')}T${moment().startOf('month').format('HH:mm:ss')}Z`;
  const endTime = `${moment().format('YYYY-MM-DD')}T${moment().format('HH:mm:ss')}Z`;
  const url = `${APIBasePath}${homepage.operationInfo}/${enterpriseId}/2/${startTime}/${endTime}`;
  // const url = '/mock/homepage/operation';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        operationInfo: response.data.data || {},
      },
    });
  }catch(error){
    console.log(error);
  }
}

export function* watchHomepage() {
  yield takeLatest(homepageAction.getRealTimeData, getRealTimeData);
  yield takeLatest(homepageAction.getCompleteRate, getCompleteRate);
  yield takeLatest(homepageAction.getEnergySaving, getEnergySaving);
  yield takeLatest(homepageAction.getMonthPower, getMonthPower);
  yield takeLatest(homepageAction.getEqpHours, getEqpHours);
  yield takeLatest(homepageAction.getFaultNumber, getFaultNumber);
  yield takeLatest(homepageAction.getMapStation, getMapStation);
  yield takeLatest(homepageAction.getSingleStation, getSingleStation);
  yield takeLatest(homepageAction.getAlarmList, getAlarmList);
  yield takeLatest(homepageAction.getOutputDiagram, getOutputDiagram);
  yield takeLatest(homepageAction.getOperationInfo, getOperationInfo);
}

