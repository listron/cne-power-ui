import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { pointManageAction } from './pointManageAction';

function* changePointManageStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
    payload,
  });
}

function* resetStore() { // 存储payload指定参数，替换reducer-store属性。
  yield put({
    type: pointManageAction.RESET_STORE,
  });
}

function* getStationPointStatusList() { // 请求所有电站列表=>确认是否可删除测点
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}`;
  try {
    const response = yield call(axios.post, url, {
      stationType: '',
      regionName: '',
      stationName: '',
      pageNum: 1,
      pageSize: 10000,
      orderField: '',
      orderCommand: '',
    });
    yield put({
      type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      payload: {
        stationPointStatusList: response.data.data.list || [],
      },
    });
  } catch (e) {
    console.log(e);
    message.error('获取电站列表数据失败，请刷新重试');
  }
}

function* getPointList(action) { // 请求单个详细数据信息
  const { payload } = action;
  // const url = '/mock/system/pointManage/pointsList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPointList}`;
  try {
    yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
    const response = yield call(axios.post, url, {
      ...payload,
      orderField: payload.orderField.replace(/[A-Z]/g, e => `_${e.toLowerCase()}`), //重组字符串
    });

    const totalNum = response.data.data.total || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
        pointList: response.data.data.dataList || [],
        totalNum,
        pageNum,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { ...payload, loading: false },
    });
  }
}

function* deletePointList(action) { // 清除测点列表
  const { payload } = action;
  // const url = '/mock/system/pointManage/deletePointList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deletePoints}/${payload.stationCode}`;
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try {
    const response = yield call(axios.delete, url);
    if (response.data.code === '10000') { // 删除成功后，清空列表
      yield put({
        type: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
        payload: {
          pointList: [],
          totalNum: 0,
          pageNum: 0,
        },
      });
    } else {
      yield put({
        type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: pointManageAction.CHANGE_POINT_MANAGE_STORE,
      payload: { loading: false },
    });
  }
}

export function* watchPointManage() {
  yield takeLatest(pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, changePointManageStore);
  yield takeLatest(pointManageAction.resetStore, resetStore);
  yield takeLatest(pointManageAction.GET_POINT_MANAGE_ALL_STATION, getStationPointStatusList);
  yield takeLatest(pointManageAction.GET_POINT_MANAGE_LIST, getPointList);
  yield takeLatest(pointManageAction.DELETE_POINT_MANAGE_LIST, deletePointList);
}

