import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { stationContrastAction } from './stationContrastAction';
const { APIBasePath } = Path.basePaths;
const { statisticalAnalysis } = Path.APISubPaths;

function* toChangeStationContrastStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: stationContrastAction.changeStationContrastStore,
    payload,
  });
}
function* resetStationContrastStore(action) {
  const { payload } = action;
  yield put({
    type: stationContrastAction.resetStationContrastStoreSuccess,
    payload,
  });
}
function* getStationContrast(action) {//请求两电站对比数据
  const { payload } = action;
  // const url = '/mock/statisticalAnalysis/MockStationContrast';
  const url = `${APIBasePath}${statisticalAnalysis.getStationContrast}`;
  try {
    yield put({ type: stationContrastAction.stationContrastLoading });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationContrastAction.stationContrastFetchSuccess,
        payload: {
          // ...payload,
          stationContrastList: response.data.data || [],
        },
      });
    } else {
      yield put({
        type: stationContrastAction.toChangeStationContrastStore,
        payload: {
          ...payload,
          stationContrastList: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    message.error('获取两电站对比数据失败，请重试');
    yield put({
      type: stationContrastAction.toChangeStationContrastStore,
      payload: {
        loading: false,
        stationContrastList: [],
      },
    });
  }
}

function* getStationContrastDetail(action) { // 请求两电站列对比详细内容
  const { payload } = action;
  // const url = '/mock/statisticalAnalysis/MockStationContrast/detail';
  const url = `${APIBasePath}${statisticalAnalysis.getStationContrastDetail}`;
  try {
    yield put({ type: stationContrastAction.stationContrastLoading });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationContrastAction.stationContrastFetchSuccess,
        payload: {
          stationContrastDetail: response.data.data || [],
        },
      });
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e);
    message.error('获取两电站列对比详细内容数据失败，请重试');
    yield put({
      type: stationContrastAction.toChangeStationContrastStore,
      payload: {
        loading: false,
        stationContrastDetail: [],
      },
    });
  }
}




export function* watchStationContrastSaga() {
  yield takeLatest(stationContrastAction.toChangeStationContrastStore, toChangeStationContrastStore);
  yield takeLatest(stationContrastAction.getStationContrast, getStationContrast);
  yield takeLatest(stationContrastAction.getStationContrastDetail, getStationContrastDetail);
  yield takeLatest(stationContrastAction.resetStationContrastStore, resetStationContrastStore);
}

