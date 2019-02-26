import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { customizeAction } from './customizeAction';

function* changeCustomizeStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: customizeAction.changeCustomizeStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: customizeAction.RESET_STORE
  })
}

function* getManufacturer(action) { // 获取生产厂家
  const { payload } = action;
  const { params, resultName } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getManufacturer}`
  try {
    const response = yield call(axios.post, url, {
      ...params,
      stationCode: [params.stationCode]
    });
    if (response.data.code === '10000') {
      yield put({
        type: customizeAction.changeCustomizeStore,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: customizeAction.changeCustomizeStore,
      payload: {
        [resultName]: []
      },
    });
  }
}

function* getDevicemode(action) { // 获取电站下 生产厂家 所有的设备型号
  const { payload } = action;
  const { params, resultName } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getDevicemodes}`
  try {
    const response = yield call(axios.post, url, {
      ...params,
      stationCode: [params.stationCode]
    });
    if (response.data.code === '10000') {
      yield put({
        type: customizeAction.changeCustomizeStore,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: customizeAction.changeCustomizeStore,
      payload: {
        [resultName]: []
      },
    });
  }
}

function* getDetailData(action) { // 获取详细数据
  const { payload } = action;
  const { params, resultName } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getStationcontrast}`
  try {
    const response = yield call(axios.post, url, {
      ...params,
    });
    if (response.data.code === '10000') {
      yield put({
        type: customizeAction.changeCustomizeStore,
        payload: {
          [resultName]: response.data.data || {},
        },
      });
    } else { throw response.data }
  } catch (e) {
    // console.log(e);
    yield put({
      type: customizeAction.changeCustomizeStore,
      payload: {
        [resultName]: {}
      },
    });
  }
}


export function* watchCustomize() {
  yield takeLatest(customizeAction.changeCustomizeStoreSaga, changeCustomizeStore);
  yield takeLatest(customizeAction.resetStore, resetStore);
  yield takeLatest(customizeAction.getManufacturer, getManufacturer);
  yield takeLatest(customizeAction.getDevicemode, getDevicemode);
  yield takeLatest(customizeAction.getDetailData, getDetailData);

}

