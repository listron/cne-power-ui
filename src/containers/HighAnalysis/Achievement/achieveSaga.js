import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../utils/request';
import {message} from 'antd';
import path from '../../../constants/path';
import {achieveAction} from './achieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

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
  '#298a00',
  '#007d87',
  '#036cc0',
  '#0074b6',
  '#471397',
  '#8669be',
  '#a808ab',
  '#b01188',
  '#a42f4e',
  '#ab4a5f',
  '#cd27a1',
  '#b41cb3',
  '#9986c7',
  '#6b27bb',
  '#0078cd',
  '#0088da',
  '#00a7ae',
  '#4ab00c',
  '#95c005',
  '#d6bf03',
  '#d68603',
  '#ae7e08',
  '#d64703',
  '#d31338',
  '#fa0333',
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
  const arr = [];// 保存电站名称
  data && data.forEach(cur => {
    cur.stations && cur.stations.forEach(item => {
      arr.push(item.stationName);
    });
  });
  //遍历电站名称
  arr && arr.forEach((cur, index) => {
    obj[cur] = colorArr[index];
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

