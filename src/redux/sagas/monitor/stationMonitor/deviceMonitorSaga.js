import { call, put, takeLatest,select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';

import { deviceAction } from '../../../../constants/actionTypes/monitor/stationmonitor/deviceAction';


function *changeDeviceStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
    payload,
  })
}

function *getInverterDetail(action) {  // 请求逆变器详情
  const { payload } = action;
  const url = '/mock/monitor/seriesinverter';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.seriesinverterDetail}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get, url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload: {
        deviceDetail: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getInverterTenMin(action) {  // 请求逆变器十分钟数据
  const { payload } = action;
  const url = '/mock/monitor/seriesinverterTenMin';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.seriesinverterTenMin}/${payload.deviceCode}/${payload.hours}`
  try{
    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({//清空选中项
        type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceTenMin: response.data.data,
        },
      })
    }
  }catch(e){
    console.log(e);
  }
}

function *getConfluenceBoxDetail(action) {  // 请求汇流箱详情
  const { payload } = action;
  const url = '/mock/monitor/confluenceboxDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.confluenceboxDetail}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload:{
        deviceDetail: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getConfluenceBoxTenMin(action) {  // 请求汇流箱十分钟数据
  const { payload } = action;
  const url = '/mock/monitor/confluenceboxTenMin';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.confluenceboxTenMin}/${payload.deviceCode}/${payload.hours}`
  try{
    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({//清空选中项
        type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceTenMin: response.data.data,
        },
      })
    }
  }catch(e){
    console.log(e);
  }
}

function *getTransformerDetail(action) {  // 请求箱变详情
  const { payload } = action;
  const url = '/mock/monitor/boxtransformerDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.boxtransformerDetail}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload:{
        deviceDetail: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getTransformerTenMin(action) {  // 请求箱变十分钟数据
  const { payload } = action;
  const url = '/mock/monitor/boxtransformerTenMin';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.boxtransformerTenMin}/${payload.deviceCode}/${payload.hours}`
  try{
    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get, url);
    if(response.data.code === "10000"){
      yield put({//清空选中项
        type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceTenMin: response.data.data,
        },
      })
    }
  }catch(e){
    console.log(e);
  }
}

function *getWeatherStationDetail(action) {  // 请求气象站详情
  const { payload } = action;
  const url = '/mock/monitor/weatherstationDetail';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.weatherstationDetail}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload:{
        deviceDetail: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getDevicePointData(action) {  // 请求设备下各测点信息
  const { payload } = action;
  const url = '/mock/monitor/monitorPointData';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.monitorPointData}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload:{
        devicePointData: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *getDeviceAlarmData(action) {  // 请求设备下各测点信息
  const { payload } = action;
  const url = '/mock/monitor/deviceAlarm';
  // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.deviceAlarmData}/${payload.deviceCode}`
  try{
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const response = yield call(axios.get,url);
    yield put({
      type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload:{
        deviceAlarmData: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}

export function* watchDeviceMonitor() {
  yield takeLatest(deviceAction.CHANGE_DEVICE_MONITOR_STORE_SAGA, changeDeviceStore);
  yield takeLatest(deviceAction.GET_INVERTER_DETAIL_SAGA, getInverterDetail);
  yield takeLatest(deviceAction.GET_INVERTER_TENMIN_SAGA, getInverterTenMin);
  yield takeLatest(deviceAction.GET_CONFLUENCEBOX_DETAIL_SAGA, getConfluenceBoxDetail);
  yield takeLatest(deviceAction.GET_CONFLUENCEBOX_TENMIN_SAGA, getConfluenceBoxTenMin);
  yield takeLatest(deviceAction.GET_TRANSFORMER_DETAIL_SAGA, getTransformerDetail);
  yield takeLatest(deviceAction.GET_TRANSFORMER_TENMIN_SAGA, getTransformerTenMin);
  yield takeLatest(deviceAction.GET_WEATHERSTATION_DETAIL_SAGA, getWeatherStationDetail);
  yield takeLatest(deviceAction.GET_MONITOR_POINT_SAGA, getDevicePointData);
  yield takeLatest(deviceAction.GET_DEVICE_ALARM_SAGA, getDeviceAlarmData);
}


