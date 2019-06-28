import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { manufacturersAction } from './manufacturersAction';

function* getManufacturer(action) { // 获取生产厂家
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getManufacturer}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: manufacturersAction.changeManufacturersStore,
        payload: {
          manufacturerList: response.data.data || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: manufacturersAction.changeManufacturersStore,
      payload: {
        manufacturerList: []
      },
    });
  }
}

function* getDevicemode(action) { // 获取设备型号
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getDevicemode}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: manufacturersAction.changeManufacturersStore,
        payload: {
          devicemodeList: response.data.data || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: manufacturersAction.changeManufacturersStore,
      payload: {
        devicemodeList: []
      },
    });
  }
}


function* getDevicecontrast(action) { // 获取设备对比列表的数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getDevicecontrast}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: manufacturersAction.changeManufacturersStore,
        payload: {
          deviceData: response.data.data || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: manufacturersAction.changeManufacturersStore,
      payload: {
        deviceData: []
      },
    });
  }
}


function* getChartsData(action) { // 获取图表数据
  const { payload } = action;
  // const url='/mock/performance/deviceanalysis/stationcontrastmore';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getStationcontrastmore}`
  try {
    yield put({
      type: manufacturersAction.changeManufacturersStore,
      payload: {
        ...payload,
        loading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: manufacturersAction.changeManufacturersStore,
        payload: {
          loading: false,
          conversioneffList: response.data.data.conversioneffList || [],
          faultNumList: response.data.data.faultNumList || [],
          faultHoursList: response.data.data.faultHoursList || [],
          deviceCapacityList: response.data.data.deviceCapacityList || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: manufacturersAction.changeManufacturersStore,
      payload: {
        loading: false,
        chartsData: []
      },
    });
  }
}





export function* watchManufacturers() {
  yield takeLatest(manufacturersAction.getDevicecontrast, getDevicecontrast);
  yield takeLatest(manufacturersAction.getManufacturer, getManufacturer);
  yield takeLatest(manufacturersAction.getDevicemode, getDevicemode);
  yield takeLatest(manufacturersAction.getChartsData, getChartsData);
}

