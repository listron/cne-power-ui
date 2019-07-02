import {put, takeEvery, call} from 'redux-saga/effects';
import { algorithmControlAction } from './algorithmControlAction';
import Path from '../../../../constants/path';
import axios from 'axios';
import { message } from 'antd';


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      algoList,
      algoOptionList,
      addWarnTask,
      faultTaskList,
      statusInfo,
    },
  }} = Path;

// 根据algorithmSort进行排序
function compare(property){
  return function(a, b){
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
// 格式化数据
function dataFormat(data) {
  const largeSizeArr = []; // 大部件
  const natureArr = []; // 性能预警
  const healthArr = []; // 设备健康
  data && data.map(cur => {
    if (cur.mainModule === '大部件') {
      largeSizeArr.push(cur);
    }
    if (cur.mainModule === '性能预警') {
      natureArr.push(cur);
    }
    if (cur.mainModule === '设备健康') {
      healthArr.push(cur);
    }
  });
  return {
    largeSizeList: largeSizeArr.sort(compare('algorithmSort')),
    natureList: natureArr.sort(compare('algorithmSort')),
    healthList: healthArr.sort(compare('algorithmSort')),
  };
}

function* getAlgoList() { // 获取预警任务列表-算法模型视图
  const url = `${APIBasePath}${algoList}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true,
      },
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
        loading: false,
      },
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
    stationCodes,
    algorithmModalName,
  } } = action;
  // 请求参数
  const params = {
    pageSize: pageSize || 10,
    pageNum: pageNum || 1,
    algorithmIds: algorithmModalId ? algorithmModalId : [],
    startTime: createTimeStart ? createTimeStart : '',
    endTime: createTimeEnd ? createTimeEnd : '',
    status: !status || status === '0' ? null : status,
    sortField,
    sortMethod,
    stationCodes: stationCodes && stationCodes.split(',') || null,
  };
  const url = `${APIBasePath}${faultTaskList}`;
  try{
    // 首先改变reducer
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true,
        pageSize: pageSize ? pageSize : 10,
        pageNum: pageNum ? pageNum : 1,
        algorithmModalId: algorithmModalId ? algorithmModalId : [],
        createTimeStart: createTimeStart ? createTimeStart : '',
        createTimeEnd: createTimeEnd ? createTimeEnd : '',
        status: !status || status === '0' ? '0' : status,
        sortField,
        sortMethod,
        stationCode,
        stationCodes: stationCodes || '',
        algorithmModalName: algorithmModalName ? algorithmModalName : [],
      },
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      // 每次操作之后查询状态对应的个数
      const statusParams = {
        stationCodes: stationCodes && stationCodes.split(',') || null,
        algorithmIds: algorithmModalId ? algorithmModalId : [],
        startTime: createTimeStart ? createTimeStart : '',
        endTime: createTimeEnd ? createTimeEnd : '',
      };
      yield put({
        type: algorithmControlAction.getTaskStatusStat,
        payload: statusParams,
      });
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
        loading: false,
      },
    });
  }
}

function* getAlgoOptionList() { // 获取算法列表
  const url = `${APIBasePath}${algoOptionList}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          algoOptionList: response.data.data.sort(compare('algorithmSort')) || [],
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false,
      },
    });
  }
}

function* getTaskStatusStat(action) { // 获取预警任务状态统计
  const { payload } = action;
  const url = `${APIBasePath}${statusInfo}`;
  try{
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          taskStatusStat: response.data.data || {},
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: algorithmControlAction.changeAlgorithmControlStore,
      payload: {
        loading: false,
      },
    });
  }
}

function* getAddWarnTask(action) { // 新增预警任务
  const { payload: {
    func,
    viewType,
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
        loading: true,
      },
    });
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      // 调用列表视图
      const viewListParams = {
        stationCode: null,
        algorithmIds: [],
        startTime: '',
        endTime: '',
        status: null,
        pageSize: null,
        pageNum: null,
        sortField: '',
        sortMethod: '',
      };
      // 列表视图
      if (viewType === 'list') {
        yield put({
          type: algorithmControlAction.getListView,
          payload: viewListParams,
        });
      }
      // 模型视图
      if (viewType === 'algorithm') {
        yield put({
          type: algorithmControlAction.getAlgoList,
          payload: viewListParams,
        });
      }
      yield put({
        type: algorithmControlAction.changeAlgorithmControlStore,
        payload: {
          loading: false,
        },
      });
      message.success('下发成功');
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
        loading: false,
      },
    });
  }
}

export function* watchAlgorithmControl() {
  yield takeEvery(algorithmControlAction.getAlgoList, getAlgoList);
  yield takeEvery(algorithmControlAction.getAlgoOptionList, getAlgoOptionList);
  yield takeEvery(algorithmControlAction.getAddWarnTask, getAddWarnTask);
  yield takeEvery(algorithmControlAction.getListView, getListView);
  yield takeEvery(algorithmControlAction.getTaskStatusStat, getTaskStatusStat);

}

