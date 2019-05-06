import {call, put, takeEvery} from 'redux-saga/effects';
import { faultSingleFanAction } from './faultSingleFanAction';
import Path from "../../../../constants/path";
import axios from "axios";
import moment from "moment";

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
      algoOptionList,
      standAlone,
      similarityList,
      allFanResult,
      tenMinutesLine,
      faultInfo
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
      if(allList[i].algorithmName === warnList[j].algorithmName){
        newSameArr.push(allList[i]);
      }
    }
  }
  // 取到不同的数据
  for(let i = 0; i < allList.length; i++){
    let obj = allList[i];
    let num = obj.algorithmName;
    let isExist = false;
    for(let j = 0; j < warnList.length; j++){
      let aj = warnList[j];
      let n = aj.algorithmName;
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
function* getStationDeviceList(action) { // 获取单风机所有算法模型
  const { payload } = action;
  const url = `${APIBasePath}${algoOptionList}`;
  const faultList = JSON.parse(localStorage.getItem("faultList"));
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
          stationDeviceList: getArrEqual(faultList, response.data.data) || [],
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

function* getFaultInfo(action) { // 获取故障预警任务详情
  const { payload } = action;
  const url = `${APIBasePath}${faultInfo}/${payload.taskId}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      // 发电机前驱温度
      const  preParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN010", //前驱测点-固定字段
        deviceFullCodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).utc().format()
      };
      // 发电机后驱温度
      const  afterParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN011", //前驱测点-固定字段
        deviceFullCodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).utc().format()
      };
      // 发电机温度差
      const diffParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN010-GN011", //前驱测点-固定字段
        deviceFullCodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).utc().format()
      };
      // 相似性热图和所有风机
      const heatAndFansParams = {
        taskId: response.data.data.taskId,
        date: response.data.data.endTime
      };
      yield put({
        type: faultSingleFanAction.getAllFanResultList,
        payload: heatAndFansParams
      });
      yield put({
        type: faultSingleFanAction.getSimilarityList,
        payload: heatAndFansParams
      });
      yield put({
        type: faultSingleFanAction.getTenMinutesDiff,
        payload: diffParams
      });
      yield put({
        type: faultSingleFanAction.getTenMinutesAfter,
        payload: afterParams
      });
      yield put({
        type: faultSingleFanAction.getTenMinutesBefore,
        payload: preParams
      });
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          faultInfo: response.data.data || {},
          faultInfoMessage: response.data.message || "",
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
        loading: true,
        aloneLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          aloneTimeCompare: moment().unix(),
          standAloneList: response.data.data || [],
          loading: false,
          aloneLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        aloneLoading: false
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
        loading: true,
        heatLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          heatTimeCompare: moment().unix(),
          similarityList: response.data.data || [],
          loading: false,
          heatLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        heatLoading: false
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
        loading: true,
        allLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          allTimeCompare: moment().unix(),
          allFanResultList: response.data.data || {},
          loading: false,
          allLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        allLoading: false
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
        loading: true,
        preLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          tenMinutesBeforeList: response.data.data || [],
          preTimeCompare: moment().unix(),
          loading: false,
          preLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        preLoading: false
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
        loading: true,
        afterLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          afterTimeCompare: moment().unix(),
          tenMinutesAfterList: response.data.data || [],
          loading: false,
          afterLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        afterLoading: false
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
        loading: true,
        diffLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          diffTimeCompare: moment().unix(),
          tenMinutesDiffList: response.data.data || [],
          loading: false,
          diffLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: false,
        diffLoading: false
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
  yield takeEvery(faultSingleFanAction.getFaultInfo, getFaultInfo);

}
//
