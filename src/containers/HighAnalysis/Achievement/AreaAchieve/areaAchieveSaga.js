import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../../utils/request';
import {message} from 'antd';
import path from '../../../../constants/path';
import {areaAchieveAction} from './areaAchieveReducer';
import moment from 'moment';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

function* getModesInfo(action) { // 可选机型
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
        type: areaAchieveAction.fetchSuccess,
        payload: {
          modesInfo: modesInfo,
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {quotaInfo: []},
    });
    message.error('获取机型失败, 请刷新重试!');
  }
}

function* getIndicatorRankTotal(action) { // 指标汇总数据
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getIndicatorRankTotal}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          rankTotal: response.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取装机容量失败, 请刷新重试!');
  }
}

const colorArr = [
  '#8c0a3a',
  '#8a086b',
  '#8c0392',
  '#735daf',
  '#2d0085',
  '#006497',
  '#004f9f',
  '#034753',
  '#135600',
  '#4c7400',
  '#9a7d00',
  '#9b4c00',
  '#834e00',
  '#9a1a03',
  '#950027',
  '#c50538',
  '#e51c48',
  '#b8002d',
  '#bc2d00',
  '#9f6705',
  '#bc6900',
  '#bca103',
  '#729f00',
];

function colorCapacityFunc(data) {
  const obj = {};
  data && data.forEach((cur, index) => {
    obj[cur.stationName] = colorArr[index];
  });
  return obj;
}

function* getStationCapacity(action) { // 各电站装机容量
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getStationCapacity}`;
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        capacityLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          capacityInfo: response.data,
          colorData: colorCapacityFunc(response.data),
          capacityTime: moment().unix(),
          capacityLoading: false,
        },
      });
    } else {
      yield put({
        type: areaAchieveAction.changeStore,
        payload: {
          capacityLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        capacityLoading: false,
      },
    });
    message.error('获取装机容量失败, 请刷新重试!');
  }
}

function* getIndicatorRank(action) { // 风电指标数据 PBA排名
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getIndicatorRank}`;
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        rankLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          indicatorRankInfo: response.data || [],
          colorData: colorCapacityFunc(response.data),
          rankTime: moment().unix(),
          rankLoading: false,
        },
      });
    } else {
      yield put({
        type: areaAchieveAction.changeStore,
        payload: {
          rankLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        rankLoading: false,
      },
    });
    message.error('获取排名失败, 请刷新重试!');
  }
}


function* getTrendInfo(action) { // 风电指标趋势 PBA趋势
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getTrendInfo}`;
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        trendLoading: true,
        timeStatus: payload.type,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {

      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          trendInfo: response.data || [],
          trendTime: moment().unix(),
          trendLoading: false,
        },
      });
    } else {
      yield put({
        type: areaAchieveAction.changeStore,
        payload: {
          trendLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        trendLoading: false,
      },
    });
    message.error('获取趋势失败, 请刷新重试!');
  }
}

function* getLostGenHour(action) { // 损失电量分解图
  const {payload} = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getLostGenHour}`;
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        loseLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          lostGenHourInfo: response.data || {
            detailList: null,
            theoryGen: null,
            actualGen: null,
          },
          lostTime: moment().unix(),
          loseLoading: false,
        },
      });
    } else {
      yield put({
        type: areaAchieveAction.changeStore,
        payload: {
          loseLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: areaAchieveAction.changeStore,
      payload: {
        loseLoading: false,
      },
    });
    message.error('获取损失电量失败, 请刷新重试!');
  }
}

function* getDeviceType(action) { // 查询指定电站的设备型号
  const { payload } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getDevices}`;
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: areaAchieveAction.fetchSuccess,
        payload: {
          deviceData: response.data.dataList || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取设备型号失败, 请刷新重试!');
  }
}

export function* watchAreaAchieve() {
  yield takeLatest(areaAchieveAction.getStationCapacity, getStationCapacity);
  yield takeLatest(areaAchieveAction.getLostGenHour, getLostGenHour);
  yield takeLatest(areaAchieveAction.getTrendInfo, getTrendInfo);
  yield takeLatest(areaAchieveAction.getIndicatorRank, getIndicatorRank);
  yield takeLatest(areaAchieveAction.getIndicatorRankTotal, getIndicatorRankTotal);
  yield takeLatest(areaAchieveAction.getModesInfo, getModesInfo);
  yield takeLatest(areaAchieveAction.getDeviceType, getDeviceType);
}

