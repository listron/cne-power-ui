import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { singleStationAction } from './singleStationAction';
import { message } from 'antd';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;
import moment from 'moment';

// 改变单电站实时数据store
function* changeSingleStationStore(action) {
  const { payload } = action;
  yield put({
    type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
    payload,
  })
}
// 重置store状态
function* resetSingleStationStore(action) {
  yield put({
    type: singleStationAction.RESET_SINGLE_STATION_SUCCESS,
  });
}
// 获取单电站实时数据
function* getSingleStation(action) {
  const { payload } = action;
  const utcTime = moment.utc().format();
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getSingleStation + payload.stationCode + '/' + utcTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          singleStationData: response.data.data || {},
          stationType: response.data.data.stationType || null,
        }
      });
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          singleStationData: {},
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
// 获取出力图数据
function* getCapabilityDiagram(action) {
  const { payload } = action;
  const { stationCode, stationType, startTime, endTime } = payload
  // const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getCapabilityDiagram + payload.stationCode+ '/' + payload.startTime+ '/' + payload.endTime;
  const url = `${Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getCapabilityDiagram + stationCode}/${stationType}/${startTime}/${endTime}`
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          capabilityData: response.data.data || [],
        }
      });
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          capabilityData: [],
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取理论发电量 实际发电量数据
function* getMonitorPower(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getMonitorPower + payload.stationCode + '/' + payload.startTime + '/' + payload.endTime + '/' + payload.intervalTime;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          powerData: response.data.data || [],
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          powerData: [],
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取单电站运维人员列表
function* getOperatorList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getOperatorList + payload.stationCode + '/' + payload.roleId;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          operatorList: response.data.data || [],
        }
      });
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          operatorList: [],
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取单电站未来天气数据
function* getWeatherList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getWeatherList}?stationCode=${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          weatherList: response.data.data || [],
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          weatherList: [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
// 获取单电站活动告警数统计
function* getAlarmList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getAlarmList + payload.stationCode + '/事件告警';
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          alarmList: response.data.data || {},
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          alarmList: {},
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取单电站工单数统计
function* getWorkList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getWorkList + payload.stationCode + '/' + payload.startTime + '/' + payload.endTime;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          workList: response.data.data || {},
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          workList: {},
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
// 获取单电站设备类型流程图(设备示意图)
function* getDeviceTypeFlow(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getDeviceTypeFlow + payload.stationCode;
  try {
    const response = yield call(axios.get, url, payload);
    let deviceTypeCode = 206; // 默认组串式逆变器
    if (payload.deviceTypeCode) {
      deviceTypeCode = payload.deviceTypeCode;
    } else {
      const defaulDeviceType = [201, 206, 101]; // 默认组串式逆变器 / 集中逆变器/ 风电机组
      const inverterResult = defaulDeviceType.filter(e => response.data.data.deviceFlowTypes.find(
        item => {
          const tmpDeviceType = item.deviceTypes || [];
          const tmpTypeInfo = tmpDeviceType[0] || {};
          return tmpTypeInfo.deviceTypeCode === e;
          // if (item.deviceTypes.length > 1) { // 拜托把没用逻辑省省····
          //   return item.deviceTypes.map(itemI => {
          //     return itemI.deviceTypeCode === e;
          //   })
          // } else {
          //   return item.deviceTypes[0].deviceTypeCode === e
          // }
        })
      );
      deviceTypeCode = inverterResult[0];
    }
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          deviceTypeFlow: response.data.data || {},
          deviceTypeCode,
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          deviceTypeFlow: {},
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取光伏组件列表
function* getPvmoduleList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getPvmoduleList + payload.stationCode;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          pvmoduleList: response.data.data.dataList || [],
          pvAvgValue: response.data.data.pvAvgValue || '',
          pvLevelNums: response.data.data.pvLevelNums || {}
        }
      });
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          pvmoduleList: [],
          pvAvgValue: '',
          pvLevelNums: {}
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取逆变器实时数据列表
function* getInverterList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getInverterList}${payload.stationCode}/${payload.deviceTypeCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          inverterList: response.data.data || {},
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          inverterList: {},
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
}
// 获取箱变列表
function* getBoxTransformerList(action) {
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.monitor.getBoxTransformerList + payload.stationCode;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          boxTransformerList: response.data.data || {},
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          boxTransformerList: {},
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getConfluenceBoxList(action) { // 获取汇流箱列表
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getConfluenceBoxList}${payload.stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          confluenceBoxList: response.data.data || {},
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          confluenceBoxList: {},
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getCollectorLine(action) { // 获取集电线路列表
  const { payload } = action;
  try {
    const { stationCode, firstLoad } = payload;
    const url = `${APIBasePath}${monitor.getCollectorLine}${stationCode}`;
    // const url = '/mock/api/v3/monitor/collectorline/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          collectorList: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

function* getBoosterstation(action) { // 获取升压站列表
  const { payload } = action;
  try {
    const { stationCode, firstLoad } = payload;
    const url = `${APIBasePath}${monitor.getBoosterstation}${stationCode}`;
    // const url = '/mock/api/v3/monitor/boosterstation/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          boosterList: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

function* getPowerNet(action) { // 获取电网列表
  const { payload } = action;
  try {
    const { stationCode, firstLoad } = payload;
    const url = `${APIBasePath}${monitor.getPowerNet}${stationCode}`;
    // const url = '/mock/api/v3/monitor/powercollection/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          powerNetList: response.data.data || [],
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

// 获取单电站设备列表
function* getStationDeviceList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getStationDeviceList}${payload.stationCode}/${payload.deviceTypeCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          stationDeviceList: response.data.data || [],
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          stationDeviceList: [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}
//编辑月，年的累计发电量
function* editData(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.editData}`;
  try {
    const response = yield call(axios.post, url, payload);
    console.log(response, '编辑');
    if (response.data.code === "10000") {
      message.config({
        top: 120,
        duration: 2,
        maxCount: 3,
      });
      message.success('数据编辑成功，请稍等');
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          editAllData: response.data.data || [],
        }
      })
    } else {
      yield put({
        type: singleStationAction.CHANGE_SINGLE_STATION_STORE,
        payload: {
          editAllData: [],
        }
      });
    }
  } catch (e) {
    console.log(e);
  }

}

// 获取风机实时数据列表
function* getFanList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getFanList}/${payload.stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.SINGLE_STATION_FETCH });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.GET_SINGLE_STATION_SUCCESS,
        payload: {
          fanList: response.data.data || {},
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

function getRealSingleData(){
  
}


export function* watchSingleStationMonitor() {
  yield takeLatest(singleStationAction.GET_SINGLE_STATION_SAGA, getSingleStation);
  yield takeLatest(singleStationAction.CHANGE_SINGLE_STATION_STORE_SAGA, changeSingleStationStore);
  // yield takeLatest(singleStationAction.GET_STATION_LIST_SAGA, getStationList);
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
  yield takeLatest(singleStationAction.GET_STATION_DEVICELIST_SAGA, getStationDeviceList);
  yield takeLatest(singleStationAction.GET_CONFLUENCEBOX_LIST_SAGA, getConfluenceBoxList); // 汇流箱列表获取
  yield takeLatest(singleStationAction.EDIT_MONTH_YEAR_DATA_SAGA, editData);//编辑月，年的累计发电量
  yield takeLatest(singleStationAction.getCollectorLine, getCollectorLine); // 获取集电线路列表信息
  yield takeLatest(singleStationAction.getFanList, getFanList);//风机实时数据列表
  yield takeLatest(singleStationAction.getBoosterstation, getBoosterstation); // 升压站列表信息
  yield takeLatest(singleStationAction.getPowerNet, getPowerNet); // 获取电网信息列表
  yield takeLatest(singleStationAction.RESET_SINGLE_STATION_STORE, resetSingleStationStore);
}

