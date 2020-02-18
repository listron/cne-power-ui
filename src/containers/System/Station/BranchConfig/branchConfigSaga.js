
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { branchConfigAction } from './branchConfigAction';
import { message } from 'antd';
import moment from 'moment';

const { APIBasePath } = Path.basePaths;
const { system } = Path.APISubPaths;


function* getStations(action) {
  const { payload } = action;
  const url = `${APIBasePath}${system.getStations}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          stationsInfo: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { stationsInfo: [] },
    });
  }
}
function* getDeviceType(action) {
  const { payload } = action;
  // const url = '/mock/base/devicetype/branch';
  const url = `${APIBasePath}${system.getDeviceType}/${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          deviceTypeData: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { deviceTypeData: [] },
    });
  }
}
function* getDeviceName(action) {
  const { payload } = action;
  const { stationCode, deviceTypeCode } = payload;
  const url = `${APIBasePath}${system.getDeviceName}/${stationCode}/${deviceTypeCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          deviceNameData: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { deviceNameData: [] },
    });
  }
}

function* getDeviceBranchInfo(action) {
  const { payload } = action;
  const { stationCode, deviceTypeCode, deviceFullCodes } = payload;
  // const url = '/mock/base/branch/checkresult';
  const url = `${APIBasePath}${system.getDeviceBranchInfo}/${stationCode}/${deviceTypeCode}/${deviceFullCodes}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const deviceBranchInfo = response.data.data.deviceList || [];
      const checkTime = response.data.data.checkTime || '';
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          checkTime: checkTime ? moment(checkTime).format('YYYY-MM-DD') : '',
          deviceBranchInfo,
          copyData: response.data.data.deviceList || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { deviceBranchInfo: [] },
    });
  }
}
function* getCheckData(action) {
  const { payload } = action;
  const { stationCode, deviceTypeCode, deviceFullCodes } = payload;
  const url = `${APIBasePath}${system.getCheckData}/${stationCode}/${deviceTypeCode}/${deviceFullCodes}`;
  try {
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {
        ...payload,
        loadding: true,
      },
    });
    const response = yield call(axios.get, url, { ...payload });
    if (response.data.code === '10000') {
      const deviceBranchInfo = response.data.data.deviceList || [];
      const checkTime = response.data.data.checkTime || '';
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          loadding: false,
          ...payload,
          checkTime: checkTime ? moment(checkTime).format('YYYY-MM-DD') : '',
          // deviceBranchInfo,
          // copyData: response.data.data.deviceList || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { loadding: false },
    });
  }
}
function* editBranchData(action) {
  const { payload } = action;
  const url = `${APIBasePath}${system.editBranchData}`;
  try {
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {
        ...payload,
        loadding: true,
      },
    });
    const response = yield call(axios.post, url, payload.saveEditArr);

    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          loadding: false,
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e, '编辑保存失败了');
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { loadding: false },
    });
  }
}

export function* watchBranchConfigSaga() {
  yield takeLatest(branchConfigAction.getStations, getStations);
  yield takeLatest(branchConfigAction.getDeviceType, getDeviceType);
  yield takeLatest(branchConfigAction.getDeviceName, getDeviceName);
  yield takeLatest(branchConfigAction.getDeviceBranchInfo, getDeviceBranchInfo);
  yield takeLatest(branchConfigAction.getCheckData, getCheckData);
  yield takeLatest(branchConfigAction.editBranchData, editBranchData);


}
