import { call, put, takeLatest, all, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import path from '../../../../constants/path';
import { deviceAction } from './deviceMonitorReducer';
import moment from 'moment';
import Path from '@constants/path';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

let pvMonitorInfoTask = null; // 10s数据任务
let pvMonitorChartTask = null; // 图表1h数据任务

let realChartsInterval = null;
let WindDeviceRealData = null;

const monitorPath = { // 详情， 十分钟数据，各设备类型路径不同。
  '202': { // 汇流箱： 202
    detail: monitor.confluenceboxDetail, // '/mock/monitor/confluenceboxDetail'
    tenMin: monitor.confluenceboxTenMin, // '/mock/monitor/confluenceboxTenMin'
    subList: monitor.confluenceboxSubList,
  },
  '206': { // 逆变器（组串）：206
    detail: monitor.seriesinverterDetail, //  '/mock/monitor/seriesinverter'
    tenMin: monitor.seriesinverterTenMin, //  '/mock/monitor/seriesinverterTenMin'
    subList: monitor.inverterSubList,
  },
  '201': { // 逆变器（集中）：201
    detail: monitor.seriesinverterDetail, //  '/mock/monitor/seriesinverter'
    tenMin: monitor.seriesinverterTenMin, //  '/mock/monitor/seriesinverterTenMin'
    subList: monitor.inverterSubList,
  },
  '304': { // 箱变： 304
    detail: monitor.boxtransformerDetail, // '/mock/monitor/boxtransformerDetail'
    tenMin: monitor.boxtransformerTenMin, // '/mock/monitor/boxtransformerTenMin'
    subList: monitor.boxtransformerSubList,
  },
  // '207': {  // 交流汇流箱 - 暂不考虑
  //   detail: monitor.confluenceboxDetail, // '/mock/monitor/confluenceboxDetail'
  //   tenMin: monitor.confluenceboxTenMin, // '/mock/monitor/confluenceboxTenMin'
  // },
  '302': { // 集电线路 302
    detail: monitor.integrateDetail,
    subList: monitor.integrateSubList,
  },
  '301': { // 升压站 301
    detail: monitor.boosterDetail,
    subList: monitor.boosterSubList,
  },
};

function* getDevices({ payload }) { // 单设备同级所有设备信息[]
  const { deviceTypeCode, stationCode } = payload;
  const devicesUrl = `${APIBasePath}${monitor.stationDeviceList}/${stationCode}/${deviceTypeCode}`;
  try {
    const tmpDevices = yield call(axios.get, devicesUrl);
    if (tmpDevices.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { devices: tmpDevices.data.data || [] },
      });
    } else {
      throw tmpDevices.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { devices: [] },
    });
  }
}

function* getDeviceDetail({ deviceTypeCode, deviceCode }) { // 10s实时详情
  const detailUrl = `${APIBasePath}${monitorPath[deviceTypeCode].detail}/${deviceCode}`;
  try {
    const tmpDetail = yield call(axios.get, detailUrl);
    if (tmpDetail.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { deviceDetail: tmpDetail.data.data || {} },
      });
    } else {
      throw tmpDetail.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { deviceDetail: [] },
    });
  }

}

function* getSeriesInverterTenMin({ deviceCode }) {
  const startTime = moment().utc().subtract(720, 'hours').format();
  const endTime = moment().endOf('day').utc().format();
  const tenMinUrl = `${APIBasePath}${monitor.seriesBranchTenMin}/${deviceCode}/${startTime}/${endTime}`;
  try {
    const tmpBranch = yield call(axios.get, tenMinUrl);
    if (tmpBranch.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          branchTenMin: tmpBranch.data.data || {},
          branchTenMinUnix: moment().unix(),
        },
      });
    } else {
      throw tmpBranch.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { branchTenMin: [] },
    });
  }

}

function* getTenMin({ deviceTypeCode, deviceCode, timeParam }) { // 1h实时十分钟数据
  try {
    const tenMinUrl = `${APIBasePath}${monitorPath[deviceTypeCode].tenMin}/${deviceCode}/${timeParam}`;
    // 组串式逆变器需额外请求下方组串10分钟数据
    if (deviceTypeCode === '206') {
      yield fork(getSeriesInverterTenMin, { deviceCode });
    }
    const tmpTenMin = yield call(axios.get, tenMinUrl);
    if (tmpTenMin.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          deviceTenMin: tmpTenMin.data.data || {},
          tenMinUnix: moment().unix(),
          tenMinChartLoading: false,
        },
      });
    } else {
      throw tmpTenMin.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { deviceTenMin: [], tenMinChartLoading: false },
    });
  }
}

function* getDevicePoints({ deviceCode }) { // 10s实时测点信息
  const pointUrl = `${APIBasePath}${monitor.monitorPointData}/${deviceCode}`;
  try {
    const tmpPoint = yield call(axios.get, pointUrl);
    if (tmpPoint.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { devicePointData: tmpPoint.data.data || {} },
      });
    } else {
      throw tmpPoint.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { devicePointData: [] },
    });
  }
}

