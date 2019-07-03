import {put, takeEvery, call} from 'redux-saga/effects';
import { faultWarnListAction } from './faultWarnListAction.js';
import Path from '../../../../constants/path';
import axios from 'axios';

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
      algoModel,
      listView,
      fanList,
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
function* getAlgoModel(action) { // 获取单风场故障预警汇总-按模型
  const { payload } = action;
  const url = `${APIBasePath}${algoModel}/${payload.stationCode}`;
  try{
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultWarnListAction.changeWarnListStore,
        payload: {
          algoModelData: dataFormat(response.data.data) || {},
          loading: false,
          singleStationCode: payload.stationCode,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: false,
      },
    });
  }
}

function* getList(action) { // 获取单风场故障预警汇总-按列表
  const { payload } = action;
  const url = `${APIBasePath}${listView}`;
  try{
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: faultWarnListAction.changeWarnListStore,
        payload: {
          listViewData: response.data.data || {},
          loading: false,
          singleStationCode: payload.stationCode,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          sortField: payload.sortField,
          sortMethod: payload.sortMethod,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: false,
      },
    });
  }
}

function* getFanList(action) { // 获取单风场故障预警汇总-按风机
  const { payload } = action;
  const url = `${APIBasePath}${fanList}/${payload.stationCode}`;
  try{
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url);
    if (response.data.code === '10000') {
      yield put({
        type: faultWarnListAction.changeWarnListStore,
        payload: {
          fanListData: response.data.data || [],
          loading: false,
          singleStationCode: payload.stationCode,
        },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: faultWarnListAction.changeWarnListStore,
      payload: {
        loading: false,
      },
    });
  }
}

export function* watchFaultWarnList() {
  yield takeEvery(faultWarnListAction.getAlgoModel, getAlgoModel);
  yield takeEvery(faultWarnListAction.getList, getList);
  yield takeEvery(faultWarnListAction.getFanList, getFanList);

}

