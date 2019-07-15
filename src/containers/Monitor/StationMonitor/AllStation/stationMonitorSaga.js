import { call, put, takeLatest, fork, cancel, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';
import Path from '../../../../constants/path';
import { allStationAction } from './allStationAction.js';
import { message } from 'antd';
import moment from 'moment';
let realtimeInterval = null;
let realChartsInterval = null;
let realPowerInterval = null;
let realPvtimeInterval = null;
let realPvChartInterval = null;
const baseurl = Path.basePaths.APIBasePath;

function* getMonitorStation(action) {//获取所有/风/光电站信息
  const { payload } = action;
  const utcTime = moment.utc().format();
  const anotherUrl = baseurl + Path.APISubPaths.monitor.getStationType + payload.stationType + '/' + utcTime;
  const windUrl = baseurl + Path.APISubPaths.monitor.getWindStation + '/' + utcTime;
  const url = payload.stationType === '0' ? windUrl : anotherUrl;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      if (payload.stationType === '2') { // 全部的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { allMonitorStation: response.data.data || {}, loading: false },
        });
      }
      if (payload.stationType === '0') { // 风电的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { windMonitorStation: response.data.data || {}, loading: false }
        });
      }
      if (payload.stationType === '1') { // 光伏的数据
        yield put({
          type: allStationAction.changeMonitorstationStore,
          payload: { pvMonitorStation: response.data.data || {}, loading: false }
        });
      }
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    let nameArr = ["windMonitorStation", "pvMonitorStation", "allMonitorStation"][payload.stationType];
    payload[nameArr] = {};
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload,
    });
  }
}

function* getRealMonitorData(action) {
  const { firtQuery = true, waiting } = action;
  if (waiting) { // 进程刚进来就付值，防止关不掉这个进程
    yield delay(10000);
  }
  if (firtQuery) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: true }
    })
  }
  yield fork(getMonitorStation, action);
  realtimeInterval = yield fork(getRealMonitorData, { ...action, firtQuery: false, waiting: true });

}

function* stopRealMonitorData() { // 停止数据定时请求并清空数据
  if (realtimeInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: false }
    })
    yield cancel(realtimeInterval);
  }
}

function* getCapabilityDiagram(action) { //获取出力图数据
  const { startTime, endTime } = action;
  const url = `${baseurl + Path.APISubPaths.monitor.getWindCapability}/${startTime}/${endTime}/-1`
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        capabilityLoading: true,
        capabilityDataTime: null
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          capabilityData: response.data.data || [],
          capabilityDataTime: moment().unix(),
          capabilityLoading: false
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        capabilityData: [],
      }
    });
  }
}

function* getMonitorPower(action) { //获取理论发电量 实际发电量数据(风电)
  const { payload } = action;
  const { intervalTime, startTime, endTime } = payload;
  const url = `${baseurl + Path.APISubPaths.monitor.getWindMonitorPower}/${intervalTime}/${startTime}/${endTime}/${-1}`;
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerLoading: true,
        powerTime: null,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          powerData: response.data.data || [],
          powerTime: moment().unix(),
          powerLoading: false,
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: [],
        powerTime: moment().unix(),
        powerLoading: false,
      }
    });
  }
}

function* getMonitorScatter(action) { // 等效小时数(风电)
  const localDate = moment().format('YYYY-MM-DD');
  const url = `${baseurl + Path.APISubPaths.monitor.getWindScatter}/${localDate}}`
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        scatterData: {},
        scatterTime: null,
        scatterLoading: true,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          scatterData: response.data.data || {},
          scatterTime: moment().unix(),
          scatterLoading: false,
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: [],
        scatterTime: moment().unix(),
        scatterLoading: false,
      }
    });
  }
}

function* getRealChartsData(action) { // 获取出力图和日等效利用小时散点数(风电)
  const { payload } = action;
  const { capability } = payload;
  yield fork(getCapabilityDiagram, { ...capability });
  yield fork(getMonitorScatter);
  yield delay(3600000); // 阻塞1小时
  realChartsInterval = yield fork(getRealChartsData, action);
}


function* getRealMonitorPower(action) { // (风电)
  yield fork(getMonitorPower, action);
  yield delay(3600000); // 阻塞1小时
  realPowerInterval = yield fork(getRealMonitorPower, action);
}

