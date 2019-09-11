import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { casePartAction } from './casePartAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

function* getDeviceMode(action) { // 获取机型
  const { payload } = action;
  const url = `${APIBasePath}${operation.getDeviceMode}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          deviceModeData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取机型列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        deviceModeData: [],
      },
    });
    console.log(e);
  }
}
function* getCasePartList(action) { // 获取列表数据
  const { payload } = action;
  const url = `${APIBasePath}${operation.getCasePartList}`;
  try {
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        tableLoading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, payload);
    const { total = 0 } = response.data.data;
    let { pageNum } = payload;
    const { pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          tableLoading: false,
          casePartTableData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        tableLoading: false,
        casePartTableData: [],
      },
    });
    console.log(e);
  }
}
function* getQuestionList(action) { // 获取问题列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getQuestionList}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          questionTypeList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取问题列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        questionTypeList: [],
      },
    });
    console.log(e);
  }
}
function* getCasePartDetail(action) { // 详情
  const { payload } = action;
  const url = `${APIBasePath}${operation.getCasePartDetail}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          caseDetail: response.data.data || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取详情列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        caseDetail: {},
      },
    });
    console.log(e);
  }
}
function* addCasePart(action) { // 添加
  const { payload } = action;
  const url = `${APIBasePath}${operation.addCasePart}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('添加案例失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* likeCase(action) { // 点赞
  const { payload } = action;
  const url = `${APIBasePath}${operation.likeCase}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('点赞失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* editCasePart(action) { // 编辑案例
  const { payload } = action;
  const url = `${APIBasePath}${operation.editCasePart}`;
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('编辑案列失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* deleteCasePart(action) { // 删除案例
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteCasePart}`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('删除案例失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* queryUseName(action) { // 获取填报人
  const { payload } = action;
  const url = `${APIBasePath}${operation.queryUseName}`;
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          userData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取填报人失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        userData: [],
      },
    });
    console.log(e);
  }
}
export function* watchCadePartSaga() {
  yield takeLatest(casePartAction.getDeviceMode, getDeviceMode);
  yield takeLatest(casePartAction.getQuestionList, getQuestionList);
  yield takeLatest(casePartAction.getCasePartList, getCasePartList);
  yield takeLatest(casePartAction.getCasePartDetail, getCasePartDetail);
  yield takeLatest(casePartAction.addCasePart, addCasePart);
  yield takeLatest(casePartAction.likeCase, likeCase);
  yield takeLatest(casePartAction.editCasePart, editCasePart);
  yield takeLatest(casePartAction.deleteCasePart, deleteCasePart);
  yield takeLatest(casePartAction.queryUseName, queryUseName);

}
