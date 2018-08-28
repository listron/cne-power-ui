import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';

//改变单电站实时数据store
function *changeSingleStationStore(action){
  const { payload } = action;
  yield put({
    type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
    payload,
  })
}

//获取单电站实时数据
function *getSingleStation(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/station/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getSingleStation + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        singleStationData: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

//获取出力图数据
function *getCapabilityDiagram(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/capabilitydiagram/360/24';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getCapabilityDiagram + payload.stationCode+ '/' + payload.startTime+ '/' + payload.endTime;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        capabilityData: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

//获取理论发电量 实际发电量数据
function *getMonitorPower(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/power/'+ payload.stationCode+ '/' + payload.intervalTime;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getMonitorPower + payload.stationCode+ '/' + payload.startTime+ '/' + payload.endTime+ '/' + payload.intervalTime;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        powerData: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取电站列表
function *getStationList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/station/datalist/';
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getStationList;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        stationList: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}

// 获取单电站运维人员列表
function *getOperatorList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/station/user/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getOperatorList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        operatorList: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取单电站未来天气数据
function *getWeatherList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/weather/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getWeatherList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    if(response.data.code==='10000'){
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          ...payload,
          weatherList: response.data.data,
        }
      })
    }else{
      yield put({ type: singleStationAction.GET_SINGLE_STATION_FAIL});
    }
    
  }catch(e){
    console.log(e);
  }
}
// 获取单电站活动告警数统计
function *getAlarmList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/alarm/station/alarmNum/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getAlarmList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        alarmList: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取单电站工单数统计
function *getWorkList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/worklist/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getWorkList + payload.stationCode + '/' + payload.startTime + '/' + payload.endTime;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        workList: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取单电站设备类型流程图(设备示意图)
function *getDeviceTypeFlow(action){
  const { payload } = action;
  // const url = '/mock/api/v3/station/devicetypeflow/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getDeviceTypeFlow + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        deviceTypeFlow: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取光伏组件列表
function *getPvmoduleList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/pvmodule/datalist/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getPvmoduleList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    yield put({
      type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
      payload: {
        ...payload,
        pvmoduleList: response.data.data,
      }
    })
  }catch(e){
    console.log(e);
  }
}
// 获取逆变器实时数据列表
function *getInverterList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/pvmodule/datalist/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getInverterList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    if(response.data.code === '10000'){
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          ...payload,
          inverterList: response.data.data,
        }
      })
    }else{
      yield put({ type: singleStationAction.GET_SINGLE_STATION_FAIL});
    }
    
  }catch(e){
    console.log(e);
  }
}
// 获取箱变列表
function *getBoxTransformerList(action){
  const { payload } = action;
  // const url = '/mock/api/v3/monitor/pvmodule/datalist/'+ payload.stationCode;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getBoxTransformerList + payload.stationCode;
  try{
    yield put({type: singleStationAction.SINGLE_STATION_FETCH});
    const response = yield call(axios.get, url, payload);
    if(response.data.code === '10000'){
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          ...payload,
          boxTransformerList: response.data.data,
        }
      })
    }else{
      yield put({ type: singleStationAction.GET_SINGLE_STATION_FAIL});
    }
    
  }catch(e){
    console.log(e);
  }
}
export function* watchSingleStationMonitor() {
  yield takeLatest(singleStationAction.GET_SINGLE_STATION_SAGA, getSingleStation);
  yield takeLatest(singleStationAction.CHANGE_SINGLE_STATION_STORE_SAGA, changeSingleStationStore);
  yield takeLatest(singleStationAction.GET_STATION_LIST_SAGA, getStationList);
  yield takeLatest(singleStationAction.GET_CAPABILITY_DIAGRAM_SAGA, getCapabilityDiagram);
  yield takeLatest(singleStationAction.GET_MONITOR_POWER_SAGA, getMonitorPower);
  yield takeLatest(singleStationAction.GET_OPERATOR_LIST_SAGA, getOperatorList);
  yield takeLatest(singleStationAction.GET_WEATHER_LIST_SAGA, getWeatherList);
  yield takeLatest(singleStationAction.GET_ALARM_LIST_SAGA, getAlarmList);
  yield takeLatest(singleStationAction.GET_WORK_LIST_SAGA, getWorkList);
  yield takeLatest(singleStationAction.GET_DEVICE_TYPE_FLOW_SAGA, getDeviceTypeFlow);
  yield takeLatest(singleStationAction.GET_PVMODULE_LIST_SAGA, getPvmoduleList);
  yield takeLatest(singleStationAction.GET_INVERTER_LIST_SAGA, getInverterList);
  yield takeLatest(singleStationAction.GET_BOXTRANSFORMER_LIST_SAGA, getBoxTransformerList);
  
}

