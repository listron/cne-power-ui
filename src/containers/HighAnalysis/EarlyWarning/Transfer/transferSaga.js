import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { transferAction } from './transferAction';

function* changeTransferStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: transferAction.changeTransferStore,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: transferAction.RESET_STORE,
  });
}

function* getTransferList(action) { // 忽略列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getTransferlist}`;
  try {
    yield put({ type: transferAction.transferFetch });
    const response = yield call(axios.post, url, { ...payload });
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
        type: transferAction.getTransferFetchSuccess,
        payload: {
          ...payload,
          transferList: response.data.data.list || [],
          totalNum: response.data.data.total || 0,
          pageNum,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: transferAction.changeTransferStore,
      payload: { ...payload, loading: false, transferList: [] },
    });
  }
}

function* getMatrixlist(action) { // 获取方阵下的列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixList}`;
  try {
    yield put({ type: transferAction.transferFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      yield put({
        type: transferAction.getTransferFetchSuccess,
        payload: {
          ...payload,
          matrixList: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: transferAction.changeTransferStore,
      payload: { ...payload, loading: false, matrixList: [] },
    });
  }
}

export function* watchTransfer() {
  yield takeLatest(transferAction.changeTransferStoreSaga, changeTransferStore);
  yield takeLatest(transferAction.resetStore, resetStore);
  yield takeLatest(transferAction.getTransferList, getTransferList);
  yield takeLatest(transferAction.getMatrixlist, getMatrixlist);
}

