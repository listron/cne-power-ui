import { call, put, takeLatest, all,fork,cancel } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import path from '../../../../constants/path';
import { deviceAction } from './deviceAction';
import { throwError } from 'rxjs';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;
let realChartsInterval=null;
let WindDeviceRealData=null;

const monitorPath = {
  '206': {  // 组串式逆变器：206
    detail: monitor.seriesinverterDetail, //  '/mock/monitor/seriesinverter'
    tenMin: monitor.seriesinverterTenMin, //  '/mock/monitor/seriesinverterTenMin' 
  },
  '201': {  // 集中式逆变器：201
    detail: monitor.seriesinverterDetail, //  '/mock/monitor/seriesinverter'
    tenMin: monitor.seriesinverterTenMin, //  '/mock/monitor/seriesinverterTenMin' 
  },
  '202': {  // 汇流箱： 202
    detail: monitor.confluenceboxDetail, // '/mock/monitor/confluenceboxDetail'
    tenMin: monitor.confluenceboxTenMin, // '/mock/monitor/confluenceboxTenMin'  
  },
  '207': {  // 交流汇流箱
    detail: monitor.confluenceboxDetail, // '/mock/monitor/confluenceboxDetail'
    tenMin: monitor.confluenceboxTenMin, // '/mock/monitor/confluenceboxTenMin'  
  },
  '304': {  // 箱变： 304
    detail: monitor.boxtransformerDetail, // '/mock/monitor/boxtransformerDetail'
    tenMin: monitor.boxtransformerTenMin, // '/mock/monitor/boxtransformerTenMin'
  },
  '203': {  // 气象站： 203
    detail: monitor.weatherstationDetail, // '/mock/monitor/weatherstationDetail'
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

function *getNormalDeviceData(action){ // 请求单设备汇流箱，逆变器，箱变-除气象站数据信息
  const { payload } = action;
  const {stationCode, deviceTypeCode, deviceCode } = payload;
  try{
    const devicesUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.stationDeviceList}/${stationCode}/${deviceTypeCode}`;
    const detailUrl = `${path.basePaths.APIBasePath}${monitorPath[deviceTypeCode].detail}/${deviceCode}`;
    const pointUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.monitorPointData}/${deviceCode}`
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}/事件告警`

    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [tmpDevices, tmpDetail, tmpPoint, tmpAlarm] = yield all([
      call(axios.get, devicesUrl),
      call(axios.get, detailUrl),
      call(axios.get, pointUrl),
      call(axios.get, alarmUrl),
    ]);
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
      throw tmpDevices.data
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
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}/事件告警`
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

function *getIntegrateData(action) { // 集电线路信息
  const { payload } = action;
  try {
    const { stationCode, deviceTypeCode, deviceCode } = payload;
    const devicesUrl = `${APIBasePath}${monitor.stationDeviceList}/${stationCode}/${deviceTypeCode}`;
    const detailUrl = `${APIBasePath}${monitor.integrateDetail}/${deviceCode}`;
    const alarmUrl = `${APIBasePath}${monitor.deviceAlarmData}/${deviceCode}/事件告警`;
    yield put({ type:deviceAction.MONITOR_DEVICE_FETCH });
    const [ tmpDevices, tmpDetail, tmpAlarm ] = yield all([
      call(axios.get, devicesUrl),
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ])
    if (tmpDevices.data.code === '10000' && tmpDetail.data.code === "10000" && tmpAlarm.data.code === "10000") {
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          devices: tmpDevices.data.data || [],
          deviceDetail: tmpDetail.data.data || {},
          deviceAlarmList: tmpAlarm.data.data || [],
        },
      })
    }
  } catch(error) {
    console.log(error);
  }
}

