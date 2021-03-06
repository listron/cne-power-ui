
import { call, put, takeLatest, select } from 'redux-saga/effects';
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
  const { stationCode } = payload;
  // const url = '/mock/base/devicetype/branch';
  const url = `${APIBasePath}${system.getDeviceType}/${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url, { ...payload });
    if (response.data.code === '10000') {
      const deviceTypeData = response.data.data || [];
      const hasbox = deviceTypeData.some(e => e.deviceTypeCode === 202);
      const hasInverter = deviceTypeData.some(e => e.deviceTypeCode === 206);
      const deviceTypeCode = hasbox ? 202 : hasInverter ? 206 : null;
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          deviceTypeData,
          deviceTypeCode,
        },
      });
      yield put({
        type: branchConfigAction.getDeviceBranchInfo,
        payload: { stationCode, deviceTypeCode },
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
  const { stationCode, deviceTypeCode, deviceCodes = [] } = payload;
  // const url = '/mock/base/branch/checkresult';
  const deviceCodeArr = deviceCodes.map(e => e.deviceCode);
  const url = `${APIBasePath}${system.getDeviceBranchInfo}/${stationCode}`;
  try {
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {
        cancelloadding: true,
        loadding: true,
        checked: false,
      },
    });
    const response = yield call(axios.post, url, { ...payload, deviceTypeCode, deviceCodes: deviceCodeArr });
    if (response.data.code === '10000') {
      // branchList里面的数据需要根据branchIndex排序
      const newDeviceList = response.data.data.deviceList.map(cur => {
        const obj = {};
        obj.deviceFullCode = cur.deviceFullCode;
        obj.branchList = cur.branchList.sort((a, b) => {
          if (a.branchIndex < b.branchIndex) {
            return -1;
          } else if (a.branchIndex === b.branchIndex) {
            return 0;
          }
          return 1;
        });
        obj.deviceFullCode = cur.deviceFullCode;
        obj.branchNums = cur.branchNums;
        obj.deviceName = cur.deviceName;
        return obj;
      });
      const checkTime = response.data.data.checkTime || '';
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          checkTime: checkTime ? moment(checkTime).format('YYYY-MM-DD') : '',
          deviceBranchInfo: newDeviceList || [],
          copyData: newDeviceList || [],
          cancelloadding: false,
          loadding: false,
          checked: false,

        },
      });
    } else {
      throw response.data.message;
    }

  } catch (e) {
    console.log(e);
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { deviceBranchInfo: [], cancelloadding: false, loadding: false },
    });
  }
}
function* getCheckData(action) {
  const { payload } = action;
  const { stationCode, deviceTypeCode, deviceCodes } = payload;
  const deviceCodeArr = deviceCodes.map(e => e.deviceCode);
  const url = `${APIBasePath}${system.getCheckData}/${stationCode}`;

  try {
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {
        loadding: true,
      },
    });
    const response = yield call(axios.post, url, { ...payload, deviceTypeCode, deviceCodes: deviceCodeArr });
    if (response.data.code === '10000') {

      const checkTime = response.data.data.checkTime || '';
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          loadding: false,
          // ...payload,
          checkTime: checkTime ? moment(checkTime).format('YYYY-MM-DD') : '',
          deviceBranchInfo: response.data.data.deviceList || [],
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
      payload: { loadding: false },
    });
  }
}
function* editBranchData(action) {
  const { payload } = action;
  const { saveEditArr, copyData, isgetTable, stationCode, deviceTypeCode, deviceCodes } = payload;
  const url = `${APIBasePath}${system.editBranchData}`;
  try {
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: {
        saveEditArr,
        editLoadding: true,
      },
    });
    const response = yield call(axios.post, url, payload.saveEditArr);

    if (response.data.code === '10000') {
      const data = response.data.data || [];
      let newCopyData = copyData;
      if (data.length) {//如果是数组的话就对新增的这些支路数据，进行拼接到数组里，已有的就
        const addDeviceFullcode = data.map(e => e.deviceFullCode);
        const deviceFullCode = addDeviceFullcode ? addDeviceFullcode[0] : null;
        newCopyData = copyData.map((e, i) => {
          if (e.deviceFullCode === deviceFullCode) {
            const branchList = e.branchList.map(item => {
              const addIndex = data.map(m => m.branchIndex);
              const istrue = addIndex.includes(item.branchIndex);
              if (istrue) {
                const filteraddItemData = data.filter(n => n.branchIndex === item.branchIndex)[0];
                const { branchCode } = filteraddItemData;
                return { ...item, branchCode };
              }
              return { ...item };
            });
            return { ...e, branchList };
          }
          return { ...e };
        });
      }
      yield put({
        type: branchConfigAction.changeBranchStore,
        payload: {
          ...payload,
          deviceBranchInfo: newCopyData,
          copyData: newCopyData,
          editLoadding: false,
          isCheckStatus: false,


        },
      });
      if (isgetTable) {
        yield put({
          type: branchConfigAction.getDeviceBranchInfo,
          payload: {
            stationCode,
            deviceTypeCode,
            deviceCodes,
          },
        });
      }
    } else {
      throw response.data.message;
    }
  } catch (e) {
    message.error('保存编辑失败');
    console.log(e, '编辑保存失败了');
    yield put({
      type: branchConfigAction.changeBranchStore,
      payload: { editLoadding: false },
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
