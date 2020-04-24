import {put, call, takeLatest} from 'redux-saga/effects';
import {eamListAction} from './eamListAction';
import axios from 'axios';
import path from '@path';

import {message} from 'antd';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {eamTicket} = APISubPaths;


function* getEamStationList() { // 获取电站列表
  const url = `${APIBasePath}${eamTicket.getEamStationList}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: eamListAction.changeStore,
        payload: {
          eamStationList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: eamListAction.changeStore,
      payload: {
        eamStationList: [],
      },
    });
    console.log(e);
  }
}

function* getEamList(action) { // 获取EAM列表数据
  const {payload} = action;
  const url = `${APIBasePath}${eamTicket.getEamList}`;
  try {
    yield put({
      type: eamListAction.changeStore,
      payload: {
        tableLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eamListAction.changeStore,
        payload: {
          tableLoading: false,
          eamTableData: response.data.data,
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: eamListAction.changeStore,
      payload: {
        tableLoading: false,
      },
    });
    console.log(e);
  }
}

export function* watchEamList() {
  yield takeLatest(eamListAction.getEamList, getEamList);
  yield takeLatest(eamListAction.getEamStationList, getEamStationList);
}

