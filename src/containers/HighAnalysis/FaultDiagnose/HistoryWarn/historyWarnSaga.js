import {put, takeEvery, call} from 'redux-saga/effects';
import { historyWarnAction } from './historyWarnAction';
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
      warnHistory,
    },
  }} = Path;

function* getFaultWarnHistory(action) { // 获取历史预警列表。
  const { payload: {
    stationCode,
    selectDeviceCode,
    algorithmModalId,
    createTimeStart,
    createTimeEnd,
    pageSize,
    pageNum,
    sortField,
    sortMethod,
    algorithmModalName,
  } } = action;
  const deviceFullCodes = []; // 保存多个风机全编码
  selectDeviceCode && selectDeviceCode.map(cur => {
    deviceFullCodes.push(cur.deviceCode);
  });
  const params = {
    stationCode: stationCode || null,
    deviceFullCodes,
    algorithmIds: algorithmModalId || [],
    startTime: createTimeStart || '',
    endTime: createTimeEnd || '',
    pageSize,
    pageNum,
    sortField,
    sortMethod,
  };
  const url = `${APIBasePath}${warnHistory}`;
  try {
    // 首先改变reducer
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      payload: {
        loading: true,
        createTimeStart: createTimeStart || '',
        createTimeEnd: createTimeEnd || '',
        algorithmModalId: algorithmModalId || [],
        stationCode,
        pageSize: pageSize || 10,
        pageNum: pageNum || 1,
        sortField: sortField,
        sortMethod: sortMethod,
        selectDeviceCode: selectDeviceCode,
        algorithmModalName: algorithmModalName || [],
      },
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      yield put({
        type: historyWarnAction.changeHistoryWarnStore,
        payload: {
          faultWarnHistoryData: response.data.data || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      payload: {
        loading: false,
      },
    });
  }
}

export function* watchFaultWarnHistory() {
  yield takeEvery(historyWarnAction.getFaultWarnHistory, getFaultWarnHistory);

}

