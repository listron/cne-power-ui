import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../../constants/path';
import { deviceAction } from './deviceAction';

const monitorPath = {
  '206': {  // 组串式逆变器：206
    detail: path.APISubPaths.monitor.seriesinverterDetail,// '/mock/monitor/seriesinverter',  // path.APISubPaths.monitor.seriesinverterDetail,
    tenMin: path.APISubPaths.monitor.seriesinverterTenMin,// '/mock/monitor/seriesinverterTenMin',   // path.APISubPaths.monitor.seriesinverterTenMin
  },
  '201': {  // 集中式逆变器：201
    detail: path.APISubPaths.monitor.seriesinverterDetail,// '/mock/monitor/seriesinverter',  // path.APISubPaths.monitor.seriesinverterDetail,
    tenMin: path.APISubPaths.monitor.seriesinverterTenMin,// '/mock/monitor/seriesinverterTenMin',   // path.APISubPaths.monitor.seriesinverterTenMin
  },
  '202': {  // 汇流箱： 202
    detail: path.APISubPaths.monitor.confluenceboxDetail,//'/mock/monitor/confluenceboxDetail',  // path.APISubPaths.monitor.confluenceboxDetail,
    tenMin: path.APISubPaths.monitor.confluenceboxTenMin//'/mock/monitor/confluenceboxTenMin'  // path.APISubPaths.monitor.confluenceboxTenMin
  },
  '207': {  // 交流汇流箱
    detail: path.APISubPaths.monitor.confluenceboxDetail,//'/mock/monitor/confluenceboxDetail',  // path.APISubPaths.monitor.confluenceboxDetail,
    tenMin: path.APISubPaths.monitor.confluenceboxTenMin//'/mock/monitor/confluenceboxTenMin'  // path.APISubPaths.monitor.confluenceboxTenMin
  },
  '304': {  // 箱变： 304
    detail: path.APISubPaths.monitor.boxtransformerDetail,//'/mock/monitor/boxtransformerDetail',  // path.APISubPaths.monitor.boxtransformerDetail,
    tenMin: path.APISubPaths.monitor.boxtransformerTenMin//'/mock/monitor/boxtransformerTenMin',  // path.APISubPaths.monitor.boxtransformerTenMin
  },
  '203': {  // 气象站： 203
    detail: path.APISubPaths.monitor.weatherstationDetail,//'/mock/monitor/weatherstationDetail',  // path.APISubPaths.monitor.weatherstationDetail,
  },
}

function *changeDeviceStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
    payload,
  })
}

function *resetDeviceStore(action){
  const { payload } =action;
  yield put({
    type: deviceAction.RESET_DEVICE_MONITOR_STORE_SUCCESS,
    payload,
  })
}

