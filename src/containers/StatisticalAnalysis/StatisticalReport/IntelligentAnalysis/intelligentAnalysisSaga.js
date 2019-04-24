import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

function* getSingleStationAnalysis({ payload = {} }) { // 获取单电站报告信息
  const { month, year, stationCode } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getIntelligent}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if(!response.data.data){
        yield put({
          type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
          payload: {
            reportShow: false,
          }
        })
        return message.error("暂无数据")
      }else{
       yield put({
        type: intelligentAnalysisAction.GET_INTELLIGENTANALYSIS_SUCCESS,
        payload: {
          stationCode,
          reportShow: true,
          year,
          month,
          singleStationInfo: response.data.data || {}
        },
      })}
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
      payload: {
        reportShow: false,
      }
    })
    message.error('请求数据失败！');
    console.log(e);
  }
}

function* getAreaStation({ payload = {} }) { // 获取同区域电站报告信息
  const { month, year, areaName } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getArea}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if(!response.data.data){
        yield put({
          type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
          payload: {
            reportShow: false,
          }
        })
        return message.error("暂无数据");
      }else{
       yield put({
        type: intelligentAnalysisAction.GET_INTELLIGENTANALYSIS_SUCCESS,
        payload: {
          areaName,
          year,
          month,
          reportShow: true,
          areaStationInfo:response.data.data || {},
        },
      })}
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
      payload: {
        reportShow: false,
      },
    });
    console.log(e);
    message.error('请求数据失败！')
  }
}

function* getArea({ payload = {} }) { // 获取区域对比报告信息
  const { year, month } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAreaCompare}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if(!response.data.data){
        yield put({
          type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
          payload: {
            reportShow: false,
          }
        })
        return message.error("暂无数据");
      }else{
       yield put({
        type: intelligentAnalysisAction.GET_INTELLIGENTANALYSIS_SUCCESS,
        payload: {
          year,
          month,
          reportShow: true,
          areaInfo: response.data.data || {},
        },
      })}
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
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
  yield takeLatest(intelligentAnalysisAction.getArea, getArea);
}
