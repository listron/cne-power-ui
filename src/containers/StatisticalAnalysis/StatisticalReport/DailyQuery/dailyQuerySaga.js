import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dailyQueryAction } from './dailyQueryAction';

function* getQuota({ payload = {} }) { // 获取指标
  const { selectStationType } = payload;
  const url = '/mock/api/v3/performance/report/index';
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          
        },
      });
      }else {
        throw response.data;
      }
  }catch(e) {
    message.error('获取关键指标数据失败！');
    console.log(e);
  }
}

export function* watchDailyQuery() {
  yield takeLatest(dailyQueryAction.getQuota, getQuota);
}
