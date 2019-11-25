import { put, call, takeLatest } from 'redux-saga/effects';
import { inspectDetailAction } from './inspectDetailReducer';
import axios from 'axios';
import path from '@path';
// import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

function* getInspectDetail(action) { // 获取工单详情数据
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getNewInspectDetail}/${payload.inspectId}`;
  try {
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {

      yield put({
        type: inspectDetailAction.changeStore,
        payload: {
          loading: false,
          inspectDetail: response.data.data || {},
          inspectFlows: response.data.data.flows || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取巡检详情数据失败！');
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}
function* setInspectCheck(action) { // 验收巡检
  const { payload } = action;
  const { inspectId } = payload;
  const url = `${APIBasePath}${ticket.setInspectCheck}`;
  try {
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, { inspectId });
    if (response.data.code === '10000') {
      yield put({
        type: inspectDetailAction.changeStore,
        payload: {
          loading: false,
          selectedRowKeys: [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('验收失败！');
    yield put({
      type: inspectDetailAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}

export function* watchInspectDetail() {
  yield takeLatest(inspectDetailAction.getInspectDetail, getInspectDetail);
  yield takeLatest(inspectDetailAction.setInspectCheck, setInspectCheck);
}

