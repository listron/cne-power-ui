import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { scatterDiagramAction } from './scatterDiagramAction';
import { message } from 'antd';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getPointInfo({payload = {} }) { // 获取可选测点
  const { deviceFullCode } = payload;
  try {
    const url = '/mock/monitor/dataAnalysis/dataAnalysisPoints';    // `${APIBasePath}${monitor.getXYaxis}/${deviceFullCode[0].deviceCode}`; 
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      console.log('data',response.data.data)
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          xPointList: response.data.data.xPoint || [],
          yPointList: response.data.data.yPoint || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const { queryParam } = yield select(state => state.monitor.dataHistory.toJS());
    const url = '/mock/monitor/dataAnalysisSecendInteral';
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [1, 5 ,10] : [5 ,10],
          queryParam: {
            ...queryParam,
            timeInterval: hasSecond === 1 ? 1 : 5,
          }
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取企业数据时间间隔信息失败!');
    console.log(error);
  }
}

export function* watchDataScatterDiagramMonitor() {
  yield takeLatest(scatterDiagramAction.getSecendInterval, getSecendInterval);
  yield takeLatest(scatterDiagramAction.getPointInfo, getPointInfo);
  // yield takeLatest(scatterDiagramAction.getChartScatterDiagram, getChartScatterDiagram);
}