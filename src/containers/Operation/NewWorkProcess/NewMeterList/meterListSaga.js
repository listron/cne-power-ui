import {put, call, takeLatest} from 'redux-saga/effects';
import {newMeterListAction} from './meterListReducer.js';
import axios from 'axios';
import path from '@path';

import {message} from 'antd';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {ticket} = APISubPaths;


function* getParticipant() { // 获取执行人所有列表
  const url = `${APIBasePath}${ticket.getOperaUser}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: newMeterListAction.changeStore,
        payload: {
          participantList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: newMeterListAction.changeStore,
      payload: {
        participantList: [],
      },
    });
    console.log(e);
  }
}

function* getMeterList(action) { // 获取抄表列表数据
  const {payload} = action;
  const url = `${APIBasePath}${ticket.getMeterList}`;
  try {
    yield put({
      type: newMeterListAction.changeStore,
      payload: {
        tableLoading: true,
        listParams: {...payload},
      },
    });
    const response = yield call(axios.post, url, {...payload});
    if (response.data.code === '10000') {
      yield put({
        type: newMeterListAction.changeStore,
        payload: {
          tableLoading: false,
          meterData: response.data.data,
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: newMeterListAction.changeStore,
      payload: {
        tableLoading: false,
      },
    });
    console.log(e);
  }
}

export function* newWatchMeterList() {
  yield takeLatest(newMeterListAction.getMeterList, getMeterList);
  yield takeLatest(newMeterListAction.getParticipant, getParticipant);
}

