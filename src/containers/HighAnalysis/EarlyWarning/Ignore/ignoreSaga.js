import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { ignoreAction } from './ignoreAction';

function* changeIgnoreStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: ignoreAction.changeIgnoreStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: ignoreAction.RESET_STORE
  })
}

function* getIgnoreList(action) { // 忽略列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getIgnorelist}`
  try {
    yield put({ type: ignoreAction.ignoreFetch });
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
        type: ignoreAction.getIgnoreFetchSuccess,
        payload: {
          ...payload,
          ignoreList: response.data.data.list || [],
          totalNum: response.data.data.total || 0,
          pageNum,
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    // message.error('获取列表失败')
    yield put({
      type: ignoreAction.changeIgnoreStore,
      payload: { ...payload, loading: false, ignoreList: [] },
    })
  }
}

function* getMatrixlist(action) {  // 获取方阵下的列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixList}`
  try {
    yield put({ type: ignoreAction.ignoreFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      yield put({
        type: ignoreAction.getIgnoreFetchSuccess,
        payload: {
          ...payload,
          matrixList: response.data.data || [],
        },
      });
    } else {
      yield put({
        type: ignoreAction.changeIgnoreStore,
        payload: { ...payload, loading: false, matrixList: [] },
      })
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: ignoreAction.changeIgnoreStore,
      payload: { ...payload, loading: false },
    })
  }
}

function* getUnignore(action) {  // 取消忽略
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.unignore}`
  try {
    yield put({ type: ignoreAction.ignoreFetch });
    const response = yield call(axios.post, url, {
      ...payload,
    });
    if (response.data.code === '10000') {
      message.success("取消忽略成功")
      const params = yield select(state => ({
        stationCodes: state.highAanlysisReducer.unhandle.get('stationCodes'),
        belongMatrixs: state.highAanlysisReducer.unhandle.get('belongMatrixs'),
        startTime: state.highAanlysisReducer.unhandle.get('startTime'),
        endTime: state.highAanlysisReducer.unhandle.get('endTime'),
        pageNum: state.highAanlysisReducer.unhandle.get('pageNum'),
        pageSize: state.highAanlysisReducer.unhandle.get('pageSize'),
        sortField: state.highAanlysisReducer.unhandle.get('sortField'),
        sortMethod: state.highAanlysisReducer.unhandle.get('sortMethod'),
      })
      );
      yield put({
        type: ignoreAction.getIgnoreList,
        payload: params,
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error("取消忽略失败")
    yield put({
      type: ignoreAction.changeIgnoreStore,
      payload: { loading: false },
    })
  }
}


export function* watchIgnore() {
  yield takeLatest(ignoreAction.changeIgnoreStoreSaga, changeIgnoreStore);
  yield takeLatest(ignoreAction.resetStore, resetStore);
  yield takeLatest(ignoreAction.getIgnoreList, getIgnoreList);
  yield takeLatest(ignoreAction.getMatrixlist, getMatrixlist);
  yield takeLatest(ignoreAction.getUnignore, getUnignore);

}

