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

function* getRelevancedocket(action) { // 获取当前缺陷关联的两票
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
  yield put({ type: eliminateDefectDetailAction.workOrderFetch });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: eliminateDefectDetailAction.getworkOrderFetchSuccess,
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
  yield put({ type: eliminateDefectDetailAction.workOrderFetch });
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
      // yield delay(2000), // 阻塞2秒
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('验收失败，请重试！');
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
      message.success('恭喜，您所提交信息已保存成功，可在工单列表及工作台中查看');
      func();
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.warn('操作失败，请重试！');
  }
}


export function* watchEliminateDefectDetail() {
  yield takeLatest(eliminateDefectDetailAction.getDefectDetail, getDefectDetail);
  yield takeLatest(eliminateDefectDetailAction.getRelevancedocket, getRelevancedocket);
  yield takeLatest(eliminateDefectDetailAction.getDefectCommonList, getDefectCommonList);
  yield takeLatest(eliminateDefectDetailAction.getDefectTypes, getDefectTypes);
  yield takeLatest(eliminateDefectDetailAction.sendDefect, sendDefect);
  yield takeLatest(eliminateDefectDetailAction.rejectDefect, rejectDefect);
  yield takeLatest(eliminateDefectDetailAction.closeDefect, closeDefect);
  yield takeLatest(eliminateDefectDetailAction.handleDefect, handleDefect);
  yield takeLatest(eliminateDefectDetailAction.checkDefect, checkDefect);
  yield takeLatest(eliminateDefectDetailAction.createDefect, createDefect);
}

