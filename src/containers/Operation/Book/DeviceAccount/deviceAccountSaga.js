import {put, takeLatest, call} from 'redux-saga/effects';
import { deviceAccountAction } from './deviceAccountAction';
import Path from '../../../../constants/path';
import axios from 'axios';

/***
 * 解析公共头APIBasePath
 * operation下面的接口
 */

const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    operation: {
      deviceAccountList,
      stationsManufactors,
      deviceModeList,
      attachmentsList,
      regionStation,
    },
  },
} = Path;

function* getDeviceAccountList(action) { // 设备台账列表
  const { payload } = action;
  const url = `${APIBasePath}${deviceAccountList}`;
  try {
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: true,
        deviceAccountListLoading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAccountAction.deviceAccountFetchSuccess,
        payload: {
          deviceAccountList: response.data.data || {},
          loading: false,
          deviceAccountListLoading: false,
        },
      });
    }else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: false,
        deviceAccountListLoading: false,
      },
    });
  }
}

function* getStationsManufactorsList(action) { // 获取电站下的厂家列表
  const { payload } = action;
  const url = `${APIBasePath}${stationsManufactors}`;
  try {
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAccountAction.deviceAccountFetchSuccess,
        payload: {
          stationsManufactorsList: response.data.data || [],
          loading: false,
        },
      });
    }else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: false,
      },
    });
  }
}

function* getDeviceModeList(action) { // 获取厂家下的设备型号列表
  const { payload } = action;
  const url = `${APIBasePath}${deviceModeList}/${payload.manufactorId}`;
  try {
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAccountAction.deviceAccountFetchSuccess,
        payload: {
          deviceModeList: response.data.data || [],
          loading: false,
        },
      });
    }else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: false,
      },
    });
  }
}

function* getDeviceAttachments(action) { // 台账备件列表
  const { payload } = action;
  const url = `${APIBasePath}${attachmentsList}`;
  try {
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: true,
        modeIdDetails: payload.modeId,
        assetsIdDetails: payload.assetsId,
        orderFieldDetails: payload.orderField,
        orderMethodDetails: payload.orderMethod,
        pageNumDetails: payload.pageNum,
        pageSizeDetails: payload.pageSize,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAccountAction.deviceAccountFetchSuccess,
        payload: {
          attachmentsList: response.data.data || {},
          loading: false,
        },
      });
    }else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: false,
      },
    });
  }
}

function* getRegionStation() { // 获取权限下的区域
  const url = `${APIBasePath}${regionStation}`;
  try {
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: deviceAccountAction.deviceAccountFetchSuccess,
        payload: {
          regionList: response.data.data || [],
          loading: false,
        },
      });
    }else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceAccountAction.deviceAccountFetchSuccess,
      payload: {
        loading: false,
      },
    });
  }
}


export function* watchDeviceAccount() {
  yield takeLatest(deviceAccountAction.getDeviceAccountList, getDeviceAccountList);
  yield takeLatest(deviceAccountAction.getStationsManufactorsList, getStationsManufactorsList);
  yield takeLatest(deviceAccountAction.getDeviceModeList, getDeviceModeList);
  yield takeLatest(deviceAccountAction.getDeviceAttachments, getDeviceAttachments);
  yield takeLatest(deviceAccountAction.getRegionStation, getRegionStation);
}
