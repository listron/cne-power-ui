import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import moment from 'moment';
import { message } from 'antd';
import path from '../../../../constants/path';
import { groupAchieveAction } from './groupAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function* getGroupModesInfo(action) { // 可选机型
  const { payload = {} } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getModesInfo}`;
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      const modesInfo = response.data && response.data.map(cur => ({
        value: parseInt(cur.manufactorId, 0),
        label: cur.manufactorName,
        children: (cur.deviceModesList && cur.deviceModesList.length > 0) ? cur.deviceModesList.map(m => ({
          value: m.deviceModeCode,
          label: m.deviceModeName,
        })) : [],
      }));
      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          modesInfo: modesInfo,
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {quotaInfo: []},
    });
    message.error('获取机型失败, 请刷新重试!');
  }
}

function* getGroupCapacity(action) { // 各区域分布图
  const { payload = {} } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getGroupCapacity}`;
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(request.post, url, payload);
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupCapacityLoading: true,
      },
    });
    if (response.code === '10000') {
      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          groupCapacityInfo: response.data,
          groupCapacityLoading: false,
          groupCapacityTime: moment().unix(),
        },
      });
    } else {
      yield put({
        type: groupAchieveAction.changeStore,
        payload: {
          groupCapacityLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupCapacityLoading: false,
      },
    });
    message.error('获取机型失败, 请刷新重试!');
  }
}

function* getGroupRank(action) { // 风电指标数据 PBA排名
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getGroupRank}`;
    const response = yield call(request.post, url, payload);
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupRankLoading: true,
      },
    });
    if (response.code === '10000') {
      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          groupRankInfo: response.data || [],
          groupRankTime: moment().unix(),
          groupRankLoading: false,
        },
      });
    } else {
      yield put({
        type: groupAchieveAction.changeStore,
        payload: {
          groupRankLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupRankLoading: false,
      },
    });
    message.error('获取PBA排名失败, 请刷新重试!');
  }
}

function* getGroupTrendInfo(action) { // 指标趋势 PBA趋势
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getTrendInfo}`;
    const response = yield call(request.post, url, payload);
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupTrendLoading: true,
        groupTimeStatus: payload.type,
      },
    });
    if (response.code === '10000') {

      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          groupTrendInfo: response.data || [],
          groupTrendTime: moment().unix(),
          groupTrendLoading: false,
        },
      });
    } else {
      yield put({
        type: groupAchieveAction.changeStore,
        payload: {
          groupTrendLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupTrendLoading: false,
      },
    });
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

function* getGroupLostGenHour(action) { // 损失电量分解图
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getLostGenHour}`;
    const response = yield call(request.post, url, payload);
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupLoseLoading: true,
      },
    });
    if (response.code === '10000') {
      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          groupLostGenHourInfo: formatData(response.data) || {},
          groupLostTime: moment().unix(),
          groupLoseLoading: false,
        },
      });
    } else {
      yield put({
        type: groupAchieveAction.changeStore,
        payload: {
          groupLoseLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupLoseLoading: false,
      },
    });
    message.error('获取损失电量失败, 请刷新重试!');
  }
}

export function* watchGroupAchieve() {
  yield takeLatest(groupAchieveAction.getGroupModesInfo, getGroupModesInfo);
  yield takeLatest(groupAchieveAction.getGroupCapacity, getGroupCapacity);
  yield takeLatest(groupAchieveAction.getGroupRank, getGroupRank);
  yield takeLatest(groupAchieveAction.getGroupTrendInfo, getGroupTrendInfo);
  yield takeLatest(groupAchieveAction.getGroupLostGenHour, getGroupLostGenHour);
}

