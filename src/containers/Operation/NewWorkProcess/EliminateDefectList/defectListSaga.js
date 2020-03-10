import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import axios from 'axios';
import { eliminateDefectListAction } from './defectListReducer';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;



function* easyPut(actionName, payload) {
  yield put({
    type: eliminateDefectListAction[actionName],
    payload,
  });
}

function* getDefectList(action) { //获取缺陷工单列表
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getEilminateDefectList}`;
  try {
    yield call(easyPut, 'changeStore', {
      listLoading: true,
      listParams: payload,
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const { stateAndTotalList = [], tableData = {} } = response.data.data;
      const { pageCount, dataList } = tableData;
      const total = pageCount || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield call(easyPut, 'changeStore', {
        listParams: { ...payload, pageNum },
        total,
        defectListData: dataList || [],
        stateAndTotalList: stateAndTotalList || [],
        listLoading: false,
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error(`获取消缺列表失败 ${error.message}, 请重试`);
    yield call(easyPut, 'changeStore', {
      total: 0,
      defectListData: [],
      stateAndTotalList: [],
      listLoading: false,
    });
  }
}

function* getParticipant() { // 获取执行人所有列表
  // const url = `${APIBasePath}${ticket.getParticipant}`;
  const url = `${APIBasePath}${ticket.getOperaUser}`;
  try {
    const response = yield call(axios.get, url, {
      // params: { username: '张'}
    });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        participantList: response.data.data || [],
      });
    } else { throw response.data; }
  } catch (error) {
    console.log(error);
    yield call(easyPut, 'changeStore', {
      participantList: [],
    });
  }
}

export function* watchEliminateDefectList() {
  yield takeLatest(eliminateDefectListAction.getDefectList, getDefectList);
  yield takeLatest(eliminateDefectListAction.getParticipant, getParticipant);
}

