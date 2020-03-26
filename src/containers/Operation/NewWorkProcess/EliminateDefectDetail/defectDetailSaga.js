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

// 请求新的数据，之前的为空
function* resetCont() {
  yield put({
    type: eliminateDefectDetailAction.changeStore,
    payload: {
      allowedActions: [], //可执行的动作
      baseInfo: {}, // 基本信息
      stateId: null, //  状态ID
      stateName: '', // 状态名称  状态名称是确定的，不会根据不同的企业ID发生变化
      eventInfos: [], // 缺陷事件信息
      warnEventInfos: [], // 告警缺陷事件
      handleInfos: [], // 处理信息
      processInfo: [], // 流程信息
      removeEventImg: [], // 用于退回的时候 重新编辑 缺陷⌚️
      removeHandleImg: [], // 用于退回的时候 重新编辑 处理信息
      isVertify: false, // 是否验证状态
      addbaseInfo: {}, // 添加的基本信息
      addEventInfo: [], // 添加的缺陷事件
      addhandleList: [], // 添加的处理记录
      eventStatus: [], // 验收工单的时候 缺陷事件状态
    },
  });
}

function* getDefectAction(action) { // 2.7.3.2.	查询消缺可执行动作 创建和追加的
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
  const { params, callback } = payload;
  const url = `${APIBasePath}${ticket.createEliminateDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      const docketId = response.data.data;
      callback(docketId);
      yield call(easyPut, 'changeStore', {
        docketId: docketId,
      });
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
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
        stationCode: response.data.data.stationCode || null,
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
    const removeEventImg = [];
    response.data.data.forEach((e, index) => {
      const { eventImgs = [], eventId } = e;
      if (eventImgs.length > 0) {
        removeEventImg.push({
          eventId,
          imgs: eventImgs.map(img => { return { imgId: img.imgId, url: img.url, updateSign: 2 }; }),
        });
      }
    });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        eventInfos: response.data.data || [],
        eventStatus: response.data.data.map((e, index) => { return { eventId: e.eventId, eventState: null, key: index }; }),
        removeEventImg,
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
        removeHandleImg: response.data.data.map((e, index) => {
          const { handleImgs = [] } = e;
          return handleImgs && handleImgs.map(img => { return { imgId: img.imgId, url: img.url, updateSign: 2 }; });
        }),
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
    const response = yield call(axios.post, url, payload.record);
    if (response.data.code === '10000') {
      // 获取D 重新请求处理信息
      func();
      yield call(easyPut, 'getDefectBaseInfo', {
        docketId,
      });
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
  yield fork(getDefectAction, { payload }); // 可执行动作
  yield fork(getDefectBaseInfo, { payload }); // 基础信息
  yield fork(getDefectEventInfo, { payload }); //  缺陷事件
  yield fork(getDefectHandleInfo, { payload }); // 处理信息
  yield fork(getProcessInfo, { payload }); // 流程信息
}

function* acceptanceDocket(action) { // 2.7.3.10.	消缺验收（通过和驳回）
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.checkAndAcceptDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      callback();
      yield call(resetCont);
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* verifyDocket(action) { // 2.7.3.11.	审核消缺工单
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.verifyEilminateDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      callback();
      yield call(resetCont);
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* receiveDocket(action) { // 2.6.1.4.	领取工单
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.getReceiveAction}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      callback();
      yield call(resetCont);
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* returnDocket(action) { // 2.6.1.8.	退回功能
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.returnDocket}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      callback();
      yield call(resetCont);
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* deleteDocket(action) { // 2.6.1.9.	删除工单
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.delDocket}/${docketId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      // 删除之后，回到列表页面 需要使用一个回调函数
      callback();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* addAbleUser(action) { // 2.6.1.3.	添加节点处理人 // 目前是执行操作单独添加
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getAddUser}`;
  const { docketId, stateId } = yield select(state => state.operation.eliminateDefectDetail.toJS());
  try {
    const response = yield call(axios.post, url, { ...payload, docketId, stateId });
    if (response.data.code === '10000') {
      // 添加完节点处理人，重新请求一次基本信息 流程信息
      yield put({
        type: eliminateDefectDetailAction.getDefectBaseInfo,
        payload: { docketId },
      });
      yield put({
        type: eliminateDefectDetailAction.getProcessInfo,
        payload: { docketId },
      });

    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
  }
}

function* submitAction(action) { // 2.6.1.2.	处理节点  消缺现有的处理信息是 提交验收
  const { payload } = action;
  const { params, callback } = payload;
  const { docketId } = params;
  const url = `${APIBasePath}${ticket.getSubmitAction}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      callback();
      yield call(resetCont);
      yield put({
        type: eliminateDefectDetailAction.getDefectMessage,
        payload: { docketId },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    if (e.code === '15001') {
      yield call(easyPut, 'changeStore', {
        showErrorTip: true,
      });
    } else {
      message.error(e.message);
    }
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

function* getDiagwarning(action) { // 获取告警事件转过来的ID
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

function* showUser(action) { // 2.7.3.13.	查询起始流程的显示用户信息
  const url = `${APIBasePath}${ticket.getDefectState}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const data = response.data.data && response.data.data[0];
      const stateId = data.stateId;
      yield call(easyPut, 'changeStore', {
        stateId,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield call(easyPut, 'changeStore', {
      stateId: '',
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
  yield takeLatest(eliminateDefectDetailAction.getDiagwarning, getDiagwarning);
  yield takeLatest(eliminateDefectDetailAction.showUser, showUser);
  yield takeLatest(eliminateDefectDetailAction.resetCont, resetCont);
}

