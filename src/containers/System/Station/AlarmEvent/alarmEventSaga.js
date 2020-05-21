import { call, put, takeLatest, select, fork } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { alarmEventAction } from './alarmEventReducer';

const { APIBasePath } = Path.basePaths;
const { system } = Path.APISubPaths;

function* getDiagVersion(action) { // 获取设备型号列表及版本
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getVersionPath}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          ...payload,
          diagConfigData: response.data.data,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        diagConfigData: [],
      },
    });
  }

}

function* editVersion(action) { // 新增版本信息  更新版本信息
  const { payload } = action;
  const { func, type, extraInfo, ...rest } = payload;
  const { deviceTypeCode, manufactorCode, deviceModeCode, diagModeVersionId } = extraInfo;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addVersionPath}`;
  const requestType = type === 'edit' && axios.put || axios.post;
  try {
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        editVersionLoading: true,
      },
    });
    const response = yield call(requestType, url, rest);
    if (response.data.code === '10000') {
      const oldDeviceTypeCode = yield select(state => state.system.alarmEventReducer.get('deviceTypeCode'));
      const oldExpandedKeys = yield select(state => state.system.alarmEventReducer.get('expandedKeys'));
      const expandedKeys = deviceTypeCode === oldDeviceTypeCode && [...oldExpandedKeys, `${manufactorCode}`, `${manufactorCode}_${deviceModeCode}`] || [`${manufactorCode}`, `${manufactorCode}_${deviceModeCode}`];
      const currentDiagModeVersionId = type === 'edit' ? diagModeVersionId : response.data.data.diagModeVersionId;
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          editVersionLoading: false,
          selectedNodesKey: `${manufactorCode}_${deviceModeCode}_${currentDiagModeVersionId}`,
          expandedKeys: expandedKeys,
          deviceTypeCode,
        },
      });
      func(false);
      yield put({ // 2020-04-27 更新该版本的告警事件与对应的事件级别信息
        type: alarmEventAction.getAlarmEvent,
        payload: { deviceTypeCode, diagModeVersionId: currentDiagModeVersionId },
      });
      yield put({
        type: alarmEventAction.getDiagVersion,
      });
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId: currentDiagModeVersionId },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        editVersionLoading: false,
      },
    });
    message.warn(e.message);
  }
}

function* delVersion(action) { // 删除版本信息
  const { payload } = action;
  const { func, ...rest } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.delVersionPath}`;
  try {
    const response = yield call(axios.delete, url, { data: rest });
    if (response.data.code === '10000') {
      message.success('删除成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));
      const currentDiagModeVersionId = rest.diagModeVersionIds[0] || '';
      yield put({
        type: alarmEventAction.getDiagVersion,
      });
      if (diagModeVersionId === currentDiagModeVersionId) {
        yield put({
          type: alarmEventAction.changeStore,
          payload: {
            selectedNodesKey: null,
          },
        });
      }
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    // message.error(e.message, 1);
    func();
  }
}

function* getVersionEvent(action) { // 获取型号制定版本的告警事件列表 versionEventLoading
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getVersionListPath}`;
  try {
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        ...payload,
        versionEventLoading: true,
      },
    });
    if (payload.diagModeVersionId) {
      const response = yield call(axios.get, url, { params: payload });
      if (response.data.code === '10000') {
        const { stations = [], events = [] } = response.data.data;
        yield put({
          type: alarmEventAction.changeStore,
          payload: {
            versionStationCodes: stations,
            versionList: events,
            versionEventLoading: false,
            stationCode: stations.length > 0 && stations[0].stationCode || null,
            versionError: false,
          },
        });
      } else { throw response.data; }
    }

    if (!payload.diagModeVersionId) {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          versionStationCodes: [],
          versionList: [],
          versionEventLoading: false,
          versionError: false,
        },
      });
    }
  } catch (e) {
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        versionStationCodes: [],
        versionList: [],
        versionEventLoading: false,
        versionError: true,
      },
    });
  }
}

function* getEditVersionStation(action) { // 获取编辑型号制定版本的告警事件列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getVersionListPath}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          editVersionStationCodes: response.data.data.stations,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        versionStationCodes: [],
      },
    });
  }
}

function* addVersionEvent(action) { // 添加告警事件
  const { payload } = action;
  const { func, ...rest } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.versionEvent}`;
  try {
    const response = yield call(axios.post, url, rest);
    if (response.data.code === '10000') {
      message.success('添加成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));
      const deviceTypeCode = yield select(state => state.system.alarmEventReducer.get('deviceTypeCode'));
      yield put({ // 更新重载 选中版本下告警与级别的关联关系
        type: alarmEventAction.getAlarmEvent,
        payload: { diagModeVersionId, deviceTypeCode },
      });
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId },
      });
      // const { payload } = action; // { eventType: 1,  deviceTypeCode: 206, diagModeVersionId: '516203177511424' }
      func();
    } else { throw response.data; }
  } catch (e) {
    message.error(e.message);
    console.log(e);
  }
}

