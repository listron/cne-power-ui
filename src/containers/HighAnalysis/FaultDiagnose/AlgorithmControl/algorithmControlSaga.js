import {put, takeEvery, call} from 'redux-saga/effects';
import { algorithmControlAction } from './algorithmControlAction';
import Path from "../../../../constants/path";
import axios from "axios";
import { message } from "antd";


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      algoList,
      algoOptionList,
      addWarnTask,
      faultTaskList
    }
  }} = Path;

// 格式化数据
function dataFormat(data) {
  let largeSizeArr = []; // 大部件
  let natureArr = []; // 性能预警
  let healthArr = []; // 设备健康
  data && data.map(cur => {
    if (cur.mainModule === "大部件") {
      largeSizeArr.push(cur);
    }
    if (cur.mainModule === "性能预警") {
      natureArr.push(cur);
    }
    if (cur.mainModule === "设备健康") {
      healthArr.push(cur);
    }
  });
  return {
    largeSizeList: largeSizeArr,
    natureList: natureArr,
    healthList: healthArr
  }
}

function* getAlgoList() { // 获取预警任务列表-算法模型视图
  const url = `${APIBasePath}${algoList}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          algoModelList: dataFormat(response.data.data) || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getListView(action) { // 获取预警任务列表-算法列表视图
  const { payload: {
    pageSize,
    pageNum,
    algorithmModalId,
    createTimeStart,
    createTimeEnd,
    status,
    sortField,
    sortMethod,
    stationCode,
    algorithmModalName,
  } } = action;
  // 请求参数
  const params = {
    pageSize,
    pageNum,
    algorithmIds: algorithmModalId ? algorithmModalId : [],
    startTime: createTimeStart ? createTimeStart : "",
    endTime: createTimeEnd ? createTimeEnd : "",
    status: status ? status : null,
    sortField,
    sortMethod,
    stationCode: !stationCode ? null : stationCode,
  };
  const url = `${APIBasePath}${faultTaskList}`;
  console.log(algorithmModalName, "algorithmModalName123");
  try{
    // 首先改变reducer
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true,
        pageSize: pageSize ? pageSize : 10,
        pageNum : pageNum ? pageNum : 1,
        algorithmModalId: algorithmModalId ? algorithmModalId : [],
        createTimeStart: createTimeStart ? createTimeStart : "",
        createTimeEnd: createTimeEnd ? createTimeEnd : "",
        status: status ? status : null,
        sortField,
        sortMethod,
        stationCode,
        algorithmModalName: algorithmModalName ? algorithmModalName : []
      }
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      console.log(response.data.data, "response.data.data");
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          algoListView: response.data.data || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getAlgoOptionList() { // 获取算法列表
  const url = `${APIBasePath}${algoOptionList}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      console.log("0-0-0-mm");
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          algoOptionList: response.data.data || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false
      }
    });
  }
}

function* getAddWarnTask(action) { // 新增预警任务
  const { payload: {
    func,
    algorithmId,
    stationCode,
    startTime,
    trainingStartTime,
    endTime,
    nowTime,
  } } = action;
  const params = {
    algorithmId,
    stationCode,
    startTime,
    trainingStartTime,
    endTime,
    nowTime,
  };
  const url = `${APIBasePath}${addWarnTask}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success("下发成功");
      //成功关闭弹框
      func();
    }else{
      message.error(response.data.message);
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false
      }
    });
  }
}

export function* watchAlgorithmControl() {
  yield takeEvery(algorithmControlAction.getAlgoList, getAlgoList);
  yield takeEvery(algorithmControlAction.getAlgoOptionList, getAlgoOptionList);
  yield takeEvery(algorithmControlAction.getAddWarnTask, getAddWarnTask);
  yield takeEvery(algorithmControlAction.getListView, getListView);

}

