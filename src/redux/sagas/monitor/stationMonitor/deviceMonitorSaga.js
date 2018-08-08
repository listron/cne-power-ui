import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationmonitor/deviceAction';

const monitorPath = {
  '206': {  // 组串式逆变器：206
    detail: '/mock/monitor/seriesinverter',  // Path.APISubPaths.monitor.seriesinverterDetail,
    tenMin: '/mock/monitor/seriesinverterTenMin',   // Path.APISubPaths.monitor.seriesinverterTenMin
  },
  '202': {  // 汇流箱： 202
    detail: '/mock/monitor/confluenceboxDetail',  // Path.APISubPaths.monitor.confluenceboxDetail,
    tenMin: '/mock/monitor/confluenceboxTenMin'  // Path.APISubPaths.monitor.confluenceboxTenMin
  },
  '304': {  // 箱变： 304
    detail: '/mock/monitor/boxtransformerDetail',  // Path.APISubPaths.monitor.boxtransformerDetail,
    tenMin: '/mock/monitor/boxtransformerTenMin',  // Path.APISubPaths.monitor.boxtransformerTenMin
  },
  '203': {  // 气象站： 203
    detail: '/mock/monitor/weatherstationDetail',  // Path.APISubPaths.monitor.weatherstationDetail,
  },
}

function *changeDeviceStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
    payload,
  })
}

function *getDeviceMonitorData(action) {  // 请求单设备数据入口
  const { payload } = action;
  const { deviceTypeCode } = payload;
  if (deviceTypeCode === '203') {  // 气象站
    yield put({
      type:  deviceAction.GET_WEATHERSTATION_DATA_SAGA,
      payload,
    })
  } else { // 其他-逆变器，汇流箱，箱变
    yield put({
      type:  deviceAction.GET_NORMAL_DEVICE_DATA_SAGA,
      payload,
    })
  }
}

function *getNormalDeviceData(action){
  const { payload } = action;
  const { deviceTypeCode, deviceCode } = payload;
  try{
    const detailUrl = monitorPath[deviceTypeCode].detail;
    // const detailUrl = `${Path.basePaths.newAPIBasePath}${monitorPath[deviceTypeCode].detail}/${deviceCode}`;
    const tenMinUrl = monitorPath[deviceTypeCode].tenMin;
    // const tenMinUrl = `${Path.basePaths.newAPIBasePath}${monitorPath[deviceTypeCode].tenMin}/${deviceCode}/${hours}`;
    const pointUrl = '/mock/monitor/monitorPointData';
    // const pointUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.monitorPointData}/${deviceCode}`
    const alarmUrl = '/mock/monitor/deviceAlarm';
    // const alarmUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}`

    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [tmpDetail,tmpTenMin,tmpPoint,tmpAlarm] = yield all([
      call(axios.get, detailUrl),
      call(axios.get, tenMinUrl),
      call(axios.get, pointUrl),
      call(axios.get, alarmUrl),
    ])
    console.log(tmpDetail)
    console.log(tmpTenMin)
    console.log(tmpPoint)
    console.log(tmpAlarm)
    // if(response.data.code === "10000"){
    //   yield put({//清空选中项
    //     type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
    //     payload: {
    //       deviceTenMin: response.data.data,
    //     },
    //   })
    // }
  }catch(e){
    console.log(e);
  }
}

function *getWeatherStationData(action){
  const { payload } = action;
  const { deviceTypeCode, deviceCode } = payload;
  try{
    // const detailUrl = `${Path.basePaths.newAPIBasePath}${monitorPath[deviceTypeCode].detail}/${deviceCode}`;
    const detailUrl = monitorPath[deviceTypeCode].detail;
    const alarmUrl = '/mock/monitor/deviceAlarm';
    // const alarmUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}`

    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [tmpDetail,tmpAlarm] = yield all([
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ])
    console.log(tmpDetail)
    console.log(tmpAlarm)
    // if(response.data.code === "10000"){
    //   yield put({//清空选中项
    //     type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
    //     payload: {
    //       deviceTenMin: response.data.data,
    //     },
    //   })
    // }
  }catch(e){
    console.log(e);
  }
}
/*
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

  function *getDeviceAlarmData(action) {  // 请求设备告警信息
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
*/


export function* watchDeviceMonitor() {
  yield takeLatest(deviceAction.CHANGE_DEVICE_MONITOR_STORE_SAGA, changeDeviceStore);

  yield takeLatest(deviceAction.GET_DEVICE_DATA_SAGA, getDeviceMonitorData);
  yield takeLatest(deviceAction.GET_NORMAL_DEVICE_DATA_SAGA, getNormalDeviceData);
  yield takeLatest(deviceAction.GET_WEATHERSTATION_DATA_SAGA, getWeatherStationData);

  // yield takeLatest(deviceAction.GET_INVERTER_DETAIL_SAGA, getInverterDetail);
  // yield takeLatest(deviceAction.GET_INVERTER_TENMIN_SAGA, getInverterTenMin);
  // yield takeLatest(deviceAction.GET_CONFLUENCEBOX_DETAIL_SAGA, getConfluenceBoxDetail);
  // yield takeLatest(deviceAction.GET_CONFLUENCEBOX_TENMIN_SAGA, getConfluenceBoxTenMin);
  // yield takeLatest(deviceAction.GET_TRANSFORMER_DETAIL_SAGA, getTransformerDetail);
  // yield takeLatest(deviceAction.GET_TRANSFORMER_TENMIN_SAGA, getTransformerTenMin);
  // yield takeLatest(deviceAction.GET_WEATHERSTATION_DETAIL_SAGA, getWeatherStationDetail);
  // yield takeLatest(deviceAction.GET_MONITOR_POINT_SAGA, getDevicePointData);
  // yield takeLatest(deviceAction.GET_DEVICE_ALARM_SAGA, getDeviceAlarmData);
}


