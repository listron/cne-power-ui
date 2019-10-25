import { put, call, takeLatest, select } from 'redux-saga/effects';
import { workPlanAction } from './workPlanReducer';
import request from '@utils/request';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;


function* easyPut(actionName, payload){
  yield put({
    type: workPlanAction[actionName],
    payload,
  });
}

// getWorkPlanList: '/v3/service/inspect/allplans', // 工作管理计划表格
      // handleWorkPlan: '/v3/service/inspect/plan', // 添加 + 编辑工作管理计划

// getWorkPlanList

// getWorkPlanDetail

// addWorkPlan

// editWorkPlan

/**
function *getPlanDetail({ payload }){ // 获取计划详情
  try {
    const { noteId } = payload;
    const url = `${APIBasePath}${operation.getPlanDetail}/${noteId}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        showModal: true,
        modalKey: 'planDetail',
        recordDetailInfo: response.data ? { ...response.data, noteId } : {},
      });
    } else { throw response; }
  } catch (error) {
    message.error('获取计划详情失败, 请重试');
  }
}


function *addPlan({ payload }){ // 添加工作计划
  try {
    const url = `${APIBasePath}${operation.addPlan}`;
    yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        saveRecordLoading: false,
        recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      });
      // 再次请求今日工作列表 + 计划列表
      const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      const stationCodes = stageStations.map(e => e.stationCode);
      yield call(getTaskList, { // 再次请求今日工作列表
        payload: { stationCodes },
      });
      yield call(getPlanList, { // 再次请求日历计划列表
        payload: { stationCodes, planMonth },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      saveRecordLoading: false,
      recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error('添加计划失败, 请重试');
  }
}


function *handlePlanStatus({ payload }) { // 工作台日历任务批量下发/删除{planDetailIds, taskStatus(1下发3删除), taskTime}
  try {
    const url = `${APIBasePath}${operation.handlePlanStatus}`;
    yield call(easyPut, 'changeStore', { handlePlanLoading: true });
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        handlePlanLoading: false,
        handleError: false,
      });
      // 再次请求今日工作列表 + 计划列表
      const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      const stationCodes = stageStations.map(e => e.stationCode);
      yield call(getTaskList, { // 再次请求今日工作列表
        payload: { stationCodes },
      });
      yield call(getPlanList, { // 再次请求日历计划列表
        payload: { stationCodes, planMonth },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      handlePlanLoading: false,
      handleError: true,
    });
    message.error('计划操作失败, 请重试');
  }
}




*/

export function* watchWorkPlan() {
  // yield takeLatest(workPlanAction.getTaskList, getTaskList);
  // yield takeLatest(workPlanAction.addNewRecord, addNewRecord);
}

