import { put, call, takeLatest } from 'redux-saga/effects';
import { meterListAction } from './meterListReducer.js';
import axios from 'axios';
import path from '@path';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

function* getMeterList(action) { // 获取抄表列表数据
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getMeterList}`;
  try {
    yield put({
      type: meterListAction.changeStore,
      payload: {
        tableLoading: true,
        params: { ...payload },
      },
    });
    const response = yield call(axios.post, url, {...payload});
    if (response.data.code === '10000') {
      yield put({
        type: meterListAction.changeStore,
        payload: {
          tableLoading: false,
          meterData: response.data.data,
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取抄表列表数据失败！');
    yield put({
      type: meterListAction.changeStore,
      payload: {
        tableLoading: false,
      },
    });
    console.log(e);
  }
}
export function* watchMeterList() {
  yield takeLatest(meterListAction.getMeterList, getMeterList);
}

