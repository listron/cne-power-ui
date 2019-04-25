import {call, put, takeEvery} from 'redux-saga/effects';
import {faultAllFanAction} from './faultAllFanAction.js';
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
      resetTask,
      warnHistory,
      faultTaskList,
      standAlone,
      similarityList,
      allFanResult
    }
  }} = Path;

function* getStationDeviceList(action) { // 获取单电站所有风机
  const { payload } = action;
  const url = `${APIBasePath}${stationDeviceList}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          stationDeviceList: response.data.data || {},
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
      console.log("-=-=-=-=-");
      // yield put({
      //   type: faultAllFanAction.changeFaultAllFanStore,
      //   payload: {
      //     stationDeviceList: response.data.data || {},
      //     loading: false,
      //   },
      // });
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

function* getFaultInfo(action) { // 获取历史预警列表--这里是故障详情训练开始时间。。。
  const { payload } = action;
  const url = `${APIBasePath}${warnHistory}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          faultInfo: response.data.data || {},
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
  const {payload} = action;
  const url = `${APIBasePath}${faultTaskList}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
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
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          standAloneList: response.data.data || [],
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

function* getSimilarityList(action) { // 获取风机相似性结果
  const { payload } = action;
  const url = `${APIBasePath}${similarityList}/${payload.taskId}/${payload.date}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      console.log(response.data, "response.data");
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          similarityList: response.data.data || [],
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

function* getAllFanResultList(action) { // 获取多机协同模块检测结果-严重程度及识别（所有风机）
  const { payload } = action;
  const url = `${APIBasePath}${allFanResult}/${payload.taskId}/${payload.date}`;
  try {
    yield put({
      type: faultAllFanAction.changeFaultAllFanStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      console.log(response.data, "response.data");
      yield put({
        type: faultAllFanAction.changeFaultAllFanStore,
        payload: {
          allFanResultList: response.data.data || {},
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

export function* watchFaultAllFan() {
  yield takeEvery(faultAllFanAction.getStationDeviceList, getStationDeviceList);
  yield takeEvery(faultAllFanAction.getResetTask, getResetTask);
  yield takeEvery(faultAllFanAction.getFaultInfo, getFaultInfo);
  yield takeEvery(faultAllFanAction.getFaultReport, getFaultReport);
  yield takeEvery(faultAllFanAction.getStandAloneList, getStandAloneList);
  yield takeEvery(faultAllFanAction.getSimilarityList, getSimilarityList);
  yield takeEvery(faultAllFanAction.getAllFanResultList, getAllFanResultList);

}
//