function* editVersionEvent(action) { // 编辑告警事件
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.versionEvent}`;
  const { func, ...rest } = payload;
  try {
    const response = yield call(axios.put, url, rest);
    if (response.data.code === '10000') {
      message.success('编辑成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));
      const deviceTypeCode = yield select(state => state.system.alarmEventReducer.get('deviceTypeCode'));
      func();
      yield put({ // 更新重载 选中版本下告警与级别的关联关系
        type: alarmEventAction.getAlarmEvent,
        payload: { diagModeVersionId, deviceTypeCode },
      });
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId },
      });
    } else { throw response.data; }
  } catch (e) {
    const rule = {
      90003: '该条规则存在告警，不可编辑',
      90004: '该条规则存在告警，不可编辑',
    };
    message.warn(rule[e.code]);
    console.log(e);
  }
}

function* delVersionEvent(action) { // 删除告警事件
  const { payload } = action;
  const { diagModeEventIds, suceessfunc, errorfunc } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.versionEvent}`;
  try {
    const response = yield call(axios.delete, url, { data: { diagModeEventIds } });
    if (response.data.code === '10000') {
      message.success('删除成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));

      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId },
      });
      suceessfunc();
    } else { throw response.data; }
  } catch (e) {
    message.error(e.message);
    console.log(e);
    errorfunc();
  }
}

function* getAlarmEvent(action) { // 获取标准告警事件类型
  const { payload } = action; // { eventType: 1,  deviceTypeCode: 206, diagModeVersionId: '516203177511424' }
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getEventType}`;
  try {
    const response = yield call(axios.get, url, { params: {
      eventType: 1,
      ...payload,
    }});
    if (response.data.code === '10000') {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          alarmEventType: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.getEditVersionStation,
      payload: {
        alarmEventType: [],
      },
    });
  }
}

function* getPointList(action) { // 获取测点数据
  const { payload } = action;
  // const url = '/mock/system/pointManage/pointsList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPointList}`;
  try {
    yield put({ type: alarmEventAction.changeStore });
    const response = yield call(axios.post, url, {
      ...payload,
      orderField: payload.orderField.replace(/[A-Z]/g, e => `_${e.toLowerCase()}`), //重组字符串
      includeWarning: 1,
    });
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        pointList: response.data.data.dataList || [],
        pointListError: false,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        pointList: [],
        pointListError: true,
      },
    });
  }
}

function* getVersionStation(action) { // 获取型号制定版本的应用电站
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getVersionListPath}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      const { stations = [] } = response.data.data;
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          applyStations: stations,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        applyStations: [],
      },
    });
  }
}

