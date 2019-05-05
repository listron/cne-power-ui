import { call, put, takeLatest, fork, cancel, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import Path from '../../../../constants/path';
import { singleStationAction } from './singleStationAction';
import { message } from 'antd';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;
import moment from 'moment';
message.config({ top: 120, duration: 2, maxCount: 2 });

function* getSingleStation(action) { //获取单电站实时数据
  const { payload } = action;
  const { stationCode, stationType } = payload;
  const utcTime = moment.utc().format();
  const pvUrl = `${APIBasePath}${monitor.getSingleStation}${stationCode}/${utcTime}`;
  const windUrl = `${APIBasePath}${monitor.getSingleWindleStation}${stationCode}/${utcTime}`;
  const url = stationType === '0' ? windUrl : pvUrl;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          singleStationData: response.data.data || {},
          stationType: response.data.data.stationType || '',
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        singleStationData: {},
      }
    });
  }
}

function* getCapabilityDiagram(action) { // 获取出力图数据
  const { payload } = action;
  const { stationCode, stationType, startTime, endTime } = payload
  const pvUrl = `${APIBasePath}${monitor.getCapabilityDiagram}${stationCode}/${stationType}/${startTime}/${endTime}`
  const windUrl = `${APIBasePath}${monitor.getWindCapability}/${startTime}/${endTime}/${stationCode}`;
  const url = stationType === '0' ? windUrl : pvUrl;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          capabilityData: response.data.data || [],
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        capabilityData: [],
      }
    });
  }
}

function* getMonitorPower(action) { // 获取理论发电量 实际发电量数据
  const { payload } = action;
  const { stationCode, startTime, endTime, intervalTime,stationType } = payload;
  const pvUrl = `${APIBasePath}${monitor.getMonitorPower}${stationCode}/${startTime}/${endTime}/${intervalTime}`;
  const windUrl = `${APIBasePath}${monitor.getWindMonitorPower}/${intervalTime}/${startTime}/${endTime}/${stationCode}`;
  const url = stationType === '0' ? windUrl : pvUrl;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          powerData: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        powerData: [],
      }
    });
  }
}

function* getOperatorList(action) { // 获取单电站运维人员列表
  const { payload } = action;
  const { stationCode, roleId } = payload;
  const url = `${APIBasePath}${monitor.getOperatorList}${stationCode}/${roleId}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.changeSingleStationStore,
        payload: {
          operatorList: response.data.data || [],
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        operatorList: [],
      }
    });
  }
}

function* getWeatherList(action) { // 获取单电站未来天气数据
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getWeatherList}?stationCode=${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.changeSingleStationStore,
        payload: {
          weatherList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        weatherList: [],
      }
    });
  }
}

function* getAlarmList(action) { // 获取单电站活动告警数统计
  const { payload } = action;
  const { stationCode } = payload;
  const url = `${APIBasePath}${monitor.getAlarmList}${stationCode}/事件告警`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.changeSingleStationStore,
        payload: {
          alarmList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        alarmList: {},
      }
    });
  }
}

function* getWorkList(action) { // 获取单电站工单数统计
  const { payload } = action;
  const { stationCode, startTime, endTime } = payload;
  const url = `${APIBasePath}${monitor.getWorkList}${stationCode}/${startTime}/${endTime}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          workList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        workList: {},
      }
    });
  }
}

function* getDeviceTypeFlow(action) { // 获取单电站设备类型流程图(设备示意图)
  const { payload } = action;
  const { stationCode } = payload;
  const url = `${APIBasePath}${monitor.getDeviceTypeFlow}${stationCode}`;
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
        })
      );
      deviceTypeCode = inverterResult[0];
    }
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          deviceTypeFlow: response.data.data || {},
          deviceTypeCode,
        }
      })
    } else { throw 'error' }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        deviceTypeFlow: {},
      }
    });
  }
}

function* getPvmoduleList(action) { // 获取光伏组件列表
  const { payload } = action;
  const { stationCode, firstLoad } = payload;
  const url = `${APIBasePath}${monitor.getPvmoduleList}${stationCode}`;
  try {
    if (firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          pvmoduleList: response.data.data.dataList || [],
          pvAvgValue: response.data.data.pvAvgValue || '',
          pvLevelNums: response.data.data.pvLevelNums || {}
        }
      });
    } else { throw 'error' }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        pvmoduleList: [],
        pvAvgValue: '',
        pvLevelNums: {}
      }
    });
  }
}

