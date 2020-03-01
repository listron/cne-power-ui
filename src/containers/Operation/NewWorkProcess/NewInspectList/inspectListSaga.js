import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { newInspectListAction } from './inspectListReducer';
import axios from 'axios';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;
function* getInspectList(action) { // 获取巡检列表数据
  const { payload } = action;
  const { stationCodes, stationType, deviceTypeCode } = payload;
  const url = `${APIBasePath}${ticket.getInspectList}`;
  try {
    yield put({
      type: newInspectListAction.changeStore,
      payload: {
        tableLoading: true,
        params: { ...payload },
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      stationCodes: stationCodes.length ? stationCodes.join(',') : '',
      stationType: stationType ? stationType : '2',
      deviceTypeCode: deviceTypeCode.length ? deviceTypeCode.join(',') : '',
    });
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) {
        pageNum = 1;
      } else if (maxPage < pageNum) {
        pageNum = maxPage;
      }

      yield put({
        type: newInspectListAction.changeStore,
        payload: {
          tableLoading: false,
          inspectList: response.data.data.inspectList || [],
          inspectStatusStatistics: response.data.data.inspectStatusStatistics || {},
          total,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取巡检列表数据失败！');
    yield put({
      type: newInspectListAction.changeStore,
      payload: {
        tableLoading: false,
      },
    });
    console.log(e);
  }
}
function* setInspectCheck(action) { // 验收巡检
  const { payload } = action;
  const { inspectId, params } = payload;
  const url = `${APIBasePath}${ticket.setInspectCheck}`;
  try {
    yield put({
      type: newInspectListAction.changeStore,
      payload: {
        tableLoading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, { inspectId });
    if (response.data.code === '10000') {
      yield put({
        type: newInspectListAction.changeStore,
        payload: {
          tableLoading: false,
          selectedRowKeys: [],
        },
      });
      yield put({
        type: newInspectListAction.getInspectList,
        payload: {
          ...params,
        },
      });

    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('验收失败！');
    yield put({
      type: newInspectListAction.changeStore,
      payload: {
        tableLoading: false,

      },
    });
    console.log(e);
  }
}
export function* newWatchInspectList() {
  yield takeLatest(newInspectListAction.getInspectList, getInspectList);
  yield takeLatest(newInspectListAction.setInspectCheck, setInspectCheck);

}

