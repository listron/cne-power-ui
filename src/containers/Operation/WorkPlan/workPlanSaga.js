import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
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
    const { planStatus = [] } = payload;
    const statusCode = planStatus.length === 1 ? planStatus[0] : undefined;
    const response = yield call(request.post, url, {
      ...payload,
      planStatus: statusCode, // 原planStatus数组值改为单值 [], [1], [2], [1, 2] => undefined, 1, 2
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
    const { createUser } = payload;
    const url = `${APIBasePath}${operation.getInspectUsers}`;
    const response = yield call(request.get, url, { params: { createUser }});
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
      yield call(easyPut, 'fetchSuccess', { // 详情
        planPageKey: 'detail',
        planDetail: response.data || {},
        planDetailHandleLoading: false, // 将计划完成的loading状态 变为可操作
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'fetchSuccess', { // 详情
      planDetailHandleLoading: false,
    });
    message.error(`获取计划详情失败${error.message}, 请重试`);
  }
}

function *addWorkPlan({ payload }){ // 添加工作计划
  try {
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    yield call(easyPut, 'changeStore', { addPlanLoading: true });
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      message.success('恭喜！你所提交的信息已经保存成功，可在日历及计划管理中查看。');
      const { planParams, planListPageParams } = yield select(state => state.operation.workPlan.toJS()); // 再次请求列表
      const newPagePrams = {
        ...planListPageParams,
        pageNum: 1,
        pageSize: 10,
        orderField: 8, // planTypeName inspectContent firstStartTime nextSendTime validPeriod cycleTypeName planStatus lastHandleTime
        orderMethod: 'desc', // 新增后, 将按照最新更新时间排序展示
      };
      yield call(easyPut, 'fetchSuccess', {
        addPlanLoading: false,
        planDetail: {},
        planListPageParams: newPagePrams,
      });
      yield call(getWorkPlanList, { // 再次请求日历计划列表
        payload: { ...planParams, ...newPagePrams },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      addPlanLoading: false,
      planDetail: payload,
    });
    message.error(`添加计划失败${error.message}, 请重试`);
  }
}

function *setWorkPlanStatus({ payload }) { // 工作计划详情 启用开关编辑
  try {
    const { planId } = payload; // 原工作详情的信息拷贝 + 编辑后的status
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    yield call(easyPut, 'changeStore', { planDetailHandleLoading: true });
    const response = yield call(request.put, url, { ...payload });
    if (response.code === '10000') {
      const { planParams, planListPageParams } = yield select(state => state.operation.workPlan.toJS()); // 再次请求当前列表
      yield fork(getWorkPlanList, { // 再次请求日历计划列表
        payload: { ...planParams, ...planListPageParams },
      });
      yield fork(getWorkPlanDetail, {payload: { planId }});
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      planDetailHandleLoading: false,
    });
    message.error(`修改启用状态失败${error.message}, 请重试`);
  }
}

function *editWorkPlan({ payload }){ // 编辑工作计划
  try {
    const url = `${APIBasePath}${operation.handleWorkPlan}`;
    yield call(easyPut, 'changeStore', { addPlanLoading: true });
    const response = yield call(request.put, url, { ...payload });
    if (response.code === '10000') {
      message.success('恭喜！你所提交的信息已经保存成功，可在日历及计划管理中查看。');
      const { planParams, planListPageParams } = yield select(state => state.operation.workPlan.toJS()); // 再次请求列表
      yield call(easyPut, 'fetchSuccess', {
        addPlanLoading: false,
        planDetail: {},
      });
      yield call(getWorkPlanList, { // 再次请求日历计划列表
        payload: { ...planParams, ...planListPageParams },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      addPlanLoading: false,
      planDetail: payload,
    });
    message.error(`修改计划失败${error.message}, 请重试`);
  }
}

function *deleteWorkPlan({ payload }){ // 删除工作计划 - {planIds: string[]}
  try {
    const { planIds, deletePlansLoading = false } = payload;
    yield call(easyPut, 'changeStore', { deletePlansLoading });
    const url = `${APIBasePath}${operation.handleWorkPlan}?planIds=${planIds.join(',')}`;
    const response = yield call(request.delete, url);
    if (response.code === '10000') {
      const { planParams, planListPageParams } = yield select(state => state.operation.workPlan.toJS());
      const newPagePrams = { ...planListPageParams, pageNum: 1, pageSize: 10 };
      yield call(easyPut, 'fetchSuccess', {
        deletePlansLoading: false,
        planListPageParams: newPagePrams,
      });
      // 再次请求列表
      yield call(getWorkPlanList, { // 再次请求日历计划列表
        payload: { ...planParams, ...newPagePrams },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      saveRecordLoading: false,
    });
    message.error(`删除失败${error.message}, 请重试`);
  }
}

export function* watchWorkPlan() {
  yield takeLatest(workPlanAction.getWorkPlanList, getWorkPlanList);
  yield takeLatest(workPlanAction.getWorkPlanDetail, getWorkPlanDetail);
  yield takeLatest(workPlanAction.addWorkPlan, addWorkPlan);
  yield takeLatest(workPlanAction.editWorkPlan, editWorkPlan);
  yield takeLatest(workPlanAction.setWorkPlanStatus, setWorkPlanStatus);
  yield takeLatest(workPlanAction.deleteWorkPlan, deleteWorkPlan);
  yield takeLatest(workPlanAction.getInspectUsers, getInspectUsers);
}