function *getBoosterData(action) { // 升压站信息
  const { payload } = action;
  try {
    const { stationCode, deviceCode } = payload;
    const devicesUrl = `${APIBasePath}${monitor.getBoosterstation}${stationCode}`;
    const detailUrl = `${APIBasePath}${monitor.boosterDetail}/${deviceCode}`;
    const alarmUrl = `${APIBasePath}${monitor.deviceAlarmData}/${deviceCode}/事件告警`
    yield put({ type: deviceAction.MONITOR_DEVICE_FETCH });
    const [ tmpDevices, tmpDetail, tmpAlarm ] = yield all([
      call(axios.get, devicesUrl),
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ])
    if (tmpDevices.data.code === '10000' && tmpDetail.data.code === "10000" && tmpAlarm.data.code === "10000") {
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          devices: tmpDevices.data.data || [],
          deviceDetail: tmpDetail.data.data || {},
          deviceAlarmList: tmpAlarm.data.data || [],
        },
      })
    }
  } catch(error) {
    console.log(error);
  }
}

function *getwindturbineData(action){ // 获取风机实时数据 (由于暂时还需要保持之前的地址，不要删)
  const { payload } = action;
  const {deviceCode,stationCode}=payload;
  try{
    // const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.windturbine}/${deviceCode}`; // 实时数据
    const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.newWindturbine}/${deviceCode}`; // 新的实时数据
    const detailUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.getFanList}/${stationCode}`; // 设备列表
    const pointUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.monitorPointData}/${deviceCode}`; // 测点数据
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}/事件告警` //告警数据
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


function *getSequencechartData(action){ // 获取风机图表数据(新功能中已经没有)
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

function *getScatterpoint(action){ // 单风机散点图
  const { payload } = action;
  const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.scatterpoint}`;
  try{
    yield put({type:deviceAction.MONITOR_DEVICE_FETCH});
    const response = yield call(axios.post, windturbineUrl,payload);
    if(response.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          scatterpoint: response.data.data || {},
        }
      })
    }else{throw response.data}
  }catch(e){
    console.log(e)
    yield put({
      type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload: {
        scatterpoint: {},
      }
    })
  }
}
function *getSequencediagram(action){ // 单风机时序图
  const { payload } = action;
  const { deviceFullCode, startTime,endTime,}=payload;
  const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.sequencediagram}/${deviceFullCode}/${startTime}/${endTime}`;
  try{
    yield put({type:deviceAction.MONITOR_DEVICE_FETCH});
    const response = yield call(axios.get, windturbineUrl,payload);
    if(response.data.code === '10000'){
      yield put({
        type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
        payload: {
          sequencediagram: response.data.data || {},
        }
      })
    }else{throw response.data}
  }catch(e){
    console.log(e)
    yield put({
      type: deviceAction.GET_DEVICE_FETCH_SUCCESS,
      payload: {
        sequencediagram: {},
      }
    })
  }
}

function *getWindDeviceCharts(action){ // 单风机散点图  单风机时序图
  yield fork(getScatterpoint,action);
  yield fork(getSequencediagram,action);
  yield delay(3600000); // 阻塞1小时
  realChartsInterval = yield fork(getWindDeviceCharts, action);
}

function *getWindDeviceRealData(action){ // 单风机散点图  单风机时序图
  const {waiting}=action;
  if(waiting){
    yield delay(10000); // 阻塞10秒
  }
  yield fork(getwindturbineData,action);
  WindDeviceRealData = yield fork(getWindDeviceRealData,{...action, waiting: true} );
}

function *stopWindDeviceCharts(action){ // 停止进程
  const { payload } = action;
  if (realChartsInterval) {
    yield cancel(realChartsInterval);
  }
  if(payload==='tenSecond' && WindDeviceRealData){
    yield cancel(WindDeviceRealData);
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
  yield takeLatest(deviceAction.getIntegrateData, getIntegrateData);
  yield takeLatest(deviceAction.getBoosterData, getBoosterData);
  yield takeLatest(deviceAction.RESET_DEVICE_MONITOR_STORE,resetDeviceStore);
  yield takeLatest(deviceAction.getWindDeviceCharts,getWindDeviceCharts);
  yield takeLatest(deviceAction.stopWindDeviceCharts,stopWindDeviceCharts);
  yield takeLatest(deviceAction.getWindDeviceRealData,getWindDeviceRealData);
}


