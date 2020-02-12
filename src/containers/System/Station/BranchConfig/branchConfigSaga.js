
import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { branchConfigAction } from './branchConfigAction';
import { message } from 'antd';
import moment from 'moment';

const { APIBasePath } = Path.basePaths;
const { monitor, system } = Path.APISubPaths;

function* getAvailableDeviceType({ payload = {} }) { // 获取可用设备类型
  const { stationCode } = payload;
  const sortTypes = [ // 电站默认排序顺序
    '风电机组', '集中式逆变器', '组串式逆变器', '集电线路', '箱变', '汇流箱', '气象站', '站内母线', '主变', '站用变', '接地变', '测风塔', '全场信息汇总', '电能采集', '主进线', '功率预测系统', '能量管理平台', 'SVG', '母线分段', '馈线', '直流屏', '孤岛保护',
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
          return -1;
        }
        return (tmpIndexA - tmpIndexB);
      });
      const defaultTypes = stationDeviceTypes.find(e => e.deviceTypeCode); // 默认选中第一个设备类型名称
      yield put({
        type: branchConfigAction.GET_HISTORY_SUCCESS,
        payload: {
          stationDeviceTypes,
          deviceTypeCode: defaultTypes ? defaultTypes.deviceTypeCode : null,
        },
      });
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error);
  }
}
function* getStations(action) {
  const { payload } = action;
  const url = `${APIBasePath}${system.getStations}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
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
  const url = '/mock/base/devicetype/branch';
  // const url = `${APIBasePath}${system.getDeviceType}`;
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
  const url = `${APIBasePath}${system.getDeviceName}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
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
// function* getCheckStatus(action) {
//   const { payload } = action;
//   const url = `${APIBasePath}${system.getCheckStatus}`;
//   try {
//     const response = yield call(axios.get, url, { ...payload });
//     if (response.data.code === '10000') {
//       yield put({
//         type: branchConfigAction.changeBranchStore,
//         payload: {
//           ...payload,
//           checkStatus: response.data.data || [],
//         },
//       });
//     } else {
//       throw response.data.message;
//     }

//   } catch (e) {
//     console.log(e);
//     yield put({
//       type: branchConfigAction.changeBranchStore,
//       payload: { checkStatus: [] },
//     });
//   }
// }
function* getDeviceBranchInfo(action) {
  const { payload } = action;
  const url = '/mock/base/branch/checkresult';
  // const url = `${APIBasePath}${system.getDeviceBranchInfo}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
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
  const url = `${APIBasePath}${system.getCheckData}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          checkData: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { checkData: [] },
    });
  }
}
function* editBranchData(action) {
  const { payload } = action;
  const url = `${APIBasePath}${system.editBranchData}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
    if (response.data.code === '10000') {
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {},
    });
  }
}

export function* watchBranchConfigSaga() {
  yield takeLatest(branchConfigAction.getAvailableDeviceType, getAvailableDeviceType);
  yield takeLatest(branchConfigAction.getStations, getStations);
  yield takeLatest(branchConfigAction.getDeviceType, getDeviceType);
  yield takeLatest(branchConfigAction.getDeviceName, getDeviceName);
  // yield takeLatest(branchConfigAction.getCheckStatus, getCheckStatus);
  yield takeLatest(branchConfigAction.getDeviceBranchInfo, getDeviceBranchInfo);
  yield takeLatest(branchConfigAction.getCheckData, getCheckData);
  yield takeLatest(branchConfigAction.editBranchData, editBranchData);


}