function* stopRealCharstData(action) { // (风电)
  const { payload } = action;
  if (realChartsInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        capabilityData: [],
        scatterData: [],
      }
    });
    yield cancel(realChartsInterval);
  }
  if (payload === 'power' && realPowerInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        powerData: []
      }
    });
    yield cancel(realPowerInterval);
  }
}


// =====================光伏======================
function* dayPower(action) { // 多电站日发电量与等效时图(光伏)
  const { payload } = action;
  const { regionName } = payload;
  const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const startDate = moment(endDate).subtract(1, 'month').format('YYYY-MM-DD');
  const url = `${baseurl + Path.APISubPaths.monitor.getDayPower}${startDate}/${endDate}/${regionName}`;
  // const url=`/mock/api/v3/monitor/dayPower`;
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        dayPowerLoading: true,
        dayPowerTime: null,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          dayPowerData: response.data.data || [],
          dayPowerTime: moment().unix(),
          dayPowerLoading: false
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        dayPowerData: [],
        dayPowerTime: moment().unix(),
        dayPowerLoading: false
      }
    });
  }
}

function* monthPower(action) { // 多电站月发电量与等效时图(光伏)
  const { payload } = action;
  const { regionName } = payload;
  const endDate = moment().endOf('year').format('YYYY-MM-DD');
  const startDate = moment().startOf('year').format('YYYY-MM-DD');
  const url = `${baseurl + Path.APISubPaths.monitor.getMonthPower}${startDate}/${endDate}/${regionName}`;
  // const url=`/mock/api/v3/monitor/monthPower`;
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        monthPowerLoading: true,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          monthPowerData: response.data.data || [],
          monthPowerTime: moment().unix(),
          monthPowerLoading: false,
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        monthPowerData: [],
        monthPowerTime: moment().unix(),
        monthPowerLoading: false,
      }
    });
  }
}

function* monthplanpower(action) { // 多电站月累计与计划发电量图(光伏)
  const { payload } = action;
  const { regionName } = payload;
  const endDate = moment().endOf('year').format('YYYY-MM-DD');
  const startDate = moment().startOf('year').format('YYYY-MM-DD');
  const url = `${baseurl + Path.APISubPaths.monitor.getMonthPalnPower}${startDate}/${endDate}/${regionName}`;
  // const url = `/mock/api/v3/monitor/monthPlanpower`;
  try {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        monthPlanPowerLoading: true,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === "10000") {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          monthPlanPowerData: response.data.data || [],
          monthPlanPowerTime: moment().unix(),
          monthPlanPowerLoading: false
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        monthPlanPowerData: [],
        monthPlanPowerTime: moment().unix(),
        monthPlanPowerLoading: false
      }
    });
  }
}

function* getPvChartsData(action) { // 光伏电站的图表
  yield fork(dayPower, action);
  yield fork(monthPower, action);
  yield fork(monthplanpower, action);
}

function* getPvMonitorStation(action) {//获取所有光电站信息
  const { payload } = action;
  const { regionName } = payload;
  const UTCString = moment.utc().format();
  const url = `${baseurl}${Path.APISubPaths.monitor.getPvStation}`
  // const url = '/mock/v3/monitor/stations/station';
  try {
    const response = yield call(axios.post, url, { UTCString, regionName });
    if (response.data.code === '10000') {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          pvMonitorStation: response.data.data || {},
          loading: false,
          stationType: '1',
          pvUnix: moment().unix()
        },

      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        pvMonitorStation: {},
        stationType: '1',
        loading: false,
        pvUnix: moment().unix()
      }
    });
  }
}

