import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import path from '../../constants/path';
import { homepageAction } from './homepageAction';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths, { homepage } = APISubPaths;

function *getRealTimeData(action){ // 电站概况，实时监控，设备状态等
  // const url = `${APIBasePath}/${homepage.realTimeData}`;
  const url = '/mock/homepage/total';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        realTimeInfo: response.data.data || {},
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getCompleteRate(action){ // 完成率
  // const url = `${APIBasePath}/${homepage.completeRate}`;
  const url = '/mock/homepage/complete';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        completeRate: response.data.data || {},
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getEnergySaving(action){ // 节能减排
  // const url = `${APIBasePath}/${homepage.energySaving}`;
  const url = '/mock/homepage/saving';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        energySaving: response.data.data || {},
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getMonthPower(action){ // 每月发电量
  // const url = `${APIBasePath}/${homepage.monthPower}`;
  const url = '/mock/homepage/monthGen';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        monthPower: response.data.data || [],
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getEqpHours(action){ // 等效利用小时数
  // const url = `${APIBasePath}/${homepage.eqpHours}`;
  const url = '/mock/homepage/eqpHour';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        eqpHour: response.data.data || {},
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getFaultNumber(action){ // 故障台次
  // const url = `${APIBasePath}/${homepage.faultNumber}`;
  const url = '/mock/homepage/faultNumber';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        faultNumber: response.data.data || [],
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getMapStation(action){ // 地图坐标及统计
  const url = '/mock/homepage/map';
  // const url = `${APIBasePath}/${homepage.mapStationList}`;
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        mapStation: response.data.data || [],
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getSingleStation(action){ // 地图中某电站信息
  const url = '/mock/homepage/singleStation';
  // const url = `${APIBasePath}/${homepage.singleStation}`;
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        singleStation: response.data.data || {},
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getAlarmList(action){ // 告警列表
  // const url = `${APIBasePath}/${homepage.alarmList}`;
  const url = '/mock/homepage/alarm';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        alarmList: response.data.data || [],
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getOutputDiagram(action){ // 出力图表
  const url = '/mock/homepage/output';
  // const url = `${APIBasePath}/${homepage.outputDiagram}`;
  try{
    const response = yield call(axios.get, url);
    console.log(action);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        outputPower: response.data.data || [],
        outputPowerTime: '' // todo
      }
    })
  }catch(error){
    console.log(error);
  }
}

function* getOperationInfo(action){ // 运维情况
  // const url = `${APIBasePath}/${homepage.operationInfo}`;
  const url = '/mock/homepage/operation';
  try{
    const response = yield call(axios.get, url);
    yield put({
      type: homepageAction.GET_HOMEPAGE_FETCH_SUCCESS,
      payload: {
        operationInfo: response.data.data || {},
      }
    })
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