function* getEvents({ deviceCode }) { // 10s事件信息
  const eventUrl = `${APIBasePath}${monitor.monitorEvents}/${deviceCode}`;
  try {
    const tmpEvents = yield call(axios.get, eventUrl);
    if (tmpEvents.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { deviceEvents: tmpEvents.data.data || {} },
      });
    } else {
      throw tmpEvents.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { deviceEvents: [] },
    });
  }
}

function* getAlarms({ deviceCode }) { // 10s实时告警
  const alarmUrl = `${APIBasePath}${monitor.deviceAlarmData}/${deviceCode}/事件告警`;
  try {
    const tmpAlarm = yield call(axios.get, alarmUrl);
    if (tmpAlarm.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { deviceAlarmList: tmpAlarm.data.data || {} },
      });
    } else {
      throw tmpAlarm.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { deviceAlarmList: [] },
    });
  }

}

function* getSubList({ deviceCode, deviceTypeCode }) { // 10s获取下级设备详情
  try {
    if (deviceTypeCode === '301') { // 升压站时，直接传送stationCode
      deviceCode = deviceCode.split('M')[0];
    }
    const subDeviceUrl = `${APIBasePath}${monitorPath[deviceTypeCode].subList}/${deviceCode}`;
    const tmpSubList = yield call(axios.get, subDeviceUrl);
    if (tmpSubList.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: { subDeviceList: tmpSubList.data.data || [] },
      });
    } else {
      throw tmpSubList.data;
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { subDeviceList: [] },
    });
  }
}

function* getDeviceInfoMonitor({ payload, waiting }) { // 开启10s实时监控
  const { deviceTypeCode, deviceCode } = payload;
  if (waiting) {
    yield delay(60000); // 阻塞1分钟
  }
  yield fork(getDeviceDetail, { deviceTypeCode, deviceCode });
  yield fork(getAlarms, { deviceCode });
  yield fork(getEvents, { deviceCode });
  yield fork(getDevicePoints, { deviceCode }); // 所有设备类型都要请求详情, 测点, 告警, 事件, 下级
  yield fork(getSubList, { deviceCode, deviceTypeCode });
  pvMonitorInfoTask = yield fork(getDeviceInfoMonitor, { payload, waiting: true });
}

function* getDeviceChartMonitor({ payload, waiting }) { // 开启图表1h实时监控
  const { deviceTypeCode, deviceCode, timeParam } = payload;
  if (waiting) {
    yield delay(3600000); // 阻塞1h
  } else { // 第一次请求
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: { tenMinChartLoading: true },
    });
  }
  yield fork(getTenMin, { deviceTypeCode, deviceCode, timeParam });
  pvMonitorChartTask = yield fork(getDeviceChartMonitor, { payload, waiting: true });
}

function* stopMonitor() {
  if (pvMonitorInfoTask) { // 终止10s刷新任务
    yield cancel(pvMonitorInfoTask);
  }
  if (pvMonitorChartTask) { // 终止1h刷新图表任务
    yield cancel(pvMonitorChartTask);
  }
}

