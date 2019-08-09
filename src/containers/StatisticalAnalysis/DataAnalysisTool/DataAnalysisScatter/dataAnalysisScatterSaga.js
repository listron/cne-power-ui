import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';
import moment from 'moment';

function* getScatterName(action) {//获取
  const { payload } = action;
  const chartType = 1;
  // const url = '/mock/api/v3/wind/analysis/scatterplot/names';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterName}/${payload.stationCode}/${chartType}`;
  try {
    yield put({ type: dataAnalysisScatterAction.changeToolStore });
    const response = yield call(axios.get, url);// { params: payload }
    if (response.data.code === '10000') {
      yield put({
        type: dataAnalysisScatterAction.changeToolStore,
        payload: {
          scatterNames: response.data.data || [],
          scatterNameTime: moment().unix(),
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: dataAnalysisScatterAction.changeToolStore,
      payload: {
        scatterNames: [],
        scatterNameTime: moment().unix(),
      },
    });
  }
}
function* getScatterOtherName(action) {//获取
  const { payload } = action;
  const url = '/mock/api/v3/wind/analysis/scatterplot/xylist';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterOtherName}/${payload.stationCode}`;
  try {
    yield put({ type: dataAnalysisScatterAction.changeToolStore });
    const response = yield call(axios.get, url);//{ params: payload }
    if (response.data.code === '10000') {
      yield put({
        type: dataAnalysisScatterAction.changeToolStore,
        payload: {
          scatterotherNames: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
  }
}
function* getScatterData(action) {//获取
  const { payload } = action;
  const { startTime, endTime } = payload;
  // payload.startTime = moment(startTime).utc().format();
  // payload.endTime = moment(endTime).utc().format();
  // const url = '/mock/api/v3/wind/analysis/scatterplot/list';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterData}`;
  try {
    yield put({
      type: dataAnalysisScatterAction.changeToolStore,
      payload: {
        ...payload,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
    },

    );// { params: payload }
    if (response.data.code === '10000') {
      const scatterArr = response.data.data || [];
      const scatterData = scatterArr.map((e, i) => ({ ...e, likeStatus: false }));
      yield put({
        type: dataAnalysisScatterAction.changeToolStore,
        payload: {
          scatterData,
          scatterDataTime: moment().unix(),
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: dataAnalysisScatterAction.changeToolStore,
      payload: {
        scatterData: [],
        scatterDataTime: moment().unix(),
      },
    });
  }
}



export function* watchDataAnalysisScatterSaga() {
  yield takeLatest(dataAnalysisScatterAction.getScatterName, getScatterName);
  yield takeLatest(dataAnalysisScatterAction.getScatterOtherName, getScatterOtherName);
  yield takeLatest(dataAnalysisScatterAction.getScatterData, getScatterData);
}
