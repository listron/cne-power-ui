import {call, put, takeEvery} from 'redux-saga/effects';
import { faultSingleFanAction } from './faultSingleFanAction';
import Path from "../../../../constants/path";
import axios from "axios";

/***
 * 解析公共头APIBasePath
 * highAnalysis下面的接口
 */

const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      stationDeviceList,
      standAlone,
      similarityList,
      allFanResult,
      tenMinutesLine,
    }
  }} = Path;
// 处理数据
// 查出两个数组相同的数据
// 并且排在前面
// warnList有故障风机，allList所有风机
function getArrEqual(warnList, allList) {
  let newSameArr = []; // 相同数据
  let newDiffArr = []; // 相同数据
  let newArr; // 拼接好的数据
  // 取到相同的数据
  for (let i = 0; i < allList.length; i++) {
    for (let j = 0; j < warnList.length; j++) {
      if(allList[i].deviceName === warnList[j].deviceName){
        newSameArr.push(allList[j]);
      }
    }
  }
  // 取到不同的数据
  for(let i = 0; i < allList.length; i++){
    let obj = allList[i];
    let num = obj.deviceName;
    let isExist = false;
    for(let j = 0; j < warnList.length; j++){
      let aj = warnList[j];
      let n = aj.deviceName;
      if(n === num){
        isExist = true;
        break;
      }
    }
    if(!isExist){
      newDiffArr.push(obj);
    }
  }
  // 为数据相同的添加属性 1，不同的数据添加属性 2
  newArr = newSameArr.map(cur => {
    // 代表有故障
    return Object.assign(cur,{warnId: 1});
  }).concat(newDiffArr.map(cur => {
    // 代表无故障
    return Object.assign(cur,{warnId: 2});
  }));
  return newArr;
}
function* getStationDeviceList(action) { // 获取单电站所有风机
  const { payload } = action;
  const url = `${APIBasePath}${stationDeviceList}`;
  const warnFans = JSON.parse(localStorage.getItem("warnFans"));
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          stationDeviceList: getArrEqual(warnFans, response.data.data.context) || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}


function* getStandAloneList(action) { // 获取单风机自适应模块检测结果
  const { payload } = action;
  const url = `${APIBasePath}${standAlone}/${payload.taskId}/${payload.deviceFullCode}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          standAloneList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getSimilarityList(action) { // 获取风机相似性结果
  const { payload } = action;
  const url = `${APIBasePath}${similarityList}/${payload.taskId}/${payload.date}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          similarityList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getAllFanResultList(action) { // 获取多机协同模块检测结果-严重程度及识别（所有风机）
  const { payload } = action;
  const url = `${APIBasePath}${allFanResult}/${payload.taskId}/${payload.date}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          allFanResultList: response.data.data || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getTenMinutesBefore(action) { // 获取风机10分钟数据-前驱温度
  const { payload } = action;
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          tenMinutesBeforeList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getTenMinutesAfter(action) { // 获取风机10分钟数据-后驱温度
  const { payload } = action;
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          tenMinutesAfterList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getTenMinutesDiff(action) { // 获取风机10分钟数据-温度差
  const { payload } = action;
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          tenMinutesDiffList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false
      }
    });
  }
}

export function* watchFaultSingleFan() {
  yield takeEvery(faultSingleFanAction.getStationDeviceList, getStationDeviceList);
  yield takeEvery(faultSingleFanAction.getStandAloneList, getStandAloneList);
  yield takeEvery(faultSingleFanAction.getSimilarityList, getSimilarityList);
  yield takeEvery(faultSingleFanAction.getAllFanResultList, getAllFanResultList);
  yield takeEvery(faultSingleFanAction.getTenMinutesBefore, getTenMinutesBefore);
  yield takeEvery(faultSingleFanAction.getTenMinutesAfter, getTenMinutesAfter);
  yield takeEvery(faultSingleFanAction.getTenMinutesDiff, getTenMinutesDiff);

}
//
