import {put, takeEvery, call} from 'redux-saga/effects';
import { faultWarnAction } from './faultWarnAction';
import Path from '../../../../constants/path';
import axios from 'axios';

/***
 * 解析公共头APIBasePath
 * highAnalysis下面的接口
 */

const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      warnSummary,
    },
  }} = Path;

function* getFaultWarnList() { // 获取多风场故障预警汇总列表。
  const url = `${APIBasePath}${warnSummary}`;
  try {
    yield put({
      type: faultWarnAction.changeFaultWarnStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultWarnAction.changeFaultWarnStore,
        payload: {
          faultWarnList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultWarnAction.changeFaultWarnStore,
      payload: {
        loading: false,
      },
    });
  }
}

export function* watchFaultWarn() {
  yield takeEvery(faultWarnAction.getFaultWarnList, getFaultWarnList);

}

