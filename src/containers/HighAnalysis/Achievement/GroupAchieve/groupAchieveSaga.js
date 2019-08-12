import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import { message } from 'antd';
import path from '../../../../constants/path';
import { groupAchieveAction } from './groupAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function convertKey (arr, keyMap) {
  const data = arr.map(cur => {
    const obj = {};
    obj.manufactorId = parseInt(cur.manufactorId, 0);
    obj.manufactorName = cur.manufactorName;
    obj.deviceModesList = cur.deviceModesList;
    return obj;
  });
  let tempString = JSON.stringify(data);
  for(const key in keyMap){
    if(keyMap.hasOwnProperty(key)){
      const reg = `/"${key}":/g`;
      tempString = tempString.replace(eval(reg), '"'+keyMap[key]+'":');
    }
  }
  return JSON.parse(tempString);
}

function* getGroupModesInfo(action) { // 可选机型
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
        type: groupAchieveAction.fetchSuccess,
        payload: {
          modesInfo: response.data && response.data.length > 0 ? convertKey(response.data, keyMap) : [],
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

export function* watchGroupAchieve() {
  yield takeLatest(groupAchieveAction.getGroupModesInfo, getGroupModesInfo);
}