function* filterConditionStations(action) { // 获取筛选条件的电站数据
  // deviceTypeCode deviceModeCode
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}`;
  const { payload } = action;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          filterStations: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        filterStations: [],
      },
    });
  }
}

function* getEventDetail(action) { //获取标准告警事件详情
  const { payload } = action;
  try {
    const {pointCode, deviceFullcode, diagWarningId} = payload;
    const url = `${APIBasePath}${system.getEventDetail}/${diagWarningId}`;
    //console.log(url);
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      // console.log(response.data.data);
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          alarmEventDetial: response.data.data || {},
        },
      });
    }
    else {
      throw response.message;
      //testcode. after delete.
      // yield put({
      //   type: alarmEventAction.changeStore,
      //   payload: {
      //     alarmEventDetial: {
      //       diagModeVersionId: '1010006',//'496338816196096',
      //       diagModeEventId: '1010006009',//'496339113991680',
      //     },
      //   },
      // });
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        alarmEventDetial: {},
      },
    });
  }
}

function* alarmEventDetialFlow(action) { //获取详细信息的一系列处理过程
  const { payload } = action;
  try {
    const {pointCode, deviceFullcode, deviceTypeCode, stationCode, diagWarningId} = payload;
    //1.获取事件详情
    yield call(getEventDetail, {
      payload: {
        // pointCode,
        // deviceFullcode,
        diagWarningId,
      },
    });
    //2.获取版本信息
    yield call(getDiagVersion, {payload: {}});
    const alarmEventDetial = yield select(state => state.system.alarmEventReducer.get('alarmEventDetial'));
    let diagConfigData = yield select(state => state.system.alarmEventReducer.get('diagConfigData'));
    if (diagConfigData) {
      diagConfigData = diagConfigData.toJS();
    }
    const verid = alarmEventDetial.get('diagModeVersionId');
    yield put({ // 2020-04-27 更新该版本的告警事件与对应的事件级别信息
      type: alarmEventAction.getAlarmEvent,
      payload: { deviceTypeCode, diagModeVersionId: verid },
    });
    //3.找出事件对应版本号的设备和厂商信息
    let devInfo = null, over = false;
    if (verid && deviceTypeCode && diagConfigData) {
      for (let element of diagConfigData) {
        if (over) break;
        if (deviceTypeCode === element.deviceTypeCode) {
          const {manufactors} = element;
          for (let manufactorEle of manufactors) {
            if (over) break;
            const {deviceModes} = manufactorEle;
            for (let dmEle of deviceModes) {
              if (over) break;
              const {versions} = dmEle;
              for (let verEle of versions) {
                if (verEle.diagModeVersionId == verid) {
                  devInfo = {
                    deviceModeCode : dmEle.deviceModeCode,
                    manufactorCode : manufactorEle.manufactorCode,
                  }
                  over = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    if (devInfo) { //4.修改props的状态
      const {deviceModeCode, manufactorCode} = devInfo;
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          deviceTypeCode,
          stationCode,
          diagModeVersionId: verid,
          deviceModeCode: deviceModeCode,
          manufactorCode: manufactorCode,
          selectedNodesKey: `${manufactorCode}_${deviceModeCode}_${verid}`,
          expandedKeys:[`${manufactorCode}`, `${manufactorCode}_${deviceModeCode}`],
        },
      });

      //5.获取版本事件列表
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: {
          diagModeVersionId: verid,
        }
      });
    }
  }
  catch (error) {
    console.log(error);
  }

}

export function* watchAlarmEvent() {
  yield takeLatest(alarmEventAction.getDiagVersion, getDiagVersion);
  yield takeLatest(alarmEventAction.editVersion, editVersion);
  yield takeLatest(alarmEventAction.delVersion, delVersion);
  yield takeLatest(alarmEventAction.getVersionEvent, getVersionEvent);
  yield takeLatest(alarmEventAction.getEditVersionStation, getEditVersionStation);
  yield takeLatest(alarmEventAction.addVersionEvent, addVersionEvent);
  yield takeLatest(alarmEventAction.editVersionEvent, editVersionEvent);
  yield takeLatest(alarmEventAction.delVersionEvent, delVersionEvent);
  yield takeLatest(alarmEventAction.getAlarmEvent, getAlarmEvent);
  yield takeLatest(alarmEventAction.getPointList, getPointList);
  yield takeLatest(alarmEventAction.getVersionStation, getVersionStation);
  yield takeLatest(alarmEventAction.filterConditionStations, filterConditionStations);
  yield takeLatest(alarmEventAction.getEventDetail, getEventDetail);
  yield takeLatest(alarmEventAction.alarmEventDetialFlow, alarmEventDetialFlow);
}
