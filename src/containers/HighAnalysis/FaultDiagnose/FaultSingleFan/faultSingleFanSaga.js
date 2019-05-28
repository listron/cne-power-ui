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
      standAlone,
      similarityList,
      allFanResult,
      tenMinutesLine,
      faultInfo
    }
  }} = Path;

function* getFaultInfo(action) { // 获取故障预警任务详情
  const { payload } = action;
  const url = `${APIBasePath}${faultInfo}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 结束日期和结束列表
      const { endTime, algModeDatas } = response.data.data;
      // 故障日期时间
      const dateArr = algModeDatas && algModeDatas[0].date.split(",");
      // 判断如果algModeDatas有数据
      const timeValue = algModeDatas && algModeDatas[0].date ? dateArr[dateArr.length - 1] : endTime;
      // 发电机前驱温度
      const  preParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN010", //前驱测点-固定字段
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(timeValue).subtract(1,'months').utc().format(),
        endTime: moment(timeValue).add(1, "days").utc().format(),
        queryFlag: true // 判断是否重新存贮时间轴
      };
      // 发电机后驱温度
      const  afterParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN011", //前驱测点-固定字段
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(timeValue).subtract(1,'months').utc().format(),
        endTime: moment(timeValue).add(1, "days").utc().format(),
        queryFlag: true // 判断是否重新存贮时间轴
      };
      // 发电机温度差
      const diffParams = {
        stationCode: response.data.data.stationCode,
        pointCode: "GN010-GN011", //前驱测点-固定字段
        deviceFullcodes: [], // 默认传空代表所有风机
        startTime: moment(timeValue).subtract(1,'months').utc().format(),
        endTime: moment(timeValue).add(1, "days").utc().format(),
        queryFlag: true // 判断是否重新存贮时间轴
      };
      const deviceName = localStorage.getItem("deviceName");
      // 单机自适应
      // 单风机设备全编码
      const deviceFullcode = localStorage.getItem("deviceFullCode");
      const aloneParams = {
        taskId: response.data.data.taskId,
        deviceFullCode: deviceFullcode
      };
      // 相似性热图和所有风机
      const heatAndFansParams = {
        taskId: response.data.data.taskId,
        date: timeValue
      };
      // 任务执行失败不请求接口
      if (response.data.data.status !== 4) {
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
        // 判断当前type === 1 再发请求
        if (Number(response.data.data.algModeDatas[0].type) === 1) {
          yield put({
            type: faultSingleFanAction.getAllFanResultList,
            payload: heatAndFansParams
          });
          yield put({
            type: faultSingleFanAction.getStandAloneList,
            payload: aloneParams
          });
          yield put({
            type: faultSingleFanAction.getSimilarityList,
            payload: heatAndFansParams
          });
        }
      }
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          faultInfo: response.data.data || {},
          deviceName: deviceName,
          warnId: Number(response.data.data.algModeDatas[0].type),
          faultDate: timeValue,
          faultDateList: response.data.data.algModeDatas[0].date,
          faultInfoMessage: response.data.data.executeMessage || "",
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
          allFanResultList: response.data.data || {
            cfResidual: {
              residual: []
            },
            cfStd1: [],
            cfStd2: [],
            cfStd3 : []
          },
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

// 温度处理时间
function dateFunc(arr) {
  return arr[0].dataList && arr[0].dataList.map(cur => {
    return moment(cur.timeStamp).format("YYYY-MM-DD HH:mm:ss");
  });
}

let beforeTimeData = null; // 保存风机10分钟数据-前驱温度时间轴
function* getTenMinutesBefore(action) { // 获取风机10分钟数据-前驱温度
  const { payload: {
    stationCode,
    pointCode, //前驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime,
    queryFlag
  } } = action;
  // 参数
  const params = {
    stationCode,
    pointCode, //前驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime,
  };
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true,
        preLoading: true
      }
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      // queryFlag === true 重新储存数据
      if (queryFlag) {
        // 储存数据
        beforeTimeData = response.data.data;
      }
      // queryFlag === false 储存数据
      if (!queryFlag) {
        // 判断有无数据
        if(!beforeTimeData) {
          beforeTimeData = response.data.data;
        }
      }
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          tenMinutesBeforeList: response.data.data || [],
          preTimeCompare: moment().unix(),
          beforeTimeData: dateFunc(beforeTimeData),
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

let afterTimeData = null; // 保存风机10分钟数据-后驱温度时间轴
function* getTenMinutesAfter(action) { // 获取风机10分钟数据-后驱温度
  const { payload: {
    queryFlag,
    stationCode,
    pointCode, //后驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime,
  } } = action;
  // 参数
  const params = {
    stationCode,
    pointCode, //后驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime,
  };
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true,
        afterLoading: true
      }
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      // queryFlag === true 重新储存数据
      if (queryFlag) {
        // 储存数据
        afterTimeData = response.data.data;
      }
      // queryFlag === false 储存数据
      if (!queryFlag) {
        // 判断有无数据
        if(!afterTimeData) {
          afterTimeData = response.data.data;
        }
      }
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          afterTimeCompare: moment().unix(),
          tenMinutesAfterList: response.data.data || [],
          afterTimeData: dateFunc(afterTimeData),
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

let diffTimeData = null; // 保存风机10分钟数据-温度差
function* getTenMinutesDiff(action) { // 获取风机10分钟数据-温度差
  const { payload: {
    stationCode,
    pointCode, //前驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime,
    queryFlag
  } } = action;
  // 参数
  const params = {
    stationCode,
    pointCode, //前驱测点-固定字段
    deviceFullcodes, // 默认传空代表所有风机
    startTime,
    endTime
  };
  const url = `${APIBasePath}${tenMinutesLine}`;
  try {
    yield put({
      type: faultSingleFanAction.changeSingleFanStore,
      payload: {
        loading: true,
        diffLoading: true
      }
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      // queryFlag === true 重新储存数据
      if (queryFlag) {
        // 储存数据
        diffTimeData = response.data.data;
      }
      // queryFlag === false 储存数据
      if (!queryFlag) {
        // 判断有无数据
        if(!diffTimeData) {
          diffTimeData = response.data.data;
        }
      }
      yield put({
        type: faultSingleFanAction.changeSingleFanStore,
        payload: {
          diffTimeCompare: moment().unix(),
          tenMinutesDiffList: response.data.data || [],
          diffTimeData: dateFunc(diffTimeData),
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
  yield takeEvery(faultSingleFanAction.getStandAloneList, getStandAloneList);
  yield takeEvery(faultSingleFanAction.getSimilarityList, getSimilarityList);
  yield takeEvery(faultSingleFanAction.getAllFanResultList, getAllFanResultList);
  yield takeEvery(faultSingleFanAction.getTenMinutesBefore, getTenMinutesBefore);
  yield takeEvery(faultSingleFanAction.getTenMinutesAfter, getTenMinutesAfter);
  yield takeEvery(faultSingleFanAction.getTenMinutesDiff, getTenMinutesDiff);
  yield takeEvery(faultSingleFanAction.getFaultInfo, getFaultInfo);

}
//
