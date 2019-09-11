import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { unhandleAction } from './unhandleAction';

function* changeUnhandleStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: unhandleAction.changeUnhandleStore,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: unhandleAction.RESET_STORE,
  });
}


function* getUnhandleList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getUnhandleList}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
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
        type: unhandleAction.getUnhandleFetchSuccess,
        payload: {
          ...payload,
          unhandleList: response.data.data.list || [],
          totalNum: response.data.data.total || 0,
          pageNum,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { ...payload, loading: false, unhandleList: [] },
    });
  }
}

function* toorder(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.toorder}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      message.success('转工单成功');
      const params = yield select(state => ({
        stationCodes: state.highAanlysisReducer.unhandle.get('stationCodes'),
        belongMatrixs: state.highAanlysisReducer.unhandle.get('belongMatrixs'),
        inefficiencyStatus: state.highAanlysisReducer.unhandle.get('inefficiencyStatus'),
        startTime: state.highAanlysisReducer.unhandle.get('startTime'),
        endTime: state.highAanlysisReducer.unhandle.get('endTime'),
        pageNum: state.highAanlysisReducer.unhandle.get('pageNum'),
        pageSize: state.highAanlysisReducer.unhandle.get('pageSize'),
        sortField: state.highAanlysisReducer.unhandle.get('sortField'),
        sortMethod: state.highAanlysisReducer.unhandle.get('sortMethod'),
      })
      );
      yield put({
        type: unhandleAction.getUnhandleList,
        payload: params,
      });
      yield put({
        type: unhandleAction.changeUnhandleStore,
        payload: {
          dealSuccess: true,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    message.error('转工单失败');
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { loading: false },
    });
  }
}


function* ignoreList(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.ignore}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      message.success('忽略成功');
      const params = yield select(state => ({
        stationCodes: state.highAanlysisReducer.unhandle.get('stationCodes'),
        belongMatrixs: state.highAanlysisReducer.unhandle.get('belongMatrixs'),
        inefficiencyStatus: state.highAanlysisReducer.unhandle.get('inefficiencyStatus'),
        startTime: state.highAanlysisReducer.unhandle.get('startTime'),
        endTime: state.highAanlysisReducer.unhandle.get('endTime'),
        pageNum: state.highAanlysisReducer.unhandle.get('pageNum'),
        pageSize: state.highAanlysisReducer.unhandle.get('pageSize'),
        sortField: state.highAanlysisReducer.unhandle.get('sortField'),
        sortMethod: state.highAanlysisReducer.unhandle.get('sortMethod'),
      })
      );
      yield put({
        type: unhandleAction.getUnhandleList,
        payload: params,
      });
      yield put({
        type: unhandleAction.changeUnhandleStore,
        payload: {
          dealSuccess: true,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    message.error('忽略失败');
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { loading: false },
    });
  }
}


function* getMatrixlist(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixList}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      yield put({
        type: unhandleAction.getUnhandleFetchSuccess,
        payload: {
          ...payload,
          matrixList: response.data.data || [],
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { ...payload, loading: false, matrixList: [] },
    });
  }
}

function* getForewarningDetail(action) {
  const { payload } = action;
  const inefficiencyId = payload.inefficiencyId;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.warnDetail}/${inefficiencyId}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: unhandleAction.getUnhandleFetchSuccess,
        payload: {
          ...payload,
          warnDetail: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { loading: false },
    });
  }
}


function* getSequencechart(action) {
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath + Path.APISubPaths.highAnalysis.getSequencechart}`;
  try {
    yield put({ type: unhandleAction.unhadleFetch });
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: unhandleAction.getUnhandleFetchSuccess,
        payload: {
          ...payload,
          sequenceChartList: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: unhandleAction.changeUnhandleStore,
      payload: { loading: false },
    });
  }
}





export function* watchUnhandle() {
  yield takeLatest(unhandleAction.changeUnhandleStoreSaga, changeUnhandleStore);
  yield takeLatest(unhandleAction.resetStore, resetStore);
  yield takeLatest(unhandleAction.getUnhandleList, getUnhandleList);
  yield takeLatest(unhandleAction.toorder, toorder);
  yield takeLatest(unhandleAction.ignoreList, ignoreList);
  yield takeLatest(unhandleAction.getForewarningDetail, getForewarningDetail);
  yield takeLatest(unhandleAction.getSequencechart, getSequencechart);
  yield takeLatest(unhandleAction.getMatrixlist, getMatrixlist);

}

