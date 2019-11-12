import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
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

function *getTaskList({ payload }){ //	工作台-今日工作列表
  // payload = { stationCodes: [56, 12] }
  try {
    const url = `${APIBasePath}${operation.getTaskList}`;
    yield call(easyPut, 'changeStore', { stageLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      const { list = [], nums = {}} = response.data || {};
      const { allNums } = nums;
      yield call(easyPut, 'fetchSuccess', {
        stageList: list.map(e => ({ ...e, key: e.taskId })),
        stageNumInfo: allNums,
        stageLoading: false,
        pageLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      stageList: [],
      stageNumInfo: {},
      stageLoading: false,
      pageLoading: false,
    });
    message.error('获取今日工作列表失败, 请刷新重试');
  }
}

function *addNewRecord({ payload }){ // 新增工作记事
  // payload = { stationList, completeTime, handleUser, noteContent }
  try {
    const url = `${APIBasePath}${operation.handleRecord}`;
    yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const { stationList, completeTime, handleUser, noteContent } = payload || {};
    const response = yield call(request.post, url, {
      stationCodes: stationList.map(e => e.stationCode),
      completeTime: moment(completeTime).format('YYYY/MM/DD HH:mm:ss'),
      handleUser,
      noteContent,
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        saveRecordLoading: false,
        recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      });
      const { stageStations } = yield select(state => state.operation.workStage.toJS());
      yield call(getTaskList, { // 再次请求getTaskList列表
        payload: {
          stationCodes: stageStations.map(e => e.stationCode),
        },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      saveRecordLoading: false,
      recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error(`添加工作记事失败 ${error.message}, 请重试`);
  }
}

function *setPlanComplete({ payload }) { // => 操作计划为已完成
  // payload = { taskIds: ['1123232323'] }	任务ID
  try {
    yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const url = `${APIBasePath}${operation.setPlanComplete}`;
    const response = yield call(request.put, url, { ...payload, taskStatus: 2 });
    if (response.code === '10000') { // 回到列表页 + 重新请求列表
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        showModal: false,
        modalKey: null,
        saveRecordLoading: false,
        recordDetailInfo: null,
      });
      const { stageStations } = yield select(state => state.operation.workStage.toJS());
      yield call(getTaskList, { // 再次请求getTaskList列表
        payload: {
          stationCodes: stageStations.map(e => e.stationCode),
        },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', { saveRecordLoading: false });
    message.error('任务状态修改失败, 请重试');
  }
}

function *getRecordDetail({ payload }){ // 获取记事详情 payload: { noteId: '452868891774976' }
  try {
    const { noteId, modalKey = 'recordDetail' } = payload; // 默认展示modalKey详情页, 传入参数可修改
    const url = `${APIBasePath}${operation.handleRecord}/${noteId}`;
    const response = yield call(request.get, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        showModal: true,
        modalKey,
        recordDetailInfo: response.data || {},
      });
    } else { throw response; }
  } catch (error) {
    message.error('获取记事详情失败, 请重试');
  }
}

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

function *editRecord({ payload }){ // 编辑工作记事
  try {
    yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const url = `${APIBasePath}${operation.handleRecord}`;
    const { stationList, completeTime, handleUser, noteContent, noteId } = payload || {};
    const response = yield call(request.put, url, {
      stationCodes: stationList.map(e => e.stationCode),
      completeTime: moment(completeTime).format('YYYY/MM/DD HH:mm:ss'),
      handleUser,
      noteContent,
      noteId,
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { // 修改成功 关闭弹框
        saveRecordLoading: false,
        showModal: false,
        modalKey: null,
        recordDetailInfo: null,
      });
      // yield call(getRecordDetail, { payload: { noteId } });// 修改成功 直接查看详情
      const { stageStations } = yield select(state => state.operation.workStage.toJS());
      yield call(getTaskList, { // 再次请求getTaskList列表
        payload: {
          stationCodes: stageStations.map(e => e.stationCode),
        },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      saveRecordLoading: false,
    });
    message.error(`编辑工作记事失败 ${error.message}, 请重试`);
  }
}

function *deletRecord({ payload }){ // 删除记事
  try {
    const { noteId } = payload;
    const url = `${APIBasePath}${operation.handleRecord}/${noteId}`;
    yield call(easyPut, 'changeStore', { deleteRecordLoading: true });
    const response = yield call(request.delete, url);
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', { // 弹框展示详情
        showModal: false,
        modalKey: null,
        deleteRecordLoading: false,
        recordDetailInfo: null,
      });
      const { stageStations } = yield select(state => state.operation.workStage.toJS());
      yield call(getTaskList, { //删除成功 => 再次请求getTaskList列表
        payload: {
          stationCodes: stageStations.map(e => e.stationCode),
        },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', { deleteRecordLoading: false });
    message.error(`删除工作记事失败 ${error.message}, 请重试`);
  }
}

function *addPlan({ payload }){ // 添加工作计划
  try {
    const url = `${APIBasePath}${operation.addPlan}`;
    yield call(easyPut, 'changeStore', { saveRecordLoading: true });
    const response = yield call(request.post, url, { ...payload });
    if (response.code === '10000') {
      message.success('恭喜！你所提交的信息已经保存成功，可在日历及计划管理中查看。');
      yield call(easyPut, 'fetchSuccess', {
        saveRecordLoading: false,
        recordDetailInfo: null, // 请求成功删除相关信息 => 继续或关闭
      });
      // 再次请求今日工作列表 + 计划列表
      const { stageStations, planMonth } = yield select(state => state.operation.workStage.toJS());
      const stationCodes = stageStations.map(e => e.stationCode);
      yield fork(getTaskList, { // 再次请求今日工作列表
        payload: { stationCodes },
      });
      yield fork(getPlanList, { // 再次请求日历计划列表
        payload: { stationCodes, planMonth },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      saveRecordLoading: false,
      recordDetailInfo: payload, // 请求失败需要暂存数据进行重新请求
    });
    message.error(`添加计划失败 ${error.message}, 请重试`);
  }
}

function *getRunningLog({ payload }) { // 运行记录
  try {
    const url = `${APIBasePath}${operation.getRunningLog}`;
    yield call(easyPut, 'changeStore', { runLogLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startTime: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        runLogInfo: response.data || {},
        runLogLoading: false,
        pageLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      runLogInfo: {},
      runLogLoading: false,
      pageLoading: false,
    });
    message.error('获取运行记录失败, 请刷新重试');
  }
}

function *getTickets({ payload }) { // 两票三制记录
  try {
    const url = `${APIBasePath}${operation.getTickets}`;
    yield call(easyPut, 'changeStore', { ticketsLoading: true });
    const response = yield call(request.post, url, {
      ...payload,
      startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        ticketsInfo: response.data || {},
        ticketsLoading: false,
        pageLoading: false,
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

function *getPlanList({ payload }) { // 计划日历 payload: {stationCodes, planMonth}
  try {
    const url = `${APIBasePath}${operation.getPlanList}`;
    yield call(easyPut, 'changeStore', { planListLoading: true });
    const { stationCodes, planMonth = moment().format('YYYY-MM') } = payload;
    const response = yield call(request.post, url, {
      stationCodes,
      startTime: moment(planMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(planMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    });
    if (response.code === '10000') {
      yield call(easyPut, 'fetchSuccess', {
        planList: response.data || [],
        planListLoading: false,
        pageLoading: false,
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      planList: [],
      planListLoading: false,
      pageLoading: false,
    });
    message.error('获取计划日历失败, 请刷新重试');
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
      yield fork(getTaskList, { // 再次请求今日工作列表
        payload: { stationCodes },
      });
      yield fork(getPlanList, { // 再次请求日历计划列表
        payload: { stationCodes, planMonth },
      });
      yield fork(getTickets, { // 再次请求 两票三制数据
        payload: { stationCodes },
      });
    } else { throw response; }
  } catch (error) {
    yield call(easyPut, 'changeStore', {
      handlePlanLoading: false,
      handleError: true,
    });
    message.error(`计划操作失败 ${error.message}, 请重试`);
  }
}

export function* watchWorkStage() {
  yield takeLatest(workStageAction.getTaskList, getTaskList);
  yield takeLatest(workStageAction.addNewRecord, addNewRecord);
  yield takeLatest(workStageAction.setPlanComplete, setPlanComplete);
  yield takeLatest(workStageAction.getPlanDetail, getPlanDetail);
  yield takeLatest(workStageAction.editRecord, editRecord);
  yield takeLatest(workStageAction.deletRecord, deletRecord);
  yield takeLatest(workStageAction.getRecordDetail, getRecordDetail);
  yield takeLatest(workStageAction.addPlan, addPlan);
  yield takeLatest(workStageAction.getRunningLog, getRunningLog);
  yield takeLatest(workStageAction.getTickets, getTickets);
  yield takeLatest(workStageAction.getPlanList, getPlanList);
  yield takeLatest(workStageAction.handlePlanStatus, handlePlanStatus);
}

