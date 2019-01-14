import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { warningAction } from './warningAction.js';
import Cookie from 'js-cookie';


function* changeWarnStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: warningAction.changeWarnStore,
    payload,
  })
}


function* resetStore() {
  yield put({
    type: warningAction.RESET_STORE
  })
}

function* getSeriesData(action) { //获取低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getSeriesData}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          getConf: response.data.data || {},
        },
      });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        getConf: {},
      },
    });
    console.log(e);
  }
}

function* addSeriesData(action) { //修改低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addSeriesData}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.getSeriesData
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}

function* getCleaningData(action) { //获取清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getCleaningData}/${payload.enterpriseId}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          getClean: response.data.data || {},
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}

function* addCleaningData(action) { //设置清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addCleaningData}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const params = {
        enterpriseId: Cookie.get('enterpriseId'),
      };
      yield put({
        type: warningAction.getCleaningData,
        payload: { ...params }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}

export function* watchWarning() {
  yield takeLatest(warningAction.changeWarnStoreSaga, changeWarnStore);
  yield takeLatest(warningAction.resetStore, resetStore);
  yield takeLatest(warningAction.getSeriesData, getSeriesData);
  yield takeLatest(warningAction.getCleaningData, getCleaningData);
  yield takeLatest(warningAction.addSeriesData, addSeriesData);
  yield takeLatest(warningAction.addCleaningData, addCleaningData);

}