import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { stationAchieveAction } from './stationAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *testStation(action) { // 用户所有区域与电站
  try {
    // const url = `${APIBasePath}${highAnalysis.getAreaStation}/0`;
    const response = yield call(console.log, 'test station now');
    // if (response.data.code === '10000') {
    //   yield put({
    //     type: achieveAction.fetchSuccess,
    //     payload: { areaStation: response.data },
    //   });
    // } else { throw response.data; }
  } catch(error) {
    message.error('test');
  }
}

// lostRank: [], // 损失根源 - 指标排名
//   lostRankLoading: false,
//   lostTrend: [], // 损失根源 - 指标趋势
//   lostTrendLoading: false,
//   lostTypes: [], // 损失根源 - 损失电量分解
//   lostTypesLoading: false,
//   stopElec: [], // 停机 - 损失电量
//   stopRank: [], // 停机 - 设备停机时长及次数
//   stopRankLoading: false,
//   stopTrend: [], // 停机  - 日月年 停机时长次数趋势图
//   stopTrendLoading: false,
//   stopTypes: [], // 停机 - 各类停机时长及次数
//   stopTypesLoading: false,

function *getLostRank(){ // 损失根源 - 指标排名
  const url = `${APIBasePath}${highAnalysis.getLostRank}`;
  try {
    const response = yield call(request.post, {
      url,
      data: {
        a: 1,
        b: 2,
      },
    });
  } catch (error) {

  }
}

function *getLostTrend(){ // 损失根源 - 指标趋势

}

function *getLostTypes(){ // 损失根源 - 损失电量分解

}

function *getStopElec(){ // 停机 - 损失电量

}

function *getStopRank(){ // 停机 - 设备停机时长及次数

}

function *getStopTrend(){ // 停机 - 日月年 停机时长次数趋势图

}

function *getStopTypes(){ // 停机 - 各类停机时长及次数

}

export function* watchStationAhieve() {
  yield takeLatest(stationAchieveAction.testStation, testStation);
}

