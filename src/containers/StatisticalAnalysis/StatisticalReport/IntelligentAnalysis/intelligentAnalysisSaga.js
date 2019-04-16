import {put,takeLatest,call} from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {message} from 'antd';
import {intelligentAnalysisAction} from './intelligentAnalysisAction';

function* getSingleStationAnalysis({ payload = {} }) { // 获取单电站报告信息
  const {month, year, stationCode, stationName} = payload;
  // const url = '/mock/statisticalAnalysis/intelligence/analysis/station';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getIntelligent}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
        payload: {
          selectStationCode: stationCode,
          checkedStationName: stationName,
          reportShow: true,
          yearTime: year,
          monthTime: month,
          // generatinCapacity: response.data.data ? response.data.data.generatinCapacity : {},
          // systematicStatistics: response.data.data ? response.data.data.systematicStatistics : {},
          // completionRate: response.data.data ? response.data.data.completionRate : {},
          // lossOfElectricity: response.data.data ? response.data.data.lossOfElectricity : {},
          generatinCapacity: response.data.data.generatinCapacity || {},
          systematicStatistics: response.data.data.systematicStatistics || {},
          completionRate: response.data.data.completionRate || {},
          lossOfElectricity: response.data.data.lossOfElectricity || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('请求数据失败!');
    console.log(e);
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
      payload: {
        reportShow: false,
      }
    })
  }
}


function* getAreaStation({ payload = {} }) { // 获取同区域电站报告信息
  const { areaName, year, month, regionName } = payload;
  const url = '/mock/statisticalAnalysis/intelligence/analysis/area';
  // consr url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getArea}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
        payload: {
          // checkedRegionName: regionName,
          yearTime: year,
          monthTime: month,
          reportShow: true,
          areaPartABean: response.data.data.areaPartABean || {},
          areaPartBBean: response.data.data.areaPartBBean || {},
          areaPartCBean: response.data.data.areaPartCBean || {},
          areaPartDBean: response.data.data.areaPartDBean || {},
        },
      });
    } else {
      throw response.data.data
    }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStorev,
      payload: {
        reportShow: false,
      },
    });
    console.log(e);
    message.error('请求数据失败')
  }
}

function* getAreaStation({ payload = {} }) { // 获取区域对比报告信息
  const { year, month } = payload;
  const url = '/mock/statisticalAnalysis/intelligence/analysis/areacompare';
  // consr url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.areacompare}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
        payload: {
          yearTime: year,
          monthTime: month,
          reportShow: true,
          avgComplateRate: response.data.data.avgComplateRate || {},
          areaPartABeanList: response.data.data.areaPartABeanList || {},
          lostEquientHours: response.data.data.lostEquientHours || {},
          areaPartBBeanList: response.data.data.areaPartBBeanList || {},
        },
      });
    } else {
      throw response.data.data
    }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStorev,
      payload: {
        reportShow: false,
      },
    });
    console.log(e);
    message.error('请求数据失败')
  }
}

export function* watchIntelligentAnalysis() {
  yield takeLatest(intelligentAnalysisAction.getSingleStationAnalysis, getSingleStationAnalysis);
  yield takeLatest(intelligentAnalysisAction.getAreaStation, getAreaStation);
}
