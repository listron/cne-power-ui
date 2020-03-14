import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { eliminateDefectDetailAction } from './defectDetailReducer';
import { delay } from 'redux-saga';
import axios from 'axios';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

function* easyPut(actionName, payload) {
  yield put({
    type: eliminateDefectDetailAction[actionName],
    payload,
  });
}

function* getDefectAction(action) { // 2.7.3.2.	查询消缺可执行动作 创建和追加的
  console.log('action', action);
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getEliminateDefectAction}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        allowedActions: response.data.data || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      defectAction: [],
    });
  }
}

function* createDefect(action) { // 2.7.3.3.	创建消缺工单（提交）
  const { payload } = action;
  const url = `${APIBasePath}${ticket.createEliminateDefect}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const docketId = response.data.data.docketId;
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn(e.message);
  }
}

function* getDefectBaseInfo(action) { // 2.7.3.4.查询消缺工单基本信息
  const { payload } = action;
  const { docketId } = payload;
  const url = `${APIBasePath}${ticket.getEliminateBaseInfo}/${docketId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        baseInfo: response.data.data || [],
        stateName: response.data.data.stateName || '',
        stateId: response.data.data.stateId || null,
        operUserInfo: response.data.data.operUserInfo || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      baseInfo: [],
    });
  }
}

function* getDefectEventInfo(action) { // 2.7.3.7.查询工单缺陷信息
  const { payload } = action;
  const { docketId } = payload;
  const url = `${APIBasePath}${ticket.getEliminateEventInfo}/${docketId}`;
  try {
    const response = yield call(axios.post, url, { docketId });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        eventInfos: response.data.data || [],
        eventStatus: response.data.data.map((e, index) => { return { eventId: e.eventId, 'eventState': null, key: index }; }),
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      eventInfos: [],
    });
  }
}

function* getDefectHandleInfo(action) { // 2.7.3.8.	查询工单处理信息
  const { payload } = action;
  const { docketId } = payload;
  const url = `${APIBasePath}${ticket.getEliminateHandleInfo}/${docketId}`;
  try {
    const response = yield call(axios.post, url, { docketId });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        handleInfos: response.data.data || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      handleInfo: [],
    });
  }
}

