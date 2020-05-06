import {put, call, takeLatest} from 'redux-saga/effects';
import {eamRegisterDetailAction} from './eamRegisterDetailReducer';
import axios from 'axios';
import path from '@path';

import {message} from 'antd';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {monitor} = APISubPaths;

function* getEamFaultDetails(action) { // 获取EAM故障详情
  const {payload} = action;
  const url = `${APIBasePath}${monitor.getEamFaultDetails}/${payload.faultId}`;
  try {
    yield put({
      type: eamRegisterDetailAction.changeStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: eamRegisterDetailAction.changeStore,
        payload: {
          loading: false,
          eamFaultData: response.data.data,
          workOrderList: response.data.data.workOrders || [],
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: eamRegisterDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}

function* getEamDefectDetails(action) { // 获取EAM缺陷详情
  const {payload} = action;
  const url = `${APIBasePath}${monitor.getEamDefectDetails}/${encodeURI(payload.defectId)}`;
  try {
    yield put({
      type: eamRegisterDetailAction.changeStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: eamRegisterDetailAction.changeStore,
        payload: {
          loading: false,
          eamDefectData: response.data.data,
          workOrderList: response.data.data.workOrders || [],
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: eamRegisterDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}

export function* watchEamRegisterDetail() {
  yield takeLatest(eamRegisterDetailAction.getEamFaultDetails, getEamFaultDetails);
  yield takeLatest(eamRegisterDetailAction.getEamDefectDetails, getEamDefectDetails);
}
