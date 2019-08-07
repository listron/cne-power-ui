import {call, put, takeLatest} from 'redux-saga/effects';
import request from '../../../utils/request';
import {message} from 'antd';
import path from '../../../constants/path';
import {achieveAction} from './achieveReducer';

const {APIBasePath} = path.basePaths;
const {highAnalysis} = path.APISubPaths;

function* getAreaStation() { // 用户所有区域与电站
  try {
    const url = `${APIBasePath}${highAnalysis.getAreaStation}`;
    const response = yield call(request.post, url, {stationType: 0});
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {areaStation: response.data},
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

function convertKey (arr, keyMap) {
  let tempString = JSON.stringify(arr);
  for(const key in keyMap){
    if(keyMap.hasOwnProperty(key)){
      const reg = `/"${key}":/g`;
      tempString = tempString.replace(eval(reg), '"'+keyMap[key]+'":');
    }
  }
  return JSON.parse(tempString);
}

function* getQuotaInfo() { // 可选指标信息
  try {
    const url = `${APIBasePath}${highAnalysis.getQuotaInfo}`;
    const response = yield call(request.post, url);
    const quotaInfo = response.data.map(e => ({
      value: e.indicatorCode,
      label: e.indicatorName,
      children: (e.children && e.children.length > 0) ? e.children.map(m => ({
        value: m.indicatorCode,
        label: m.indicatorName,
      })) : [],
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

function* getModesInfo(action) { // 可选指标信息
  const { payload = {} } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getModesInfo}`;
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(request.post, url, payload);
    // 替换的键值对映射
    const keyMap = {
      'manufactorId': 'value',
      'manufactorName': 'label',
      'deviceModesList': 'children',
      'deviceModeName': 'label',
      'deviceModeCode': 'value',
    };
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {
          modesInfo: response.data && response.data.length > 0 ? convertKey(response.data, keyMap) : [],
        },
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
  yield takeLatest(achieveAction.getModesInfo, getModesInfo);
}

