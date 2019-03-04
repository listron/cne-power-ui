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

function *getPointInfo({ payload }) { // 获取可选测点
  const { deviceFullCode } = payload;
  const url = '/mock/monitor/dataAnalysisPoints'; // `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(axios.post, url, { deviceId: deviceFullCode.map(e => e.deviceCode) });
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
  const url = '/mock/monitor/dataAnalysisChartRealtime'; // `${APIBasePath}${monitor.getRealtimeChart}`;
  const { chartRealtime, dataTime, timeInterval } = yield select(state => state.monitor.dataRealtime.toJS());
  try {
    const { queryParam = {} } = payload;
    const { devicePoint = [] } = queryParam;
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: { queryParam }
    })
    const [response, timeoutInfo] = yield race([
      call(axios.post, url, {
        ...queryParam,
        devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
      }),
      delay(3000) // 请求3秒无响应即为超时。
    ]);
    if (response && response.data && response.data.code === '10000') { // 请求成功
      const chartInfo = response.data.data || {};
      const { pointTime = [], pointInfo = [] } = chartInfo;
      if (!dataTime) { // 初次请求得到数据
        yield put({
          type: realtimeAction.GET_REALTIME_SUCCESS,
          payload: {
            dataTime: pointTime.pop(), // 存储最后时刻
            chartRealtime: chartInfo || {},
            chartLoading: false,
          }
        })
      } else { // 已有存储的数据信息，将api结果追加进入当前chart数据组。
        const maxTime = pointTime.pop();
        if (moment(dataTime) >= moment(maxTime)) { // 若数据记录时间 大于或等于 返回值得最大时间，为无用数据
          throw { response };
        }
        const newPointTime = chartRealtime.pointTime || [];
        const prePointInfo = chartRealtime.pointInfo || [];
        const timeSpace = (moment(maxTime) - moment(dataTime)) / 10000 / timeInterval; // 需插入数据的段数.
        const maxInfoLength = 30 * 60 / timeInterval;
        for (let insertTime = 0; insertTime < timeSpace; insertTime ++) {
          const insertParam = moment(maxTime).subtract((timeSpace - insertTime - 1) * timeInterval,'s').format('YYYY-MM-DD HH:mm:ss');
          newPointTime.push(insertParam);
        }
        if (newPointTime.length > maxInfoLength) { // 若数据长度超出指定长度，则需要去除前部分数据。
          newPointTime.splice(0, newPointTime.length - maxInfoLength);
        }
        const newPointInfo = prePointInfo.map(e => { // 新数据添加推送入旧数据
          const { pointName, pointCode, deviceInfo } = e;
          const matchedPoint = pointInfo.find(res => res.pointCode === e.pointCode) || {deviceInfo: []};
          return {
            pointName,
            pointCode,
            deviceInfo: deviceInfo.map(inner => {
              const { deviceCode, deviceName, pointValue } = inner;
              const matchedDevice = matchedPoint.deviceInfo.find(res => res.deviceCode === deviceCode) || {pointValue: []};
              const valueLength = matchedDevice.pointValue.length;
              let tmpAddValues = [];
              for (let insertTime = 0; insertTime < timeSpace; insertTime ++) {
                if (timeSpace - insertTime > valueLength) { // 时间段内无值
                  tmpAddValues.push(null);
                } else { // 指定时间点推送数据
                  const addValue = matchedDevice.pointValue[valueLength - timeSpace + insertTime]
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
            dataTime: moment(maxTime).format('YYYY-MM-DD HH:mm:ss'),
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
    if (dataTime) { // 初次(dataTime === null)请求数据即失败，不做任何处理。
      return;
    }
    const newDataTime = moment(dataTime).add(5,'s').format('YYYY-MM-DD HH:mm:ss');
    const { pointTime = [], pointInfo = [] } = chartRealtime;
    pointTime.push(newDataTime);
    const newPointInfo = pointInfo.map(e => ({
      pointName: e.pointName,
      pointCode: e.pointCode,
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

function *stopRealtimeChart(){ // 停止图表数据定时请求
  yield cancel(realtimeChartInterval);
}

function *realListInterval({ payload = {} }) {
  const { queryParam = {}, listParam = {} } = payload;
  const url = '/mock/monitor/dataAnalysisListRealtime'; // `${APIBasePath}${monitor.getRealtimeList}`;
  try {
    const { devicePoint = [] } = queryParam;
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
      payload: { queryParam, listParam }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      devicePoint: devicePoint.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
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
  yield fork(getRealtimeList,  { ...action, firtQuery: false });
}

function *stopRealtimeList() { // 停止列表数据定时请求
  yield cancel(realtimeListInterval);
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const url = '/mock/monitor/dataAnalysisSecendInteral'; // `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}`;
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
  yield takeLatest(realtimeAction.getPointInfo, getPointInfo);
  yield takeLatest(realtimeAction.getRealtimeChart, getRealtimeChart);
  yield takeLatest(realtimeAction.getRealtimeList, getRealtimeList);
  yield takeLatest(realtimeAction.getSecendInterval, getSecendInterval);
  yield takeLatest(realtimeAction.stopRealtimeChart, stopRealtimeChart);
  yield takeLatest(realtimeAction.stopRealtimeList, stopRealtimeList);
}
