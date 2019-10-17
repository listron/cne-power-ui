import { put, call, takeLatest } from 'redux-saga/effects';
import { workStageAction } from './workStageReducer';
import request from '@utils/request';
import path from '@path';

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

// 工作台 工作计划管理
// getRecords: '/v3/service/workbench/run', // 工作台-运行记录
// getTickets: '/v3/service/workbench/work', // 工作台 - 两票三制记录
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
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      const { list = [], nums = {}} = response.data || {};
      yield call(easyPut, 'fetchSuccess', {
        stageList: list,
        stageNumInfo: nums,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'fetchSuccess', {
      stageList: [],
      stageNumInfo: {},
    });
    message.error('获取今日工作列表, 请刷新重试');
  }
}

export function* watchWorkStage() {
  yield takeLatest(workStageAction.getTaskList, getTaskList);
}

