import { call, put, takeLatest, select, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import Path from '../../../../constants/path';
import { realtimeAction } from './realtimeReducer';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;
let realtimeChartInterval = null;
let realtimeListInterval = null;

function *getAvailableDeviceType({ payload = {} }) { // 获取可用设备类型
  const { stationCode } = payload;
  try {
    const url = `${APIBasePath}${monitor.getAvailableDeviceType}/${stationCode}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          stationDeviceTypes: response.data.data || [],
        }
      })
    } else { throw response }
  } catch(error) {
    console.log(error);
  }
}

function *getPointInfo({ payload }) { // 获取可选测点
  const { deviceFullCodes, timeInterval } = payload;
  const url = `${APIBasePath}${monitor.getPointsInfo}` // '/mock/monitor/dataAnalysisPoints';
  try {
    const response = yield call(axios.post, url, {
      deviceIds: deviceFullCodes.map(e => e.deviceId),
      devicePointTypes: timeInterval === 10 ? ['YM', 'YC'] : ['YM', 'YC', 'YX']
    });
    if (response.data.code === '10000') {
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          pointInfo: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *realChartInterval({ payload = {} }) { // 请求。=> (推送)处理数据及错误判断
  const url = `${APIBasePath}${monitor.getRealtimeChart}` // '/mock/monitor/dataAnalysisChartRealtime';
  const { chartRealtime, dataTime, timeInterval } = yield select(state => state.monitor.dataRealtime.toJS());
  try {
    const { queryParam = {} } = payload;
    const { devicePoints = [], deviceFullCodes = [] } = queryParam;
    const [response, timeoutInfo] = yield race([
      call(axios.post, url, {
        ...queryParam,
        deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
        devicePoints: devicePoints.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
      }),
      delay(3000) // 请求3秒无响应即为超时。
    ]);
    if (response && response.data && response.data.code === '10000') { // 请求成功
      const chartInfo = response.data.data || {};
      const { pointTime = [], pointInfo = [] } = chartInfo;
      const maxTime = moment(pointTime[0]); // api返回的最大时刻。
      if (!dataTime) { // 初次请求得到数据
        yield put({
          type: realtimeAction.GET_REALTIME_SUCCESS,
          payload: {
            chartRealtime: {
              pointInfo: pointInfo.map(e => {
                const { pointCode, pointName, pointUnit, deviceInfo = [] } = e || {};
                return {
                  pointCode,
                  pointName,
                  pointUnit,
                  deviceInfo: deviceInfo.map(device => {
                    const { deviceCode, deviceName, pointValue = [] } = device || {};
                    return {
                      deviceCode,
                      deviceName,
                      pointValue: pointValue.reverse(),
                    }
                  })
                }
              }),
              pointTime: pointTime.reverse().map(e => moment(e).format('YYYY-MM-DD HH:mm:ss')), // 后台倒序调整为正序
            },
            dataTime: maxTime.format('YYYY-MM-DD HH:mm:ss'), // 存储最大数据时刻
            chartLoading: false,
          }
        })
      } else { // 已有存储的数据信息，将api结果追加进入当前chart数据组。
        if (moment(dataTime) >= maxTime || !pointTime[0]) { // 若数据记录时间 大于或等于 返回值得最大时间，为无用数据
          throw { response };
        }
        const newPointTime = chartRealtime.pointTime || [];
        const prePointInfo = chartRealtime.pointInfo || []; // 先假定response中的time和info为连续时刻。
        const timeSpace = parseInt((maxTime - moment(dataTime)) / 1000 / timeInterval); // 需插入数据的段数.
        const maxInfoLength = 30 * 60 / timeInterval; // 规定的最大数据长度30min.
        for (let insertTime = 0; insertTime < timeSpace; insertTime ++) {
          const insertParam = moment(maxTime).subtract((timeSpace - insertTime - 1) * timeInterval,'s').format('YYYY-MM-DD HH:mm:ss');
          newPointTime.push(insertParam);
        }
        if (newPointTime.length > maxInfoLength) { // 若数据长度超出指定长度，则需要去除前部分数据。
          newPointTime.splice(0, newPointTime.length - maxInfoLength);
        }
        const newPointInfo = prePointInfo.map(e => { // 新数据添加推送入旧数据
          const { pointName, pointCode, pointUnit, deviceInfo } = e;
          const matchedPoint = pointInfo.find(res => res.pointCode === e.pointCode) || {deviceInfo: []};
          return {
            pointName,
            pointCode,
            pointUnit,
            deviceInfo: deviceInfo.map(inner => {
              const { deviceCode, deviceName, pointValue } = inner;
              const matchedDevice = matchedPoint.deviceInfo.find(res => res.deviceCode === deviceCode) || {pointValue: []};
              const valueLength = matchedDevice.pointValue.length;
              let tmpAddValues = [];
              for (let insertTime = 0; insertTime < timeSpace; insertTime ++) {
                if (timeSpace - insertTime > valueLength) { // 时间段内无值
                  tmpAddValues.push(null);
                } else { // 指定时间点推送数据
                  const addValue = matchedDevice.pointValue[valueLength - insertTime - 1]
                  tmpAddValues.push(addValue);
                }
              }
              pointValue.push(...tmpAddValues);
              if (pointValue.length > maxInfoLength) { // 若数据长度超出指定长度，则需要去除前部分数据。
                pointValue.splice(0, pointValue.length - maxInfoLength);
              }
              return {
                deviceCode,
                deviceName,
                pointValue,
              }
            })
          }
        })
        yield put({
          type: realtimeAction.GET_REALTIME_SUCCESS,
          payload: {
            dataTime: maxTime.format('YYYY-MM-DD HH:mm:ss'),
            chartRealtime: {
              pointTime: newPointTime,
              pointInfo: newPointInfo,
            },
            chartLoading: false,
          }
        })
      }
    } else { // 超时或请求失败。基于记录的请求时间 + 设定时间间隔。
      throw { response, timeoutInfo };
    }
  } catch (err) { // 请求失败，推送入null进入各数据数组，时间 + 5s存储。
    if (!dataTime) { // 初次(dataTime === null)请求数据即失败，不做任何处理。
      return;
    }
    const newDataTime = moment(dataTime).add(5,'s').format('YYYY-MM-DD HH:mm:ss');
    const { pointTime = [], pointInfo = [] } = chartRealtime;
    pointTime.push(newDataTime);
    const newPointInfo = pointInfo.map(e => ({
      pointName: e.pointName,
      pointCode: e.pointCode,
      pointUnit: e.pointUnit,
      deviceInfo: e.deviceInfo.map(inner => {
        const { deviceCode, deviceName, pointValue } = inner;
        pointValue.push(null);
        return {
          deviceCode,
          deviceName,
          pointValue,
        }
      })
    }));
    yield put({
      type: realtimeAction.GET_REALTIME_SUCCESS,
      payload: {
        dataTime: newDataTime, // 存储时刻 + 5s
        chartRealtime: {
          pointTime,
          pointInfo: newPointInfo,
        },
        chartLoading: false,
      }
    })
    console.log(err);
  }
}

function *getRealtimeChart(action) { // 实时chart数据获取
  const { firtQuery = true } = action;
  if (firtQuery) {
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: { chartLoading: true }
    })
  }
  yield fork(realChartInterval, action);
  yield delay(5000); // 阻塞5秒
  realtimeChartInterval = yield fork(getRealtimeChart, { ...action, firtQuery: false });
}

function *stopRealtimeChart(){ // 停止图表数据定时请求并清空数据
  if (realtimeChartInterval) {
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: {
        chartRealtime: {},
        dataTime: null,
      }
    })
    yield cancel(realtimeChartInterval);
  }
}

function *realListInterval({ payload = {} }) {
  const { queryParam = {}, listParam = {} } = payload;
  const url = `${APIBasePath}${monitor.getRealtimeList}` // '/mock/monitor/dataAnalysisListRealtime';
  try {
    const { devicePoints = [], deviceFullCodes = [] } = queryParam;
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
      devicePoints: devicePoints.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
    });
    if (response.data.code === '10000') {
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          listRealtime: response.data.data || {},
          tableLoading: false,
        }
      })
    } else { throw response }
  } catch (err) {
    console.log(err);
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: { tableLoading: false }
    })
  }
}

function *getRealtimeList(action) { // 实时表格数据获取
  const { firtQuery = true } = action;
  if (firtQuery) {
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: { tableLoading: true }
    })
  }
  yield fork(realListInterval, action);
  yield delay(5000); // 阻塞5秒
  realtimeListInterval = yield fork(getRealtimeList,  { ...action, firtQuery: false });
}

function *stopRealtimeList() { // 停止列表数据定时请求
  if (realtimeListInterval) {
    yield cancel(realtimeListInterval);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const url = `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}` // '/mock/monitor/dataAnalysisSecendInteral'
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          timeInterval: hasSecond === 1 ? 1 : 5, // 1s级数据与5s级数据。
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取企业数据时间间隔信息失败!');
    console.log(error);
  }
}

export function* watchDataRealtimeMonitor() {
  yield takeLatest(realtimeAction.getAvailableDeviceType, getAvailableDeviceType);
  yield takeLatest(realtimeAction.getPointInfo, getPointInfo);
  yield takeLatest(realtimeAction.getRealtimeChart, getRealtimeChart);
  yield takeLatest(realtimeAction.getRealtimeList, getRealtimeList);
  yield takeLatest(realtimeAction.getSecendInterval, getSecendInterval);
  yield takeLatest(realtimeAction.stopRealtimeChart, stopRealtimeChart);
  yield takeLatest(realtimeAction.stopRealtimeList, stopRealtimeList);
}
