import { put, takeLatest, call} from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

function* getSingleStationAnalysis({ payload = {} }){ // 获取单电站报告信息
   const { month, year, stationCode, stationName  } = payload;
  const url = '/mock/statisticalAnalysis/intelligence/analysis/station';
  try {
    // const stationInfo = stationCode[0] || {};
    // yield put({
    //   type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
    //   payload: { stationCode }
    // }) 
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
        yield put({
            type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
            payload: {
              ...payload,
              stationCode: stationCode,
              stationName: stationName,
              reportShow: true,
              yearTime:year,
              monthTime:month,
              test1:payload.stationCode,
              generatinCapacity: response.data.data.generatinCapacity || {},
              systematicStatistics: response.data.data.systematicStatistics || {},
              completionRate: response.data.data.completionRate || {},
              lossOfElectricity: response.data.data.lossOfElectricity || {},
            },
        });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
      payload: {
        reportShow: false 
      },
    });
    console.log(e);
    message.error('请求数据失败', 1)
  }
}

function* getAreaStation({ payload = {} }){ // 获取同区域电站报告信息
  console.log(payload)
  const url = '/mock/statisticalAnalysis/intelligence/analysis/area';
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
        yield put({
            type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
            payload: {
              areaPartABean:response.data.data.areaPartABean || {},
              areaPartBBean:response.data.data.areaPartBBean || {},
              areaPartCBean:response.data.data.areaPartCBean || {},
              areaPartDBean:response.data.data.areaPartDBean || {},
            },
        });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStorev,
      payload: {
        areaPartABean: {},
        areaPartBBean: {},
        areaPartCBean: {},
        areaPartDBean: {},
      },
    });
    console.log(e);
    message.error('请求数据失败', 1)
  }
}

export function* watchIntelligentAnalysis() {
  yield takeLatest(intelligentAnalysisAction.getSingleStationAnalysis, getSingleStationAnalysis);
  yield takeLatest(intelligentAnalysisAction.getAreaStation, getAreaStation);
}