function* getBoosterstation(action) { // 获取升压站列表(共有)
  const { payload } = action;
  try {
    const { stationCode } = payload;
    const url = `${APIBasePath}${monitor.getBoosterstation}${stationCode}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          boosterList: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        boosterList: [],
      },
    });
  }
}



// 风机部分
function* getwindturbineData(action) { // 获取风机实时数据 (由于暂时还需要保持之前的地址，不要删)
  const { payload } = action;
  const { deviceCode, stationCode } = payload;
  try {
    // const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.windturbine}/${deviceCode}`; // 实时数据
    const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.newWindturbine}/${deviceCode}`; // 新的实时数据
    const detailUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.getFanList}/${stationCode}`; // 设备列表
    const pointUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.monitorPointData}/${deviceCode}`; // 测点数据
    const alarmUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.deviceAlarmData}/${deviceCode}/事件告警`; //告警数据
    yield put({ type: deviceAction.CHANGE_DEVICE_MONITOR_STORE });

    const [windturbine, fanPoint, fanDetail, fanAlarm] = yield all([
      call(axios.get, windturbineUrl),
      call(axios.get, pointUrl),
      call(axios.get, detailUrl),
      call(axios.get, alarmUrl),
    ]);
    if (windturbine.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          deviceDetail: windturbine.data.data || {}, // 单风机详细数据
        },
      });
    }
    if (fanPoint.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          devicePointData: fanPoint.data.data || [],
        },
      });
    }
    if (fanAlarm.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          deviceAlarmList: fanAlarm.data.data || [],
        },
      });
    }
    if (fanDetail.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          devices: fanDetail.data.data.deviceList || [], // 同一个风机组下的数据
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getScatterpoint(action) { // 单风机散点图
  const { payload } = action;
  const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.scatterpoint}`;
  try {
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        scatterpoint: {},
        scatterpointTime: null,
        scatterpointLoading: true,
      },
    });
    const response = yield call(axios.post, windturbineUrl, payload);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          scatterpoint: response.data.data || {},
          scatterpointTime: moment().unix(),
          scatterpointLoading: false,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        scatterpoint: {},
        scatterpointTime: moment().unix(),
        scatterpointLoading: false,
      },
    });
  }
}

function* getSequencediagram(action) { // 单风机出力图(时序图)
  const { payload } = action;
  const { deviceFullCode, startTime, endTime } = payload;
  // const timeSubtract = (queryTime) => moment(queryTime).subtract(10, 'm').utc().format();
  // const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.sequencediagram}/${deviceFullCode}/${timeSubtract(startTime)}/${timeSubtract(endTime)}`;
  const windturbineUrl = `${path.basePaths.APIBasePath}${path.APISubPaths.monitor.sequencediagram}/${deviceFullCode}/${startTime}/${endTime}`;
  try {
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        sequencediagram: {},
        sequencediagramTime: null,
        sequenceLoading: true,
      },
    });
    const response = yield call(axios.get, windturbineUrl, payload);
    if (response.data.code === '10000') {
      // const { sequenceChartList = [] } = sequencediagram; // 时序图
      // 因十分钟聚合数据计算展示区间问题, 出力图整体平移10min, 放弃掉最后一个时间点, 同时，展示时间调整为依次 + 10min
      // const tmpSequencediagram = response.data.data || {};
      // const tmpSequenceChartList = tmpSequencediagram.sequenceChartList || [];
      // const sequenceChartList = tmpSequenceChartList.map(e => ({ ...e, utc: moment(e.utc).add(10, 'm').format() }));
      // const sequencediagram = { ...tmpSequencediagram, sequenceChartList };
      yield put({
        type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
        payload: {
          // sequencediagram,
          sequencediagram: response.data.data || {},
          sequencediagramTime: moment().unix(),
          sequenceLoading: false,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      payload: {
        sequencediagram: {},
        sequencediagramTime: moment().unix(),
        sequenceLoading: false,
      },
    });
  }
}

function* getWindDeviceCharts(action) { // 单风机散点图  单风机时序图
  const { waiting } = action;
  if (waiting) {
    yield delay(3600000); // 阻塞1小时
  }
  yield fork(getScatterpoint, action);
  yield fork(getSequencediagram, action);
  realChartsInterval = yield fork(getWindDeviceCharts, { ...action, waiting: true });
}

function* getWindDeviceRealData(action) { // 单风机实时数据
  const { waiting } = action;
  if (waiting) {
    yield delay(10000); // 阻塞10秒
  }
  yield fork(getwindturbineData, action);
  WindDeviceRealData = yield fork(getWindDeviceRealData, { ...action, waiting: true });
}

function* stopWindDeviceCharts(action) { // 停止进程
  const { payload } = action;
  if (realChartsInterval) {
    yield cancel(realChartsInterval);
  }
  if (payload === 'tenSecond' && WindDeviceRealData) {
    yield cancel(WindDeviceRealData);
  }
}

function* handleRemoveWarning(action) { // 手动解除告警
  const { payload } = action;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  const url = `${path.basePaths.APIBasePath}${Path.APISubPaths.monitor.relieveAlarm}`;
  try {
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func();
      message.success('手动解除成功', 1);
    }
  } catch (e) {
    console.log(e);
  }
}

function* transferWarning(action) { // 转工单
  const { payload } = action;
  const url = `${APIBasePath}${monitor.transferAlarm}`;
  // 保存参数
  const objParams = {};
  // 过滤func函数
  Object.keys(payload).forEach((key) => {
    if (key !== 'func') {
      objParams[key] = payload[key];
    }
  });
  try {
    const response = yield call(axios.post, url, objParams);
    if (response.data.code === '10000') {
      payload.func();
      message.success('转工单成功', 1);
    } else {
      message.warning('转工单失败', 1);
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchDeviceMonitor() {
  yield takeLatest(deviceAction.getDevices, getDevices);
  yield takeLatest(deviceAction.getDeviceInfoMonitor, getDeviceInfoMonitor);
  yield takeLatest(deviceAction.getDeviceChartMonitor, getDeviceChartMonitor);
  yield takeLatest(deviceAction.stopMonitor, stopMonitor);
  yield takeLatest(deviceAction.getBoosterstation, getBoosterstation);
  // 风机部分
  // yield takeLatest(deviceAction.getwindturbineData, getwindturbineData);
  // yield takeLatest(deviceAction.getSequencechartData, getSequencechartData);
  yield takeLatest(deviceAction.getWindDeviceCharts, getWindDeviceCharts);
  yield takeLatest(deviceAction.stopWindDeviceCharts, stopWindDeviceCharts);
  yield takeLatest(deviceAction.getWindDeviceRealData, getWindDeviceRealData);
  yield takeLatest(deviceAction.handleRemoveWarning, handleRemoveWarning);
  yield takeLatest(deviceAction.transferWarning, transferWarning);

}


