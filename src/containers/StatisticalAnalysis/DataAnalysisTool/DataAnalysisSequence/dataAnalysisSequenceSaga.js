import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { dataAnalysisSequenceAction } from './dataAnalysisSequenceAction';
import moment from 'moment';

function* getStationDevice(action) {//获取
  const { payload } = action;
  // const url = '/mock/api/v3/wind/analysis/scatterplot/names';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getStationDevice}/${payload.stationCode}`;
  try {
    yield put({ type: dataAnalysisSequenceAction.changeSquenceStore });
    const response = yield call(axios.get, url);// { params: payload }
    if (response.data.code === '10000') {
      const data = response.data.data || [];
      const deviceList = data.map((e, i) => ({ ...e, likeStatus: false }));
      yield put({
        type: dataAnalysisSequenceAction.changeSquenceStore,
        payload: {
          deviceList,
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: dataAnalysisSequenceAction.changeSquenceStore,
      payload: {
        scatterNames: [],
        scatterNameTime: moment().unix(),
      },
    });
  }
}

function* getSequenceName(action) {//获取
  const { payload } = action;
  const chartType = 2;
  // const url = '/mock/api/v3/wind/analysis/scatterplot/names';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterName}/${payload.stationCode}/${chartType}`;
  try {
    yield put({ type: dataAnalysisSequenceAction.changeSquenceStore });
    const response = yield call(axios.get, url);// { params: payload }
    if (response.data.code === '10000') {
      yield put({
        type: dataAnalysisSequenceAction.changeSquenceStore,
        payload: {
          sequenceNames: response.data.data || [],
          sequenceNameTime: moment().unix(),
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: dataAnalysisSequenceAction.changeSquenceStore,
      payload: {
        sequenceNames: [],
        scatterNameTime: moment().unix(),
      },
    });
  }
}
function* getSequenceOtherName(action) {//获取
  const { payload } = action;
  const url = '/mock/api/v3/wind/analysis/scatterplot/xylist';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterOtherName}/${payload.stationCode}`;
  try {
    yield put({ type: dataAnalysisSequenceAction.changeSquenceStore });
    const response = yield call(axios.get, url);//{ params: payload }
    if (response.data.code === '10000') {
      yield put({
        type: dataAnalysisSequenceAction.changeSquenceStore,
        payload: {
          sequenceotherNames: response.data.data || [],
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSequenceData(action) {//获取
  const { payload } = action;
  const { startTime, endTime } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSequenceData}`;
  try {
    yield put({
      type: dataAnalysisSequenceAction.changeSquenceStore,
      payload: {
        ...payload,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
    });
    if (response.data.code === '10000') {
      const sequenceData = response.data.data || [];
      yield put({
        type: dataAnalysisSequenceAction.changeSquenceStore,
        payload: {
          sequenceData,
          scatterDataTime: moment().unix(),
        },
      });
    } else {
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: dataAnalysisSequenceAction.changeSquenceStore,
      payload: {
        scatterData: [],
        scatterDataTime: moment().unix(),
      },
    });
  }
}




export function* watchDataAnalysisSequenceSaga() {
  yield takeLatest(dataAnalysisSequenceAction.getStationDevice, getStationDevice);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceName, getSequenceName);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceOtherName, getSequenceOtherName);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceData, getSequenceData);
}
