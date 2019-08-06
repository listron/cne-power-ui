import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../../utils/request';
import {message} from 'antd';
import path from '../../../../constants/path';
import {areaAchieveAction} from './areaAchieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

function* getIndicatorRankTotal(action) { // 指标汇总数据
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getIndicatorRankTotal}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          rankTotal: response.data.dataList || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取装机容量失败, 请刷新重试!');
  }
}

function* getStationCapacity(action) { // 各电站装机容量
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getStationCapacity}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          capacityInfo: response.data,
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取装机容量失败, 请刷新重试!');
  }
}

function* getIndicatorRank(action) { // 风电指标数据 PBA排名
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getIndicatorRank}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          indicatorRankInfo: response.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取PBA排名失败, 请刷新重试!');
  }
}


function* getTrendInfo(action) { // 风电指标趋势 PBA趋势
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getTrendInfo}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          trendInfo: response.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取PBA趋势失败, 请刷新重试!');
  }
}

function formatData(data) {
  const basicArr = []; //基础数据
  const dataArr = []; // 原始数据
  const {
    actualGen, // 实发小时数
    courtGen, // 场外因素
    deratingGen, // 阵容损失
    faultGen, // 风机故障
    otherGen, // 其他损失
    planShutdownGen, // 计划停机
    substationGen, //变电故障
    theoryGen, // 应发
  } = data;
  dataArr.push(
    Number(theoryGen),
    Number(deratingGen),
    Number(faultGen),
    Number(substationGen),
    Number(courtGen),
    Number(planShutdownGen),
    Number(otherGen),
    Number(actualGen)
  );
  // 应发小时和实发小时从0开始
  basicArr.push(
    0,
    Number(deratingGen) + Number(actualGen) + Number(actualGen) + Number(courtGen) + Number(substationGen) + Number(faultGen) + Number(deratingGen),
    Number(deratingGen) + Number(actualGen) + Number(actualGen) + Number(courtGen) + Number(substationGen) + Number(faultGen),
    Number(deratingGen) + Number(actualGen) + Number(actualGen) + Number(courtGen) + Number(substationGen),
    Number(deratingGen) + Number(actualGen) + Number(actualGen) + Number(courtGen),
    Number(deratingGen) + Number(actualGen) + Number(actualGen),
    Number(deratingGen) + Number(actualGen),
    Number(actualGen),
    0
  );
  return {
    dataArr,
    basicArr,
  };
}

function* getLostGenHour(action) { // 损失电量分解图
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getLostGenHour}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          lostGenHourInfo: formatData(response.data) || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取损失电量失败, 请刷新重试!');
  }
}

export function* watchAreaAchieve() {
  yield takeLatest(areaAchieveAction.getStationCapacity, getStationCapacity);
  yield takeLatest(areaAchieveAction.getLostGenHour, getLostGenHour);
  yield takeLatest(areaAchieveAction.getTrendInfo, getTrendInfo);
  yield takeLatest(areaAchieveAction.getIndicatorRank, getIndicatorRank);
  yield takeLatest(areaAchieveAction.getIndicatorRankTotal, getIndicatorRankTotal);
}

