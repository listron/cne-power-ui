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

function *getWorkPlanList({ payload }){ // 获取计划列表
  try {
    const url = `${APIBasePath}${operation.getWorkPlanList}`;
    yield call(easyPut, 'changeStore', { planListLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      nowDate: moment().format('YYYY/MM/DD'),
    });
    if (response.code === '10000') {
      const { pageCount, planData = [] } = response.data || {};
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        planList: planData.map(e => ({ ...e, key: e.planId })),
        planCount: pageCount || 0,
        planListLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      planList: [],
      planCount: 0,
      planListLoading: false,
    });
    message.error(`获取计划列表失败 ${error.message}, 请重试`);
  }
}

function *getInspectUsers({ payload }){ // 获取制定人 => 不传参数所有
  try {
    // const { planId } = payload;
    const url = `${APIBasePath}${operation.getInspectUsers}`;
    const response = yield call(request.get, url); // {params: {createUser: ''}}
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        inspectUserList: response.data || [],
      });
    } else { throw response; }
  } catch (error) {
    message.error(`获取制定人列表失败 ${error.message}`);
  }
}

function *getWorkPlanDetail({ payload }){ // 获取计划详情 { planId }
  try {
    const { planId } = payload;
    const url = `${APIBasePath}${operation.handleWorkPlan}/${planId}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      console.log(response.data);
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情

      });
    } else { throw response; }
  } catch (error) {
    message.error(`获取计划详情失败${error.message}, 请重试`);
  }
}

function *addWorkPlan({ payload }){ // 添加工作计划
  try {
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    // yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      console.log(response.data);
      // yield call(easyPut, 'fetchSuccess', {
      //   saveRecordLoading: false,
      //   recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      // });
      // 再次请求今日工作列表 + 计划列表
      // const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      // const stationCodes = stageStations.map(e => e.stationCode);
      // yield call(getTaskList, { // 再次请求今日工作列表
      //   payload: { stationCodes },
      // });
      // yield call(getPlanList, { // 再次请求日历计划列表
      //   payload: { stationCodes, planMonth },
      // });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      // saveRecordLoading: false,
      // recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error(`添加计划失败${error.message}, 请重试`);
  }
}

function *editWorkPlan({ payload }){ // 编辑工作计划
  try {
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    // yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const response = yield call(request.put, url, { ...payload });
    if (response.code === '10000') {
      console.log(response.data);
      // yield call(easyPut, 'fetchSuccess', {
      //   saveRecordLoading: false,
      //   recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      // });
      // 再次请求今日工作列表 + 计划列表
      // const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      // const stationCodes = stageStations.map(e => e.stationCode);
      // yield call(getTaskList, { // 再次请求今日工作列表
      //   payload: { stationCodes },
      // });
      // yield call(getPlanList, { // 再次请求日历计划列表
      //   payload: { stationCodes, planMonth },
      // });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      // saveRecordLoading: false,
      // recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error(`修改计划失败${error.message}, 请重试`);
  }
}

function *deleteWorkPlan({ payload }){ // 删除工作计划 - {planIds: string[]}
  try {
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    // yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const response = yield call(request.delete, url, { ...payload });
    if (response.code === '10000') {
      console.log(response.data);
      // yield call(easyPut, 'fetchSuccess', {
      //   saveRecordLoading: false,
      //   recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      // });
      // 再次请求今日工作列表 + 计划列表
      // const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      // const stationCodes = stageStations.map(e => e.stationCode);
      // yield call(getTaskList, { // 再次请求今日工作列表
      //   payload: { stationCodes },
      // });
      // yield call(getPlanList, { // 再次请求日历计划列表
      //   payload: { stationCodes, planMonth },
      // });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      // saveRecordLoading: false,
      // recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error(`修改计划失败${error.message}, 请重试`);
  }
}

export function* watchWorkPlan() {
  yield takeLatest(workPlanAction.getWorkPlanList, getWorkPlanList);
  yield takeLatest(workPlanAction.getWorkPlanDetail, getWorkPlanDetail);
  yield takeLatest(workPlanAction.addWorkPlan, addWorkPlan);
  yield takeLatest(workPlanAction.editWorkPlan, editWorkPlan);
  yield takeLatest(workPlanAction.deleteWorkPlan, deleteWorkPlan);
  yield takeLatest(workPlanAction.getInspectUsers, getInspectUsers);
}

