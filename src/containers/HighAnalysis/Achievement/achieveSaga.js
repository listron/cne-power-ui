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
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(request.post, url);
    // 替换的键值对映射
    const keyMap = {
      'indicatorCode': 'value',
      'indicatorName': 'label',
    };
    if (response.code === '10000') {
      yield put({
        type: achieveAction.fetchSuccess,
        payload: {
          quotaInfo: convertKey(response.data.dataList, keyMap) || [],
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
}