function* getPvCapabilitydiagrams(action) { // 获取每一个的出力图
  const { payload } = action;
  const { regionName, stationCodes = [], nowStationCodes = [] } = payload;
  let startTime = moment().startOf('day').utc().format();
  let endTime = moment().endOf('day').utc().format();
  const url = `${baseurl}${Path.APISubPaths.monitor.getPvCapabilitydiagrams}`;
  // const url = '/mock/v3/monitor/stations/getPvCapabilitydiagrams';
  let pvCapabilitydiagramsData = [];
  if (stationCodes.length > 12) {  //  1 存处的数据  原始+新增加的 否则是新添加的数据
    pvCapabilitydiagramsData = yield select(state => {
      return state.monitor.stationMonitor.get('pvCapabilitydiagramsData').toJS()
    })
  }
  try {
    const response = yield call(axios.post, url, { regionName, stationCodes: nowStationCodes, startTime, endTime });
    if (response.data.code === '10000') {
      yield put({
        type: allStationAction.changeMonitorstationStore,
        payload: {
          pvCapabilitydiagramsData: [...pvCapabilitydiagramsData, ...response.data.data],
          pvCapLoading: false
        }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('获取数据失败，请刷新');
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: {
        pvCapabilitydiagramsData: [],
        pvCapLoading: false
      }
    });
  }
}

function* getSingleCharts(action) { // 五分钟获取每一个电站的出力图
  const { payload } = action;
  const { regionName } = payload;
  let startTime = moment().startOf('day').utc().format();
  let endTime = moment().endOf('day').utc().format();
  const url = `${baseurl}${Path.APISubPaths.monitor.getPvCapabilitydiagrams}`;
  let stationCodes = yield select(state => { // 获取现在所有的电站 即使现在新增加的也可以
    return state.monitor.stationMonitor.get('stationCodes').toJS()
  })
  var arr2 = [];
  for (let i = 0; i < stationCodes.length / 12; i++) {
    arr2.push(stationCodes.slice(i * 12, i * 12 + 12));
  }
  if (arr2.length > 0) {
    for (let i = 0; i < arr2.length; i++) {
      yield delay(2000)
      try {
        let pvCapabilitydiagramsData = yield select(state => { // 获取现在出力图有的数据也是可以的
          return state.monitor.stationMonitor.get('pvCapabilitydiagramsData').toJS()
        })
        const response = yield call(axios.post, url, { regionName, stationCodes: arr2[i], startTime, endTime });
        pvCapabilitydiagramsData = pvCapabilitydiagramsData.filter(e => !arr2[i].includes(e.stationCode));
        if (response.data.code === '10000') {
          yield put({
            type: allStationAction.changeMonitorstationStore,
            payload: {
              pvCapabilitydiagramsData: [...response.data.data, ...pvCapabilitydiagramsData],
              pvCapLoading: false
            }
          });
        } else { throw response.data }
      } catch (e) {
        console.log(e);
        message.error('获取数据失败，请刷新');
      }
    }
  }
}


function* getPvRealChartsData(action) {
  const { waiting } = action;
  if (waiting) {
    yield delay(300000); // 五分钟
  }
  yield fork(getSingleCharts, action);
  realPvChartInterval = yield fork(getPvRealChartsData, { ...action, waiting: true });
}


function* getPvRealData(action) { // 获取光伏的数据
  const { firtQuery = true, waiting } = action;
  if (waiting) {
    yield delay(60000); // 一分钟
  }
  if (firtQuery) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: true }
    })
  }
  yield fork(getPvMonitorStation, action);
  // yield fork(getPvCapabilitydiagrams, action);
  realPvtimeInterval = yield fork(getPvRealData, { ...action, firtQuery: false, waiting: true });
}



function* stopRealMonitorData() { // 停止数据定时请求并清空数据(光伏)
  if (realtimeInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: false }
    })
    yield cancel(realtimeInterval);
  }
  if (realPvtimeInterval) {
    yield put({
      type: allStationAction.changeMonitorstationStore,
      payload: { loading: false }
    })
    yield cancel(realPvtimeInterval);
  }
  if (realPvChartInterval) {
    yield cancel(realPvChartInterval);
  }
}


export function* watchStationMonitor() {
  yield takeLatest(allStationAction.getMonitorStation, getMonitorStation);
  yield takeLatest(allStationAction.stopRealMonitorData, stopRealMonitorData);
  yield takeLatest(allStationAction.getRealMonitorData, getRealMonitorData);
  yield takeLatest(allStationAction.getRealMonitorPower, getRealMonitorPower);
  yield takeLatest(allStationAction.getRealChartsData, getRealChartsData);
  yield takeLatest(allStationAction.stopRealCharstData, stopRealCharstData);
  yield takeLatest(allStationAction.getPvChartsData, getPvChartsData);
  yield takeLatest(allStationAction.getPvRealData, getPvRealData);
  yield takeLatest(allStationAction.getPvCapabilitydiagrams, getPvCapabilitydiagrams);
  yield takeLatest(allStationAction.getPvRealChartsData, getPvRealChartsData);
}


