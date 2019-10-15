import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from '@utils/request';
import { message } from 'antd';
import moment from 'moment';
import path from '@path';
import { overviewAction } from './overviewReducer';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

function* easyPut(actionName, payload){
  yield put({
    type: overviewAction[actionName],
    payload,
  });
}

function *getOverviewStation({ payload }){ // 电站基础数据信息 - 各页面单独存储一份
  try {
    const { stationCode, pageKey } = payload || {};
    const url = `${APIBasePath}${monitor.getOverviewStation}/${stationCode}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        [`${pageKey}TopData`]: response.data || {}, // 根据不同页面，生成: stationTopData, deviceTopData, pointTopData
        [`${pageKey}Unix`]: moment().unix(),
      });
    } else { throw response; }
  } catch (error) {
    console.log(error);
    message.error('获取电站基础信息失败, 请刷新重试');
  }
}

function *getOverviewDates({ payload }){ // 电站各日完整率
  try {
    yield call(easyPut, 'changeStore', {
      stationLoading: true,
    });
    const { stationCode, deviceTypeCode, month } = payload;
    const url = `${APIBasePath}${monitor.getOverviewDates}/${stationCode}/${deviceTypeCode}/${month}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        stationDatesRate: response.data || [],
        stationLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    console.log(error);
    yield call(easyPut, 'changeStore', {
      stationDatesRate: [],
    });
  }
}

