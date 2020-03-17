import { call, put, takeLatest, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../constants/path';
import { publicAction } from './publicAction';
import { message } from 'antd';
const { basePaths, pubilcPath, APISubPaths } = Path;
const { APIBasePath } = basePaths;

// 2020年3月5日 v4的改版 业务服务-基础服务

function* getStationTypeDeviceModes(action) { // 通用： 根据指定电站类型获取设备类型信息
  const { payload } = action;
  const { params, actionName, resultName } = payload;
  const url = `${APIBasePath}${pubilcPath.getStationDevicetypes}/${params.stationCode}/${params.deviceTypeCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: actionName,
      payload: {
        [resultName]: [],
      },
    });
  }
}

function* getDeviceType(action) { // 新共用接口，获取电站设备类型下设备型号
  const { payload } = action;
  const { params, actionName, resultName } = payload;
  const url = `${APIBasePath}${pubilcPath.getDeviceType}/${params.stationCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: actionName,
        payload: {
          [resultName]: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: actionName,
      payload: {
        [resultName]: [],
      },
    });
  }
}

export function* watchPublic() {
  yield takeLatest(publicAction.getStationTypeDeviceModes, getStationTypeDeviceModes);
  yield takeLatest(publicAction.getDeviceType, getDeviceType);
}


