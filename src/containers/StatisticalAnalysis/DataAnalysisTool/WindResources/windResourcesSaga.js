import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { windResourcesAction } from './windResourcesAction';
import moment from 'moment';

function* getStationDevice(action) {//获取电站设备
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getStationDevice}/${payload.stationCode}`;
  try {
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        stationCode: payload.stationCode,
        deviceList: [],
      },
    });
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      const data = response.data || [];
      const deviceList = data.map((e, i) => ({ ...e, likeStatus: false }));
      const fristDevice = deviceList[0];
      const deviceFullCode = fristDevice.deviceFullCode;
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          deviceList,
        },
      });
      // 获取风能玫瑰图
      if(payload.type === 1){
        yield put({
          type: windResourcesAction.getDirections,
          payload: {
            deviceFullCode,
            startTime: moment().subtract(1, 'months').startOf('month').format(),
            endTime: moment().format(),
          },
        });
      }
      // 获取风能频率图
      if(payload.type === 2) {
        yield put({
          type: windResourcesAction.getFrequency,
          payload: {
            deviceFullCode,
            startTime: moment().subtract(1, 'months').startOf('month').format(),
            endTime: moment().format(),
          },
        });
      }
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        deviceList: [],
      },
    });
  }
}

// 处理时间，当前月和非当前月的日期格式处理
function dateFormat(time) {
  // 当前月份
  const currentEndDate = moment().format('YYYY-MM');
  // 选择结束月份
  const endDate = moment(time).format('YYYY-MM');
  let endTime = moment(time).endOf('months').utc().format();
  // 相等月份
  if(currentEndDate === endDate) {
    endTime = moment().utc().format();
  }
  return endTime;
}

function* getDirections(action){ // 获取风能玫瑰图
  const { payload } = action;
  const { deviceFullCode, startTime, endTime } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getDirections}`;
  try{
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        directionsLoading: true,
      },
    });
    const response = yield call(request.post, url, {...payload,
      startTime: moment(startTime).utc().format(),
      endTime: dateFormat(endTime)
    });
    if (response.code === '10000') {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          directionsData: response.data || [],
          directionsCode: deviceFullCode,
        },
      });
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          directionsCode: deviceFullCode,
        },
      });
    } else {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          directionsLoading: false,
          directionsCode: deviceFullCode,
          directionsData: [],
        },
      });
      message.error('请求失败');
      throw response.data.message;
    }
  }catch (e) {
    console.log(e);
  }
}

function* getBigDirections(action) {// 获取放大后的玫瑰图
  const { payload } = action;
  const { startTime, endTime } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getDirections}`;
  try {
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        ...payload,
        bigWindRoseLoading: true,
      },
    });
    const response = yield call(request.post, url, {
      ...payload,
      startTime: moment(startTime).utc().format(),
      endTime: dateFormat(endTime),
    });
    if (response.code === '10000') {
      const curChartData = response.data || [];
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          ...payload,
          bigWindRoseData: curChartData,
          bigWindRoseLoading: false,
        },
      });
    } else {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          bigWindRoseLoading: false,
        },
      });
      message.error('请求失败');
      throw response;
    }
  } catch (e) {
    console.log(e);
  }
}

function* getFrequency(action){ // 获取风能频率图
  const { payload } = action;
  const { deviceFullCode, startTime, endTime } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getFrequency}`;
  try{
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        chartLoading: true,
      },
    });
    const response = yield call(request.post, url, {...payload,
      startTime: moment(startTime).utc().format(),
      endTime: dateFormat(endTime)
    });
    if (response.code === '10000') {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          frequencyData: response.data || [],
          activeCode: deviceFullCode,
        },
      });
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          activeCode: deviceFullCode,
        },
      });
    } else {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          chartLoading: false,
          activeCode: deviceFullCode,
          frequencyData: [],
        },
      });
      message.error('请求失败');
      throw response.data.message;
    }
  }catch (e) {
    console.log(e);
  }
}

function* getBigFrequency(action) {// 获取放大后的图
  const { payload } = action;
  const { startTime, endTime } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getFrequency}`;
  try {
    yield put({
      type: windResourcesAction.changeWindResourcesStore,
      payload: {
        ...payload,
        bigchartLoading: true,
      },
    });
    const response = yield call(request.post, url, {
      ...payload,
      startTime: moment(startTime).utc().format(),
      endTime: dateFormat(endTime),
    });
    if (response.code === '10000') {
      const curChartData = response.data || [];
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          ...payload,
          curBigChartData: curChartData,
          bigchartLoading: false,
        },
      });
    } else {
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          bigchartLoading: false,
        },
      });
      message.error('请求失败');
      throw response;
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchWindResourcesSaga() {
  yield takeLatest(windResourcesAction.getFrequency, getFrequency);
  yield takeLatest(windResourcesAction.getStationDevice, getStationDevice);
  yield takeLatest(windResourcesAction.getBigFrequency, getBigFrequency);
  yield takeLatest(windResourcesAction.getDirections, getDirections);
  yield takeLatest(windResourcesAction.getBigDirections, getBigDirections);
}
