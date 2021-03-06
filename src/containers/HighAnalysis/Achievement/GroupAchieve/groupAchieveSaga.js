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
          value: `${cur.manufactorId}-${m.deviceModeCode}`,
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
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupCapacityLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
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
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupRankLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
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
    message.error('获取排名失败, 请刷新重试!');
  }
}

function* getGroupTrendInfo(action) { // 指标趋势 PBA趋势
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getTrendInfo}`;
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupTrendLoading: true,
        groupTimeStatus: payload.type,
      },
    });
    const response = yield call(request.post, url, payload);
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
    message.error('获取趋势失败, 请刷新重试!');
  }
}

function* getGroupLostGenHour(action) { // 损失电量分解图
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getLostGenHour}`;
    yield put({
      type: groupAchieveAction.changeStore,
      payload: {
        groupLoseLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: groupAchieveAction.fetchSuccess,
        payload: {
          groupLostGenHourInfo: response.data || {
            detailList: null,
            theoryGen: null,
            actualGen: null,
          },
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

