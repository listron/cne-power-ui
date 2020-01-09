import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { alarmEventAction } from './alarmEventReducer';
import moment from 'moment';



function* getDiagVersion(action) { // 获取设备型号列表及版本
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getVersionPath}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
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
  const { func, type, ...rest } = payload;
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
      yield put({
        type: alarmEventAction.changeStore,
        payload: {
          editVersionLoading: false,
        },
      });
      func(false);
      const deviceTypeCode = yield select(state => state.system.alarmEventReducer.get('deviceTypeCode'));
      yield put({
        type: alarmEventAction.getDiagVersion,
        payload: { deviceTypeCode },
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
      const deviceTypeCode = yield select(state => state.system.alarmEventReducer.get('deviceTypeCode'));
      yield put({
        type: alarmEventAction.getDiagVersion,
        payload: { deviceTypeCode },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    message.error('删除失败');
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
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        versionStationCodes: [],
        versionList: [],
        versionEventLoading: false,
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
  console.log('payload', payload, func);
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.versionEvent}`;
  try {
    const response = yield call(axios.post, url, rest);
    if (response.data.code === '10000') {
      message.success('添加成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId },
      });
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
  console.log('rest', rest);
  try {
    const response = yield call(axios.put, url, rest);
    if (response.data.code === '10000') {
      message.success('编辑成功');
      const diagModeVersionId = yield select(state => state.system.alarmEventReducer.get('diagModeVersionId'));
      func();
      yield put({
        type: alarmEventAction.getVersionEvent,
        payload: { diagModeVersionId },
      });
    } else { throw response.data; }
  } catch (e) {
    message.error('编辑失败,请重试');
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
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getEventType}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
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
    });
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        pointList: response.data.data.dataList || [],

      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        pointList: [],
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
          applayStations: stations,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: alarmEventAction.changeStore,
      payload: {
        applayStations: [],
      },
    });
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
}