function* addDefectHandle(action) { // 2.7.3.9.	添加工单的处理信息
  const { payload } = action;
  const { record, func } = payload;
  const url = `${APIBasePath}${ticket.addEliminateHandle}`;
  const { docketId } = record;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 获取D 重新请求处理信息
      func();
      yield call(easyPut, 'getDefectHandleInfo', {
        docketId,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* getProcessInfo(action) { //2.7.1.4  获取流程流转信息数据
  const { payload } = action;
  const { docketId } = payload;
  const url = `${APIBasePath}${ticket.getProcessList}/${docketId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        processInfo: response.data.data || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    console.log(e);
    yield call(easyPut, 'changeStore', {
      processInfo: [],
    });
  }
}

function* getDefectMessage(action) { // 各种状态提交之后请求新的数据
  // 获取ID 重新请求处理信息
  const { payload } = action;
  console.log('payload', payload);
  yield fork(getDefectAction, { payload }); // 可执行动作
  yield fork(getDefectBaseInfo, { payload }); // 基础信息
  yield fork(getDefectEventInfo, { payload }); //  缺陷事件
  yield fork(getDefectHandleInfo, { payload }); // 处理信息
  yield fork(getProcessInfo, { payload }); // 流程信息
}

function* acceptanceDocket(action) { // 2.7.3.10.	消缺验收（通过和驳回）
  const { payload } = action;
  const url = `${APIBasePath}${ticket.checkAndAcceptDefect}`;
  const { docketId } = payload;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* verifyDocket(action) { // 2.7.3.11.	审核消缺工单
  const { payload } = action;
  const url = `${APIBasePath}${ticket.verifyEilminateDefect}`;
  const { docketId } = payload;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* receiveDocket(action) { // 2.6.1.4.	领取工单
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getReceiveAction}`;
  const { docketId } = payload;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* returnDocket(action) { // 2.6.1.8.	退回功能
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getReceiveAction}`;
  const { docketId } = payload;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* deleteDocket(action) { // 2.6.1.9.	删除工单
  const { payload } = action;
  const { docketId } = payload;
  const url = `${APIBasePath}${ticket.delDocket}/${docketId}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      // 删除之后，回到列表页面 需要使用一个回调函数
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* addAbleUser(action) { // 2.6.1.3.	添加节点处理人 // 目前是执行操作单独添加
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getAddUser}`;
  const { docketId, stateId } = yield select(state => state.operation.eliminateDefectDetail.toJS());
  try {
    const response = yield call(axios.post, url, { ...payload, docketId, stateId });
    if (response.data.code === '10000') {
      // 添加完节点处理人，重新请求一次基本信息
      yield put({
        type: eliminateDefectDetailAction.getDefectBaseInfo,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* submitAction(action) { // 2.6.1.2.	处理节点  消缺现有的处理信息是 提交验收 派发
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getSubmitAction}`;
  const { docketId } = payload;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

function* defectTypes(action) { // 2.7.3.5.	查询缺陷类型列表
  const { payload } = action;
  const { stationCode } = payload;
  const url = `${APIBasePath}${ticket.getSubmitAction}/${stationCode}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        defectTypes: response.data.data || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      defectTypes: [],
    });
  }
}

function* getBaseUsername(action) { // 获取有权限电站权限用户
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getBaseUsername}/${payload.stationCode}`;
  try {
    yield call(easyPut, 'changeStore', {
      usernameLoading: true,
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { operUserInfo } = yield select(state => state.operation.eliminateDefectDetail.toJS());
      const operableUserArr = operUserInfo[0].ableUserIds && operUserInfo[0].ableUserIds.split(',') || [];
      const operateArr = response.data.data || [];
      yield call(easyPut, 'changeStore', {
        usernameLoading: false,
        usernameList: response.data.data || [],

      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      usernameLoading: true,
    });
    console.log(e);
  }
}

function* getDiagwarning(action) { // 获取有权限电站权限用户
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getDiagWarnList}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        warnEventInfos: response.data.data || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      warnEventInfos: [],
    });
    console.log(e);
  }
}




export function* watchEliminateDefectDetail() {
  yield takeLatest(eliminateDefectDetailAction.getDefectAction, getDefectAction);
  yield takeLatest(eliminateDefectDetailAction.createDefect, createDefect);
  yield takeLatest(eliminateDefectDetailAction.getDefectBaseInfo, getDefectBaseInfo);
  yield takeLatest(eliminateDefectDetailAction.getDefectEventInfo, getDefectEventInfo);
  yield takeLatest(eliminateDefectDetailAction.getDefectHandleInfo, getDefectHandleInfo);
  yield takeLatest(eliminateDefectDetailAction.addDefectHandle, addDefectHandle);
  yield takeLatest(eliminateDefectDetailAction.getProcessInfo, getProcessInfo);
  yield takeLatest(eliminateDefectDetailAction.acceptanceDocket, acceptanceDocket);
  yield takeLatest(eliminateDefectDetailAction.verifyDocket, verifyDocket);
  yield takeLatest(eliminateDefectDetailAction.receiveDocket, receiveDocket);
  yield takeLatest(eliminateDefectDetailAction.getDefectMessage, getDefectMessage);
  yield takeLatest(eliminateDefectDetailAction.returnDocket, returnDocket);
  yield takeLatest(eliminateDefectDetailAction.deleteDocket, deleteDocket);
  yield takeLatest(eliminateDefectDetailAction.addAbleUser, addAbleUser);
  yield takeLatest(eliminateDefectDetailAction.submitAction, submitAction);
  yield takeLatest(eliminateDefectDetailAction.defectTypes, defectTypes);
  yield takeLatest(eliminateDefectDetailAction.getBaseUsername, getBaseUsername);
}

