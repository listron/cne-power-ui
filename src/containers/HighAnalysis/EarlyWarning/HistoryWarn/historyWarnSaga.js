import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { historyWarnAction } from './historyWarnAction';

function* changeHistoryWarnStore(action) { // 存储payload指定参数，替换reducer-store属性。
  console.log(payload);
  const { payload } = action;
  yield put({
    type: historyWarnAction.changeHistoryWarnStore,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: historyWarnAction.RESET_STORE,
  });
}

function* getHistoryWarnList(action) { // 列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getUnhandleList}`;
  try {
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      payload: { loading: true },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const totalNum = response.data.data && response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if (totalNum === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: historyWarnAction.changeHistoryWarnStore,
        payload: {
          ...payload,
          historyWarnList: response.data.data.list || [],
          totalNum: response.data.data.total || 0,
          pageNum,
          loading: false,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      payload: { ...payload, loading: false, historyWarnList: [] },
    });
  }
}


function* getHistoryWarnMatrixList(action) { // 获取方阵下的列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixList}`;
  try {
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      yield put({
        type: historyWarnAction.changeHistoryWarnStore,
        payload: {
          ...payload,
          matrixList: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      payload: { ...payload, matrixList: [] },
    });
  }
}


function* getSequencechart(action) {
  const { payload } = action;
  const { params, resultName } = payload;
  const url = `${Path.basePaths.APIBasePath + Path.APISubPaths.highAnalysis.getSequencechart}`;
  try {
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: historyWarnAction.changeHistoryWarnStore,
        payload: {
          ...payload,
          [resultName]: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: historyWarnAction.changeHistoryWarnStore,
      [resultName]: [],
    });
  }
}
export function* watchHistory() {
  yield takeLatest(historyWarnAction.changeHistoryWarnStoreSaga, changeHistoryWarnStore);
  yield takeLatest(historyWarnAction.resetStore, resetStore);
  yield takeLatest(historyWarnAction.getHistoryWarnList, getHistoryWarnList);
  yield takeLatest(historyWarnAction.getHistoryWarnMatrixList, getHistoryWarnMatrixList);
  yield takeEvery(historyWarnAction.getSequencechart, getSequencechart);

}

