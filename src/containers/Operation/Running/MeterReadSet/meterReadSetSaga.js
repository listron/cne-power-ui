import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { meterReadSetAction } from './meterReadSetAction';
const { APIBasePath } = Path.basePaths;
const { operation } = Path.APISubPaths;

function *getMeterList({ payload = {} }){
  // const url = `${APIBasePath}${operation.getMeterList}`;
  const url = '/mock/operation/meter';
  try{
    yield put({
      type: meterReadSetAction.changeMeterReadSetStore,
      payload: { tableLoading: true },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: meterReadSetAction.changeMeterReadSetStore,
        payload: {
          tableLoading: false,
          meterListError: false,
          meterListData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch(error){
    yield put({
      tableLoading: false,
      meterListError: true,
      meterListData: [],
    });
    console.log(error);
  }
}

export function* wacthMeterReadSet() {
  yield takeLatest(meterReadSetAction.getMeterList, getMeterList);
}
