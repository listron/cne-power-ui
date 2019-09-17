import { call, put, takeLatest, all, select, message } from 'redux-saga/effects';
import request from '../../../../utils/request';
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
      yield put({
        type: windResourcesAction.changeWindResourcesStore,
        payload: {
          deviceList,
        },
      });
      yield put({
        type: windResourcesAction.getSequenceName,
        payload: {
          stationCode: payload.stationCode,
        },
      });
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
      endTime: moment(endTime).endOf('d').utc().format()});
      
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
    // yield put({
    //   type: windResourcesAction.changeWindResourcesStore,
    //   payload: {
    //     frequencyData: [],
    //   },
    // });
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
      endTime: moment(endTime).endOf('d').utc().format(),
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
}
