import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import axios from 'axios';
import { defectListAction } from './defectListReducer';
import path from '@path';
import moment from 'moment';


import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;



function* easyPut(actionName, payload) {
  yield put({
    type: defectListAction[actionName],
    payload,
  });
}

//获取缺陷工单列表
function* getDefectList(action) {
  const { payload } = action;
  const url = `${APIBasePath}${operation.ticket.getDefectList}`;
  console.log('payload', payload);
  try {
    yield call(easyPut, 'changeStore', {
      listLoading: true,
      listParams: payload,
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
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
        defectList: response.data.data.defectList || [],
        defectStatusStatistics: response.data.data.defectStatusStatistics || {},
        listLoading: false,
        selectedRowKeys: [],
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error(`获取计划列表失败 ${error.message}, 请重试`);
    yield call(easyPut, 'changeStore', {
      total: 0,
      selectedRowKeys: [],
      defectList: [],
      defectStatusStatistics: {},
      listLoading: false,
    });
  }
}

export function* watchDefectList() {
  yield takeLatest(defectListAction.getDefectList, getDefectList);
}

