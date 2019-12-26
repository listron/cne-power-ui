import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from '@utils/request';
import { message } from 'antd';
// import moment from 'moment';
import path from '@path';
import { diagnoseCenterAction } from './diagnoseCenterReducer';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;


function* easyPut(actionName, payload){
  yield put({
    type: diagnoseCenterAction[actionName],
    payload,
  });
}


function* getDiagnoseList({ payload = {}}) { // 获取诊断中心列表

}

function* circlingQueryList(){ // 启动周期调用列表

}

function* stopCircleQueryList(){ // 停止周期调用列表

}

function* analysisEvent({ payload = {} }) { // 诊断分析

}


// function *getOverviewStation({ payload }){ // 电站基础数据信息 - 各页面单独存储一份
//   try {
//     const { stationCode, pageKey } = payload || {};
//     const url = `${APIBasePath}${monitor.getOverviewStation}/${stationCode}`;
//     const response = yield call(request.get, url);
//     if (response.code === '10000') {
//       yield call(easyPut, 'fetchSuccess', {
//         [`${pageKey}TopData`]: response.data || {}, // 根据不同页面，生成: stationTopData, deviceTopData, pointTopData
//         [`${pageKey}Unix`]: moment().unix(),
//       });
//     } else { throw response; }
//   } catch (error) {
//     console.log(error);
//     message.error('获取电站基础信息失败, 请刷新重试');
//   }
// }

// function *getOverviewDates({ payload }){ // 电站各日完整率
//   try {
//     yield call(easyPut, 'changeStore', {
//       stationLoading: true,
//     });
//     const { stationCode, deviceTypeCode, month } = payload;
//     const url = `${APIBasePath}${monitor.getOverviewDates}/${stationCode}/${deviceTypeCode}/${month}`;
//     const response = yield call(request.get, url);
//     if (response.code === '10000') {
//       yield call(easyPut, 'fetchSuccess', {
//         stationDatesRate: response.data || [],
//         stationLoading: false,
//       });
//     } else { throw response; }
//   } catch (error) {
//     console.log(error);
//     yield call(easyPut, 'changeStore', {
//       stationDatesRate: [],
//     });
//   }
// }

export function* watchDiagnoseCenter() {
  yield takeLatest(diagnoseCenterAction.getDiagnoseList, getDiagnoseList);
  yield takeLatest(diagnoseCenterAction.analysisEvent, analysisEvent);
  yield takeLatest(diagnoseCenterAction.stopCircleQueryList, stopCircleQueryList);
  yield takeLatest(diagnoseCenterAction.circlingQueryList, circlingQueryList);
}

