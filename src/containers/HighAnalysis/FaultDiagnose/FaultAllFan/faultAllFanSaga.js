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
      resetTask,
      faultTaskList,
      standAlone,
      similarityList,
      allFanResult,
      tenMinutesLine,
      faultInfo
    }
  }} = Path;

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
  const url = `${APIBasePath}${faultInfo}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 故障日期时间
      const dateArr = response.data.data.deviceDatas[0].date && response.data.data.deviceDatas[0].date.split(",");
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
      const aloneParams = {
        taskId: response.data.data.taskId,
        // 取数组的第一条
        deviceFullCode: response.data.data.deviceDatas[0].deviceFullcode
      };
      // 相似性热图和所有风机
      const heatAndFansParams = {
        taskId: response.data.data.taskId,
        date: !response.data.data.deviceDatas[0].date ? response.data.data.endTime : dateArr[dateArr.length - 1]
      };
      // 任务执行失败不请求接口
      if (response.data.data.status !== 4) {
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
        // 判断当前type === 1 再发请求
        if (Number(response.data.data.deviceDatas[0].type) === 1) {
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
        }
      }
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          faultInfo: response.data.data || {},
          warnId: Number(response.data.data.deviceDatas[0].type),
          deviceName: response.data.data.deviceDatas[0].deviceName,
          faultDate: !response.data.data.deviceDatas[0].date ? response.data.data.endTime : dateArr[dateArr.length - 1],
          faultDateList: response.data.data.deviceDatas[0].date,
          faultInfoMessage: response.data.data.executeMessage || "",
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
      type: faultAllFanAction.changeFaultAllFanStore,
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
      // 判断是否有数据
      if(!beforeTimeData) {
        beforeTimeData = response.data.data;
      }
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          preTimeCompare: moment().unix(),
          tenMinutesBeforeList: response.data.data || [],
          beforeTimeData: dateFunc(beforeTimeData),
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

let afterTimeData = null; // 保存风机10分钟数据-后驱温度时间轴
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
      // 判断是否有数据
      if(!afterTimeData) {
        afterTimeData = response.data.data;
      }
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false,
        afterLoading: true
      }
    });
  }
}

let diffTimeData = null; // 保存风机10分钟数据-温度差
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
      // 判断是否有数据
      if(!diffTimeData) {
        diffTimeData = response.data.data;
      }
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
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
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: false,
        diffLoading: false
      }
    });
  }
}

export function* watchFaultAllFan() {
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
