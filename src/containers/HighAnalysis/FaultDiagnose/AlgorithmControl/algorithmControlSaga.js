import {put, takeEvery, call} from 'redux-saga/effects';
import { algorithmControlAction } from './algorithmControlAction';
import Path from "../../../../constants/path";
import axios from "axios";


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      algoList,
      algoOptionList,
      addWarnTask
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

function* getAddWarnTask() { // 新增预警任务
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
      console.log(response.data.data, "response.data.data");
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          algoOptionList: response.data.data || [],
          loading: false,
          pageFlag: true
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

export function* watchAlgorithmControl() {
  yield takeEvery(algorithmControlAction.getAlgoList, getAlgoList);
  yield takeEvery(algorithmControlAction.getAlgoOptionList, getAlgoOptionList);
  yield takeEvery(algorithmControlAction.getAddWarnTask, getAddWarnTask);

}

