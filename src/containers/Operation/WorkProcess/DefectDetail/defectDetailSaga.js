import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { defectDetailAction } from './defectDetailReducer';
import axios from 'axios';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

function* easyPut(actionName, payload) {
  yield put({
    type: defectDetailAction[actionName],
    payload,
  });
}

function* getDefectDetail(action) { // 获取缺陷工单详情  两种状态  get 请求方式  defectID
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getDefectDetail}`;
  try {
    const response = yield call(axios.get, url, { params: { defectId: payload.defectId } });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        ...payload,
        defectDetail: response.data.data || {},
        processData: response.data.data.processData || [],
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error('请求数据失败');
    yield call(easyPut, 'changeStore', {
      ...payload,
      defectDetail: {},
      processData: [],
    });
  }
}

function* getRelevancedocket(action) { // 获取当前缺陷关联的工单
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getDockerDetail}`;
  try {
    const response = yield call(axios.get, url, { params: { defectId: payload.defectId } });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        dockerDetail: response.data.data || {},
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error('请求数据失败');
    yield call(easyPut, 'changeStore', {
      dockerDetail: {},
    });
  }
}

function* getDefectCommonList(action) { // 获取缺陷常用语  参数 languageType：0 全部 1 缺陷 2 巡检
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getCommonList}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        commonList: response.data.data.data,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield call(easyPut, 'changeStore', {
      commonList: [],
    });
  }
}

function* getDefectTypes(action) { // 获取缺陷类型信息
  const { payload } = action;
  const url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectTypes;
  yield put({ type: defectDetailAction.workOrderFetch });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: defectDetailAction.getworkOrderFetchSuccess,
        payload: {
          defectTypes: response.data.data.data,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function* sendDefect(action) { // 下发工单
  const { payload } = action;
  const { func, ...params } = payload;
  const url = `${APIBasePath}${ticket.sendDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success('下发成功！', 3);
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('下发失败,请重试！', 3);
  }
}


function* rejectDefect(action) { // 驳回工单
  const { payload } = action;
  const { func, ...params } = payload;
  const url = `${APIBasePath}${ticket.rejectDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success('驳回成功！');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('驳回失败,请重试！', 3);
  }
}


function* closeDefect(action) { // 关闭工单
  const { payload } = action;
  const { func, ...params } = payload;
  const url = `${APIBasePath}${ticket.closeDefect}`;
  yield put({ type: defectDetailAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success('关闭成功！');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    message.warn('关闭失败,请重试！', 3);
  }
}


function* handleDefect(action) { // 执行工单
  const { payload } = action;
  const { func, ...params } = payload;
  const url = `${APIBasePath}${ticket.handleDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success('消缺成功！');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('消缺失败，请重试！');
  }
}


function* checkDefect(action) { // 验收工单
  const { payload } = action;
  const { func, ...params } = payload;
  const url = `${APIBasePath}${ticket.checkDefect}`;
  try {
    const response = yield call(axios.post, url, params);
    if (response.data.code === '10000') {
      message.success('验收成功！');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('验收失败，请重试！');
  }
}

function* getKnowledgebase(action) { // 获取智能专家列表
  const { payload } = action;
  const url = `${APIBasePath}${ticket.getKnowledgebase}`;
  // let url = `/mock/operation/knowledgebase/list`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield call(easyPut, 'changeStore', {
        knowledgebaseList: response.data.data.dataList || [],
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield call(easyPut, 'changeStore', {
      knowledgebaseList: [],
    });
  }
}

function* likeKnowledgebase(action) { // 点赞智能专家
  const { payload } = action;
  const { knowledgeBaseId } = payload;
  const url = `${APIBasePath}${ticket.likeKnowledgebase}${knowledgeBaseId}`;
  // let url = `/mock/operation/knowledgebase/like`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.config({ top: 230, duration: 2, maxCount: 2 });
      message.success('点赞成功');
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
  }
}

// createDefect defectSubmit
function* createDefect(action) { // 创建缺陷 以及待提交状态
  const { payload } = action;
  const { defectId, func, ...params } = payload;
  const url = defectId && `${APIBasePath}${ticket.defectSubmit}` || `${APIBasePath}${ticket.createDefect}`;
  const initParams = defectId && { ...params, defectId } || params;
  try {
    const response = yield call(axios.post, url, initParams);
    if (response.data.code === '10000') {
      message.success('操作成功！');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('操作失败，请重试！');
  }
}



export function* watchDefectDetail() {
  yield takeLatest(defectDetailAction.getDefectDetail, getDefectDetail);
  yield takeLatest(defectDetailAction.getRelevancedocket, getRelevancedocket);
  yield takeLatest(defectDetailAction.getDefectCommonList, getDefectCommonList);
  yield takeLatest(defectDetailAction.getDefectTypes, getDefectTypes);
  yield takeLatest(defectDetailAction.sendDefect, sendDefect);
  yield takeLatest(defectDetailAction.rejectDefect, rejectDefect);
  yield takeLatest(defectDetailAction.closeDefect, closeDefect);
  yield takeLatest(defectDetailAction.handleDefect, handleDefect);
  yield takeLatest(defectDetailAction.checkDefect, checkDefect);
  yield takeLatest(defectDetailAction.getKnowledgebase, getKnowledgebase);
  yield takeLatest(defectDetailAction.likeKnowledgebase, likeKnowledgebase);
  yield takeLatest(defectDetailAction.createDefect, createDefect);
}

