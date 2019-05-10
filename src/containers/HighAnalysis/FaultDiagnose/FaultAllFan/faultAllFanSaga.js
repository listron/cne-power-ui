import {call, put, takeEvery} from 'redux-saga/effects';
import {faultAllFanAction} from './faultAllFanAction.js';
import Path from "../../../../constants/path";
import axios from "axios";
import { message } from "antd";
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
      stationDeviceList,
      resetTask,
      faultTaskList,
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
      if(allList[i].deviceName === warnList[j].deviceName){
        newSameArr.push(allList[i]);
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 调用任务详情
      const taskId = localStorage.getItem("taskId");
      const params = {
        taskId,
        deviceList: getArrEqual(warnFans, response.data.data.context) || []
      };
      yield put({
        type: faultAllFanAction.getFaultInfo,
        payload: params,
      });
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          stationDeviceList: getArrEqual(warnFans, response.data.data.context) || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getResetTask(action) { // 重新执行
  const { payload } = action;
  const url = `${APIBasePath}${resetTask}/${payload.taskId}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      message.success("重新执行成功");
    }else {
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
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
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).add(1, "days").utc().format()
      };
      // 发电机后驱温度
      const  afterParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN011", //前驱测点-固定字段
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).add(1, "days").utc().format()
      };
      // 发电机温度差
      const diffParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN010-GN011", //前驱测点-固定字段
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(response.data.data.endTime).subtract(1,'months').utc().format(),
        endTime: moment(response.data.data.endTime).add(1, "days").utc().format()
      };
      // 单机自适应
      // 单风机设备全编码
      const fullCode = localStorage.getItem("deviceFullCode");
      const aloneParams = {
        taskId: response.data.data.taskId,
        //  默认本地，如果没有取数组的第一条
        deviceFullCode: fullCode || payload.deviceList[0].deviceFullCode
      };
      // 相似性热图和所有风机
      const heatAndFansParams = {
        taskId: response.data.data.taskId,
        date: response.data.data.endTime
      };
      yield put({
        type: faultAllFanAction.getAllFanResultList,
        payload: heatAndFansParams
      });
      yield put({
        type: faultAllFanAction.getStandAloneList,
        payload: aloneParams
      });
      yield put({
        type: faultAllFanAction.getSimilarityList,
        payload: heatAndFansParams
      });
      yield put({
        type: faultAllFanAction.getTenMinutesDiff,
        payload: diffParams
      });
      yield put({
        type: faultAllFanAction.getTenMinutesAfter,
        payload: afterParams
      });
      yield put({
        type: faultAllFanAction.getTenMinutesBefore,
        payload: preParams
      });
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          faultInfo: response.data.data || {},
          faultInfoMessage: response.data.executeMessage || "",
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getFaultReport(action) { // 获取历史预警报告
  const { payload } = action;
  const url = `${APIBasePath}${faultTaskList}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        pageSize: payload.pageSize ? payload.pageSize : 10,
        pageNum: payload.pageNum ? payload.pageNum : 1,
        sortField: payload.sortField,
        sortMethod: payload.sortMethod
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          faultReportInfo: response.data.data || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        aloneLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        heatLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        allLoading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        preLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          preTimeCompare: moment().unix(),
          tenMinutesBeforeList: response.data.data || [],
          loading: false,
          preLoading: false
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        afterLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false,
        afterLoading: true
      }
    });
  }
}

function* getTenMinutesDiff(action) { // 获取风机10分钟数据-温度差
  const { payload } = action;
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true,
        diffLoading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false,
        diffLoading: false
      }
    });
  }
}

export function* watchFaultAllFan() {
  yield takeEvery(faultAllFanAction.getStationDeviceList, getStationDeviceList);
  yield takeEvery(faultAllFanAction.getResetTask, getResetTask);
  yield takeEvery(faultAllFanAction.getFaultInfo, getFaultInfo);
  yield takeEvery(faultAllFanAction.getFaultReport, getFaultReport);
  yield takeEvery(faultAllFanAction.getStandAloneList, getStandAloneList);
  yield takeEvery(faultAllFanAction.getSimilarityList, getSimilarityList);
  yield takeEvery(faultAllFanAction.getAllFanResultList, getAllFanResultList);
  yield takeEvery(faultAllFanAction.getTenMinutesBefore, getTenMinutesBefore);
  yield takeEvery(faultAllFanAction.getTenMinutesAfter, getTenMinutesAfter);
  yield takeEvery(faultAllFanAction.getTenMinutesDiff, getTenMinutesDiff);

}
//
