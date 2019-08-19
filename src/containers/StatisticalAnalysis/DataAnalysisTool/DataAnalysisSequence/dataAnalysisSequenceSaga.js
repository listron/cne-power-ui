import { call, put, takeLatest, all, select, message } from 'redux-saga/effects';
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
        deviceList: [],

      },
    });
  }
}

function* getSequenceName(action) {//获取
  const { payload } = action;
  const chartType = 1;
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
  // const url = '/mock/api/v3/wind/analysis/scatterplot/xylist';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getScatterOtherName}/${payload.stationCode}`;
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
  const { deviceFullCode, pointY1, pointY2, startTime, endTime, interval } = payload;
  const parmas = { deviceFullCode, pointY1, pointY2, startTime, endTime, interval };
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSequenceData}`;
  try {
    yield put({
      type: dataAnalysisSequenceAction.changeSquenceStore,
      payload: {
        ...parmas,
        chartLoading: true,
        bigchartLoading: true,

      },
    });
    const response = yield call(axios.post, url, {
      ...parmas,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
    });
    const preSequenceData = yield select(state => (state.statisticalAnalysisReducer.dataAnalysisSequenceReducer.get('sequenceData').toJS()));

    if (response.data.code === '10000') {
      const curChartData = response.data.data || {};
      if (interval === 10) {
        yield put({
          type: dataAnalysisSequenceAction.changeSquenceStore,
          payload: {

            sequenceData: [...preSequenceData, curChartData],
            chartLoading: false,
          },
        });
      } else if (interval === 60) {
        yield put({
          type: dataAnalysisSequenceAction.changeSquenceStore,
          payload: {
            chartTime: moment().unix(), // 用于比较
            curBigChartData: curChartData,
            bigchartLoading: false,
          },
        });
      }
    } else {
      yield put({
        type: dataAnalysisSequenceAction.changeSquenceStore,
        payload: {
          chartLoading: false,
          sequenceData: interval === 60 ? [...preSequenceData] : [...preSequenceData, {}],
          chartTime: moment().unix(),
        },
      });
      message.error('请求失败');
      throw response.data.message;
    }
  } catch (e) {
    console.log(e);

  }
}




export function* watchDataAnalysisSequenceSaga() {
  yield takeLatest(dataAnalysisSequenceAction.getStationDevice, getStationDevice);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceName, getSequenceName);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceOtherName, getSequenceOtherName);
  yield takeLatest(dataAnalysisSequenceAction.getSequenceData, getSequenceData);
}
