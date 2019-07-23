import { call, put, takeLatest, select, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import Path from '../../../../constants/path';
import { realtimeAction } from './realtimeReducer';
import { message } from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';

const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;
let realtimeChartInterval = null;
let realtimeListInterval = null;

function *getAvailableDeviceType({ payload = {} }) { // 获取可用设备类型
  const { stationCode } = payload;
  const sortTypes = [ // 默认排序顺序
    '风电机组', '集中式逆变器', '组串式逆变器','集电线路', '箱变', '汇流箱', '气象站', '站内母线', '主变', '站用变', '接地变', '测风塔', '全场信息汇总', '电能采集', '主进线', '功率预测系统', '能量管理平台', 'SVG', '母线分段', '馈线', '直流屏', '孤岛保护'
  ];
  try {
    const url = `${APIBasePath}${monitor.getAvailableDeviceType}/${stationCode}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const stationDeviceTypes = response.data.data || [];
      stationDeviceTypes.sort((a, b) => {
        const tmpIndexA = sortTypes.indexOf(a.deviceTypeName);
        const tmpIndexB = sortTypes.indexOf(b.deviceTypeName);
        if (tmpIndexA === -1) {
          return 1;
        }
        if (tmpIndexB === -1) {
          return -1
        }
        return (tmpIndexA - tmpIndexB);
      })
      const defaultTypes = stationDeviceTypes.find(e => e.deviceTypeCode); // 默认选第一个
      yield put({
        type: realtimeAction.GET_REALTIME_SUCCESS,
        payload: {
          stationDeviceTypes,
          deviceTypeCode: defaultTypes ? defaultTypes.deviceTypeCode : null,
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
          reRenderTree: moment().unix(), // 记录时间
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
  const url = `${APIBasePath}${monitor.getRealtimeChart}`; // '/mock/monitor/dataAnalysisChartRealtime'
  const { chartRealtime, dataTime, timeInterval, chartTimeText } = yield select(state => state.monitor.dataRealtime.toJS());
  const maxInfoLength = 30 * 60 / timeInterval; // 规定的最大数据长度30min.
  try {
    const { queryParam = {} } = payload;
    const { devicePoints = [], deviceFullCodes = [] } = queryParam;
    const [response, timeoutInfo] = yield race([
      call(axios.post, url, {
        ...queryParam,
        enterpriseId: Cookie.get('enterpriseId'),
        deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
        devicePoints: devicePoints.filter(e => !e.includes('group_')) // 去掉测点的所属分组code
      }),
      delay(4500) // 请求4.5秒无响应即为超时。
    ]);
    if (response && response.data && response.data.code === '10000') { // 请求成功
      const chartInfo = response.data.data || {};
      const { pointTime = [], pointInfo = [] } = chartInfo;
      const maxTime = moment(pointTime[0]); // api返回的最大时刻。

      if (!dataTime && pointTime[0]) { // 初次请求得到数据 => 30min内数据需用null补全。
        const tmpFillTimes = []; // 基于返回数据，填充的长度为最大长度的时间数据.
        for (let i = maxInfoLength - 1; i >= 0; i--){
          tmpFillTimes.push(moment(pointTime[0]).subtract(i * timeInterval, 's').format('YYYY-MM-DD HH:mm:ss'));
        }
        yield put({
          type: realtimeAction.GET_REALTIME_SUCCESS,
          payload: {
            chartTimeMoment: maxTime, // 仅用于展示的最新api数据时间。
            chartRealtime: {
              pointInfo: pointInfo.map(e => {
                const { pointCode, pointName, pointUnit, deviceInfo = [] } = e || {};
                return {
                  pointCode,
                  pointName,
                  pointUnit,
                  deviceInfo: deviceInfo.map(device => {
                    const { deviceCode, deviceName, pointValue = [] } = device || {};
                    const tmpFillValues = [];
                    if (pointTime.length > 0 && pointValue.length > 0) { // 有时间和数据，才进行填充管理。
                      for (let i = 0; i < maxInfoLength; i++) {
                        if (i < maxInfoLength - pointValue.length) { // 无数据位 以null填充
                          tmpFillValues.push(null);
                        } else { // 将有数据位倒序填充。
                          tmpFillValues.push(pointValue[ maxInfoLength - i - 1 ]);
                        }
                      }
                    }
                    return {
                      deviceCode,
                      deviceName,
                      pointValue: tmpFillValues,
                    }
                  })
                }
              }),
              pointTime: tmpFillTimes,
            },
            dataTime: maxTime.format('YYYY-MM-DD HH:mm:ss'), // 存储最大数据时刻
            chartLoading: false,
          }
        })
      } else { // 已有存储的数据信息，将api结果追加进入当前chart数据组。
        const newPointTime = chartRealtime.pointTime || [];
        const prePointInfo = chartRealtime.pointInfo || [];
        if (!pointTime[0] || (moment(pointTime[0]) <= moment(newPointTime[0]))) { // api时间不存在或返回时间已小于记录中的最小时间，抛弃。
          throw { response };
        }
        const timeSpace = parseInt((maxTime - moment(dataTime)) / 1000 / timeInterval); // 超出记录的最大时间的段数.(可为负数)

        for (let i = 0; i < timeSpace; i++) {
          newPointTime.shift();
          const currentMaxTime = newPointTime[newPointTime.length - 1];
          newPointTime.push(moment(currentMaxTime).add(timeInterval, 's').format('YYYY-MM-DD HH:mm:ss'));
        }
        // console.log('时间跨度'+newPointTime.length+'最小时间:'+newPointTime[0]+'---最大时间:' + newPointTime[newPointTime.length - 1])
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
              const reverseValues = [...matchedDevice.pointValue].reverse();
              if (timeSpace > pointTime.length) { // 需追加数据超过api传来的数据长度，null补足后，再倒序插入api数据。
                for (let i = 0; i < timeSpace - pointTime.length; i++) {
                  pointValue.push(null);
                }
                pointValue.push(...reverseValues);
              } else if (timeSpace + maxInfoLength < pointTime.length) { // timeSpace < 0，需插入数据位置在头部部分需舍弃位置。
                const cutLength = maxInfoLength + timeSpace; // 20 5 -20
                reverseValues.splice(0, cutLength);
                pointValue.splice(0, pointTime.length - cutLength, ...reverseValues);
                // 返回的时间
              } else { // 队列操作, 位移长度 = pointTime.length - timeSpace 
                const cutLength = pointTime.length - timeSpace;
                pointValue.splice(pointValue.length - cutLength, pointValue.length, ...reverseValues); // 切末尾并插入新数据
              }
              pointValue.splice(0, pointValue.length - maxInfoLength); // 额外长度切除。
              return {
                deviceCode,
                deviceName,
                pointValue,
              }
            })
          }
        })
        // const testConsoleValue = newPointInfo[0].deviceInfo[0].pointValue;
        // console.log(pointInfo[0].deviceInfo[0].pointValue.reverse())
        // console.log(testConsoleValue.slice(testConsoleValue.length - 5, testConsoleValue.length - 1));
        yield put({
          type: realtimeAction.GET_REALTIME_SUCCESS,
          payload: {
            dataTime: moment(maxTime).format('YYYY-MM-DD HH:mm:ss'),
            chartTimeMoment: (maxTime > moment(dataTime)) ? maxTime : moment(dataTime), // 仅用于展示的最新api数据时间。
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
      yield put({
        type: realtimeAction.CHANGE_REALTIME_STORE,
        payload: {
          chartLoading: false,
        }
      })
      return;
    }
    const newDataTime = moment(dataTime).add(timeInterval, 's').format('YYYY-MM-DD HH:mm:ss');
    const { pointTime = [], pointInfo = [] } = chartRealtime;
    pointTime.shift();
    pointTime.push(newDataTime);
    const newPointInfo = pointInfo.map(e => ({
      pointName: e.pointName,
      pointCode: e.pointCode,
      pointUnit: e.pointUnit,
      deviceInfo: e.deviceInfo.map(inner => {
        const { deviceCode, deviceName, pointValue } = inner;
        pointValue.shift();
        pointValue.push(null);
        return {
          deviceCode,
          deviceName,
          pointValue,
        }
      })
    }));
    yield put({
      type: realtimeAction.CHANGE_REALTIME_STORE,
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
