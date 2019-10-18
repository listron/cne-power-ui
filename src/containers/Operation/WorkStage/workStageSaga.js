import { put, call, takeLatest } from 'redux-saga/effects';
import { workStageAction } from './workStageReducer';
import request from '@utils/request';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;


function* easyPut(actionName, payload){
  yield put({
    type: workStageAction[actionName],
    payload,
  });
}

// setRecordComplete: '/v3/service/task/complete', //  工作记事 => 操作任务为已完成
// getRecordDetail: '/v3/service/task', // 工作记事 => 查看详情
// addNewRecord: '/v3/service/workbench/inspect/defect', // 新增工作记事
// handleRecord: '/v3/service/worknote', // 编辑, 删除, 详情工作记事

// getPlanList: '/v3/service/workbench/calendar', // 工作台 - 计划日历
// handlePlanStatus: '/v3/service/task/future', // 工作台日历任务批量下发/删除
// addPlan: '/v3/service/inspect/plan', // 新增新增工作计划

function *getTaskList({ payload }){ //	工作台-今日工作列表
  try {
    const url = `${APIBasePath}${operation.getTaskList}`;
    yield call(easyPut, 'changeStore', { stageLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      const { list = [], nums = {}} = response.data || {};
      const { allNums } = nums;
      yield call(easyPut, 'fetchSuccess', {
        stageList: list.map(e => ({ ...e, key: e.taskId })),
        stageNumInfo: allNums,
        stageLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stageList: [],
      stageNumInfo: {},
      stageLoading: false,
    });
    message.error('获取今日工作列表失败, 请刷新重试');
  }
}

function *getRunningLog({ payload }) {
  try {
    const url = `${APIBasePath}${operation.getRunningLog}`;
    yield call(easyPut, 'changeStore', { runLogLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startDate: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        runLogInfo: response.data || {},
        runLogLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      runLogInfo: {},
      runLogLoading: false,
    });
    message.error('获取运行记录失败, 请刷新重试');
  }
}

function *getTickets({ payload }) {
  try {
    const url = `${APIBasePath}${operation.getTickets}`;
    yield call(easyPut, 'changeStore', { ticketsLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        ticketsInfo: response.data || {},
        ticketsLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      ticketsInfo: {},
      ticketsLoading: false,
    });
    message.error('获取运行记录失败, 请刷新重试');
  }
}

export function* watchWorkStage() {
  yield takeLatest(workStageAction.getTaskList, getTaskList);
  yield takeLatest(workStageAction.getRunningLog, getRunningLog);
  yield takeLatest(workStageAction.getTickets, getTickets);
}