function *getDeviceMonitorData(action) {  // 请求单设备数据(统计信息，十分钟数据，告警，测点数据)入口
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

function *getNormalDeviceData(action){ // 请求单设备-除气象站数据信息
  const { payload } = action;
  const {stationCode, deviceTypeCode, deviceCode } = payload;
  // const hours = 72;
  try{
    // const devicesUrl = '/mock/monitor/deviceList';
    const devicesUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.stationDeviceList}/${stationCode}/${deviceTypeCode}`;
    // const detailUrl = monitorPath[deviceTypeCode].detail;
    const detailUrl = `${path.basePaths.APIBasePath}${monitorPath[deviceTypeCode].detail}/${deviceCode}`;
    // const tenMinUrl = monitorPath[deviceTypeCode].tenMin;
    // const tenMinUrl = `${path.basePaths.APIBasePath}${monitorPath[deviceTypeCode].tenMin}/${deviceCode}/${hours}`;
    // const pointUrl = '/mock/monitor/monitorPointData';
    const pointUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.monitorPointData}/${deviceCode}`
    // const alarmUrl = '/mock/monitor/deviceAlarm';
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}`

    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [tmpDevices, tmpDetail, tmpPoint, tmpAlarm] = yield all([
      call(axios.get, devicesUrl),
      call(axios.get, detailUrl),
      call(axios.get, pointUrl),
      call(axios.get, alarmUrl),
    ])
    if(tmpDevices.data.code === '10000' && tmpDetail.data.code === "10000" && tmpPoint.data.code === "10000" && tmpAlarm.data.code === "10000" ){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          devices: tmpDevices.data.data || [],
          deviceDetail: tmpDetail.data.data || {},
          devicePointData: tmpPoint.data.data || [],
          deviceAlarmList: tmpAlarm.data.data || [],
        },
      })
    }else{
      console.log(tmpDevices.data.data)
      console.log(tmpDetail.data.data)
      console.log(tmpPoint.data.data)
      console.log(tmpAlarm.data.data)
    }
  }catch(e){
    console.log(e);
    yield put({  //清空数据
      type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        devices: [],
        deviceDetail: {},
        devicePointData: [],
        deviceAlarmList: [],
        loading: false,
      },
    })
  }
}

function *getTenMinDeviceData(action){ // 请求10min时序图数据信息
  const { payload } = action;
  const { deviceTypeCode, deviceCode, timeParam } = payload;
  try{
    const tenMinUrl = `${path.basePaths.APIBasePath}${monitorPath[deviceTypeCode].tenMin}/${deviceCode}/${timeParam}`;

    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const tmpTenMin = yield call(axios.get, tenMinUrl);
    if(tmpTenMin.data.code === "10000"){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceTenMin: tmpTenMin.data.data || [],
        },
      })
    }else{
      console.log(tmpTenMin.data.data)
    }
  }catch(e){
    console.log(e);
    yield put({  //清空数据
      type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        deviceTenMin: [],
        loading: false,
      },
    })
  }
}

function *getWeatherStationData(action){ // 请求气象站设备信息
  const { payload } = action;
  const { deviceTypeCode, deviceCode, stationCode } = payload;
  try{
    // const detailUrl = monitorPath[deviceTypeCode].detail;
    const detailUrl = `${path.basePaths.APIBasePath}${monitorPath[deviceTypeCode].detail}/${stationCode}`;
    // const alarmUrl = '/mock/monitor/deviceAlarm';
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}`
    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [tmpDetail,tmpAlarm] = yield all([
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ])
    if(tmpDetail.data.code === "10000" && tmpAlarm.data.code === "10000" ){
      yield put({//清空选中项
        type:  deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceDetail: tmpDetail.data.data || {},
          deviceAlarmList: tmpAlarm.data.data || [],
        },
      })
    }else{
      console.log(tmpDetail.data.data);
      console.log(tmpAlarm.data.data);
    }
  }catch(e){
    console.log(e);
    yield put({  //清空数据
      type:  deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        deviceDetail: {},
        deviceAlarmList: [],
        loading: false,
      },
    })
  }
}


function *getwindturbineData(action){ // 获取风机实时数据
  const { payload } = action;
  const {deviceCode,stationCode}=payload;
  try{
    const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.windturbine}/${deviceCode}`; // 实时数据
    const detailUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.getFanList}/${stationCode}`; // 设备列表
    const pointUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.monitorPointData}/${deviceCode}`; // 测点数据
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}` //告警数据
    yield put({type:deviceAction.MONITOR_DEVICE_FETCH});

    const [windturbine, fanPoint,fanDetail, fanAlarm] = yield all([
      call(axios.get, windturbineUrl),
      call(axios.get, pointUrl),
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ])

    if(windturbine.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceDetail: windturbine.data.data || {}, // 单风机详细数据
        }
      })
    }
    if(fanPoint.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          devicePointData: fanPoint.data.data || [],
        }
      })
    }
    if(fanAlarm.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          deviceAlarmList: fanAlarm.data.data || [],
        }
      })
    }
    if(fanDetail.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          devices: fanDetail.data.data.deviceList || [], // 同一个风机组下的数据
        }
      })
    }

  }catch(e){
    console.log(e)
  }
}


function *getSequencechartData(action){ // 获取风机图表数据
  const { payload } = action;
  const { deviceCode, timeParam,}=payload;
  const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.sequencechart}/${deviceCode}/${timeParam}`;
  try{
    yield put({type:deviceAction.MONITOR_DEVICE_FETCH});
    const response = yield call(axios.get, windturbineUrl);
    if(response.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          sequencechart: response.data.data || {},
        }
      })
    }
  }catch(e){
    console.log(e)
  }
}





export function* watchDeviceMonitor() {
  yield takeLatest(deviceAction.CHANGE_DEVICE_MONITOR_STORE_SAGA, changeDeviceStore);
  yield takeLatest(deviceAction.GET_DEVICE_DATA_SAGA, getDeviceMonitorData);
  yield takeLatest(deviceAction.GET_NORMAL_DEVICE_DATA_SAGA, getNormalDeviceData);
  yield takeLatest(deviceAction.GET_WEATHERSTATION_DATA_SAGA, getWeatherStationData);
  yield takeLatest(deviceAction.getwindturbineData, getwindturbineData);
  yield takeLatest(deviceAction.getSequencechartData, getSequencechartData);
  yield takeLatest(deviceAction.GET_DEVICE_MONITOR_TEN_MIN_DATA_SAGA, getTenMinDeviceData);
  yield takeLatest(deviceAction.RESET_DEVICE_MONITOR_STORE,resetDeviceStore);
}