function* getInverterList(action) { // 获取逆变器实时数据列表(光伏)
  const { payload } = action;
  const { stationCode, deviceTypeCode } = payload;
  const url = `${APIBasePath}${monitor.getInverterList}${stationCode}/${deviceTypeCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          inverterList: response.data.data || {},
        }
      })
    } else { throw 'error' }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        inverterList: {},
      }
    });
  }
}

function* getBoxTransformerList(action) { // 获取箱变列表(光伏)
  const { payload } = action;
  const { stationCode } = payload;
  const url = `${APIBasePath}${monitor.getBoxTransformerList}${stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          boxTransformerList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        boxTransformerList: {},
      }
    });
  }
}

function* getConfluenceBoxList(action) { // 获取汇流箱列表(光伏)
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getConfluenceBoxList}${payload.stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          confluenceBoxList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        confluenceBoxList: {},
      }
    });
  }
}

function* getCollectorLine(action) { // 获取集电线路列表(共有)
  const { payload } = action;
  const { stationCode, firstLoad } = payload;
  try {
    const url = `${APIBasePath}${monitor.getCollectorLine}${stationCode}`;
    // const url = '/mock/api/v3/monitor/collectorline/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          collectorList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        collectorList: [],
      }
    })
  }
}

function* getBoosterstation(action) { // 获取升压站列表(共有)
  const { payload } = action;
  try {
    const { stationCode, firstLoad } = payload;
    const url = `${APIBasePath}${monitor.getBoosterstation}${stationCode}`;
    // const url = '/mock/api/v3/monitor/boosterstation/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          boosterList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        boosterList: [],
      }
    })
  }
}

function* getPowerNet(action) { // 获取电网列表(共有)
  const { payload } = action;
  const { stationCode, firstLoad } = payload;
  try {
    const url = `${APIBasePath}${monitor.getPowerNet}${stationCode}`;
    // const url = '/mock/api/v3/monitor/powercollection/datalist';
    if (firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          powerNetList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        powerNetList: [],
      }
    })
  }
}

function* getStationDeviceList(action) { // 获取单电站设备列表
  const { payload } = action;
  const { stationCode, deviceTypeCode } = payload;
  const url = `${APIBasePath}${monitor.getStationDeviceList}${stationCode}/${deviceTypeCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          stationDeviceList: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        stationDeviceList: [],
      }
    });
  }
}

function* editData(action) { // 编辑月，年的累计发电量
  const { payload } = action;
  const url = `${APIBasePath}${monitor.editData}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") {
      message.success('数据编辑成功，请稍等', 2);
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          editAllData: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    message.warn('数据编辑失败', 2);
    console.log(e);
  }

}

function* getFanList(action) { // 获取风机实时数据列表
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getFanList}/${payload.stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          fanList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        fanList: {},
      }
    })
  }
}

function* getSingleScatter(action) {
  const { payload } = action;
  const { stationCode } = payload;
  const localDate = moment().format('YYYY-MM-DD');
  const url = `${APIBasePath}${monitor.getSingleWindScatter}/${stationCode}/${localDate}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          singleStationScatter: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        singleStationScatter: [],
      }
    })
  }
}

function* pointparams() { // 单电站测点参数名称列表
  const url = `${APIBasePath}${monitor.getPointparams}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.changeSingleStationStore,
        payload: {
          pointparams: response.data.data || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.changeSingleStationStore,
      payload: {
        pointparams: [],
      }
    })
  }
}

function* getNewFanList(action) {
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getNewFanList}/${payload.stationCode}`;
  try {
    if (payload.firstLoad) {
      yield put({ type: singleStationAction.singleStationFetch });
    }
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: singleStationAction.getSingleStationSuccess,
        payload: {
          fanList: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: singleStationAction.getSingleStationSuccess,
      payload: {
        fanList: {},
      }
    })
  }
}



export function* watchSingleStationMonitor() {
  yield takeLatest(singleStationAction.GET_SINGLE_STATION_SAGA, getSingleStation);
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
  yield takeLatest(singleStationAction.getSingleScatter, getSingleScatter); // 获取电网信息列表
  yield takeLatest(singleStationAction.pointparams, pointparams); // 单电站测点参数名称列表 风机
  yield takeLatest(singleStationAction.getNewFanList, getNewFanList); // 单电站测点参数名称列表 风机

}