function *getPointInfo(action) { // 获取可选测点
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const { params, actionName, resultName } = payload;
    const response = yield call(request.post, url, {
      ...params,
      devicePointTypes: ['YM', 'YC'],
    });
    if (response.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data || [],
        },
      });
    } else {
      throw response;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *afterDeviceTypePointGet({ payload }) { // 设备页 获得测点数据后触发
  const { devicePointsList = [] } = payload || {};
  const { deviceParam = {} } = yield select(state => state.monitor.overview.toJS());
  const pointCodes = [];
  const tmpList = [];
  // devicePointCode: "CV004"
  // devicePointId: "449129"
  // devicePointIecCode: "WCNV"
  // devicePointIecName: "变频器"
  // devicePointName: "网侧线电压Uab"
  // devicePointUnit: "V"
  // isChecked: "1"
  const pointsMap = new Map();
  devicePointsList.forEach(e => {
    const { devicePointCode, devicePointName, devicePointUnit, devicePointIecName } = e;
    pointCodes.push(devicePointCode); // 默认全选
    if (pointsMap.has(devicePointIecName)) {
      const prePoints = pointsMap.get(devicePointIecName);
      pointsMap.set(devicePointIecName, [...prePoints, {
        value: devicePointCode,
        label: devicePointName,
        unit: devicePointUnit,
      }]);
    } else {
      pointsMap.set(devicePointIecName, [{
        value: devicePointCode,
        label: devicePointName,
        unit: devicePointUnit,
      }]);
    }
  });
  for(const [devicePointIecName, children] of pointsMap){
    devicePointIecName ? tmpList.push({ // devicePointIecName可能为null
      value: devicePointIecName,
      label: devicePointIecName,
      children,
    }) : tmpList.push(...children);
  }
  // devicePointsList.forEach(e => {
  //   const { devicePointCode, devicePointName, devicePointUnit } = e;
  //   pointCodes.push(devicePointCode);
  //   tmpList.push({
  //     value: devicePointCode,
  //     label: devicePointName,
  //     unit: devicePointUnit,
  //   });
  // });
  yield call(easyPut, 'fetchSuccess', { // 默认选中所有测点
    deviceCheckedList: pointCodes,
    devicePointsList: tmpList,
  });
  yield call(getOverviewDevices, { // 默认所有测点请求设备数据
    payload: { ...deviceParam, pointCodes },
  });
}

function *afterPointPagePointsGet({ payload }){ // 测点页 获得测点数据后触发
  const { pointPageList = [] } = payload || {};
  const { pointParam = {} } = yield select(state => state.monitor.overview.toJS());
  const { deviceFullcode } = pointParam;
  const pointCodes = [];
  const tmpList = [];
  const pointsMap = new Map();
  pointPageList.forEach(e => {
    const { devicePointCode, devicePointName, devicePointUnit, devicePointIecName } = e;
    pointCodes.push(devicePointCode); // 默认全选
    if (pointsMap.has(devicePointIecName)) {
      const prePoints = pointsMap.get(devicePointIecName);
      pointsMap.set(devicePointIecName, [...prePoints, {
        value: devicePointCode,
        label: devicePointName,
        unit: devicePointUnit,
      }]);
    } else {
      pointsMap.set(devicePointIecName, [{
        value: devicePointCode,
        label: devicePointName,
        unit: devicePointUnit,
      }]);
    }
  });
  for(const [devicePointIecName, children] of pointsMap){
    devicePointIecName ? tmpList.push({ // devicePointIecName可能为null
      value: devicePointIecName,
      label: devicePointIecName,
      children,
    }) : tmpList.push(...children);
  }
  // pointPageList.forEach(e => {
  //   const { devicePointCode, devicePointName, devicePointUnit } = e;
  //   pointCodes.push(devicePointCode);
  //   tmpList.push({
  //     value: devicePointCode,
  //     label: devicePointName,
  //     unit: devicePointUnit,
  //   });
  // });
  yield call(easyPut, 'fetchSuccess', { // 默认选中所有测点
    pointsCheckedList: pointCodes,
    pointList: tmpList,
  });
  deviceFullcode && (yield call(getOverviewPoints, { // 已有选中设备, 再执行请求
    payload: { ...pointParam, pointCodes },
  }));
}

function *getOverviewDevices({ payload }){ // 获取所有设备数据信息
  const url = `${APIBasePath}${monitor.getOverviewDevices}`;
  try {
    yield call(easyPut, 'changeStore', {
      deveiceLoading: true,
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      // const mockData = {
      //   total: 0.1247, // null
      //   deviceData: [12, 13, 14, 15, 16, 17, 18, 23, 22, 45, 88, 90, 91, 92, 93, 71, 73, 72, 74, 75, 78, 63, 62, 64, 65, 68].map(e => ({
      //     deviceFullcode: `M${e}M${e * e}M101`,
      //     deviceName: `mock数据设备${e}`,
      //     completeRate: e * e,
      //     realCount: e * e + e,
      //     key: `M${e}M${e * e}M101`,
      //     pointData: ['TR002', 'TR003', 'TR017'].map(p => ({
      //       pointCode: p,
      //       pointName: p,
      //       validCount: parseInt(e * Math.random() * 100, 10),
      //       invalidCount: parseInt(e * Math.random() * 100, 10),
      //       lostCount: parseInt(e * Math.random() * 100, 10),
      //     })),
      //   })),
      // };
      const { total = 0, deviceData = []} = response.data || {};
      yield call(easyPut, 'fetchSuccess', {
        // devicesData: mockData,
        deveiceLoading: false,
        devicesData: {
          total,
          deviceData: deviceData.map(e => ({
            ...e, key: e.deviceFullcode,
          })).sort((a, b) => (a.deviceSortName) && a.deviceSortName.localeCompare(b.deviceSortName)), // 默认排序
        },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      deveiceLoading: false,
      devicesData: {},
    });
  }
}

function *getOverviewPoints({ payload }){ // 获取各测点详情
  const url = `${APIBasePath}${monitor.getOverviewPoints}`;
  try {
    yield call(easyPut, 'changeStore', {
      pointsLoading: true,
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        pointsData: response.data || [],
        pointsLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      pointsData: [],
      pointsLoading: false,
    });
  }
}

function *getConnectedDevices({ payload }){ // 测点页获取可用的设备列表{ stationCode, deviceTypeCode, isConnected: 1,}
  const url = `${APIBasePath}${monitor.getOverviewConnectedDevices}`;
  try {
    const response = yield call(request.get, url, { params: payload });
    const tmpDevices = response.data || [];
    const pointConnectedDevices = tmpDevices.map(e => ({ // 重组设备结构
      ...e,
      value: e.deviceCode,
      label: e.deviceName,
    }));
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        pointConnectedDevices,
        deviceListUnix: moment().unix(), // 记录得到设备列表时间
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      pointConnectedDevices: [],
    });
  }
}

export function* watchMonitorDataOverview() {
  yield takeLatest(overviewAction.getOverviewStation, getOverviewStation);
  yield takeLatest(overviewAction.getOverviewDates, getOverviewDates);
  yield takeLatest(overviewAction.getOverviewDevices, getOverviewDevices);

  yield takeLatest(overviewAction.getPointInfo, getPointInfo);
  yield takeLatest(overviewAction.afterDeviceTypePointGet, afterDeviceTypePointGet);
  yield takeLatest(overviewAction.afterPointPagePointsGet, afterPointPagePointsGet);

  yield takeLatest(overviewAction.getOverviewPoints, getOverviewPoints);
  yield takeLatest(overviewAction.getConnectedDevices, getConnectedDevices);
}

