import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../utils/request';
import {message} from 'antd';
import path from '../../../constants/path';
import {achieveAction} from './achieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

const colorArr = [
  ['#61bcae', '#167e65'],
  ['#90cce3', '#3d9cd9'],
  ['#dfb082', '#d0672f'],
  ['#c895d2', '#9445ab'],
  ['#80c6d4', '#2e91af'],
  ['#e38e8f', '#db4849'],
  ['#c8b9a8', '#94765b'],
  ['#91d1c7', '#3eaa91'],
  ['#e1cb40', '#d39b02'],
  ['#8e89cc', '#3d369a'],
  ['#b8d876', '#69a920'],
  ['#d89a84', '#c05740'],
  ['#e07ea6', '#d73c66'],
  ['#bbc214', '#9aa812'],
  ['#b3afd4', '#54509e'],
  ['#cfbb58', '#aa851e'],
  ['#b694df', '#7d4fd5'],
  ['#d490d8', '#b142c0'],
  ['#e5a9b7', '#d55367'],
  ['#8ebad9', '#4a82c3'],
];

function areaNameColor(data) {
  const obj = {};
  data && data.forEach((cur, index) => {
    obj[cur.regionName] = colorArr[index];
  });
  return obj;
}

function stationNameColor(data) {
  const obj = {};
  data && data.forEach(cur => {
    const { stations = [] } = cur;
    stations.forEach((item, index) => {
      obj[item.stationName] = colorArr[index];
    });
  });
  return obj;
}

function* getAreaStation() { // 用户所有区域与电站
  try {
    const url = `${APIBasePath}${highAnalysis.getAreaStation}`;
    const response = yield call(request.post, url, {stationType: 0});
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {
          areaStation: response.data,
          areaColorData: areaNameColor(response.data),
          stationColorData: stationNameColor(response.data),
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: achieveAction.changeStore,
      payload: {areaStation: []},
    });
    message.error('获取区域信息失败, 请刷新重试!');
  }
}

function* getQuotaInfo() { // 可选指标信息
  try {
    const url = `${APIBasePath}${highAnalysis.getQuotaInfo}`;
    const response = yield call(request.post, url);
    const quotaInfo = response.data.map(e => ({
      value: e.indicatorCode,
      label: e.indicatorName,
      unit: e.unitName,
      pointLength: e.pointLength,
      children: (e.children && e.children.length > 0) ? e.children.map(m => ({
        value: m.indicatorCode,
        label: m.indicatorName,
        unit: e.unitName,
        pointLength: e.pointLength,
      })) : undefined,
    }));
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: { quotaInfo },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: achieveAction.changeStore,
      payload: {quotaInfo: []},
    });
    message.error('获取指标失败, 请刷新重试!');
  }
}

export function* watchAchieveLayout() {
  yield takeLatest(achieveAction.getAreaStation, getAreaStation);
  yield takeLatest(achieveAction.getQuotaInfo, getQuotaInfo);
}

