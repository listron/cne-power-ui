import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import path from '../../../../constants/path';
import { achieveAction } from './';

const { APIBasePath } = path.basePaths;
const { highAnalysis } = path.APISubPaths;

function *getCleanWarningList(action) { // 获取清洗预警列表
  const { payload } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getCleanWarningList}`;
    // const url = '/mock/cleanWarning/list';
    yield put({ type: cleanWarningAction.CLEAN_WARNING_FETCH });
    const response = yield call(axios.post,url,payload);
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS,
        payload: {
          listQueryParams: {
            ...payload,
            pageNum,
          },
          total,
          cleanWarningList: response.data.data.detailData || [],          
        },
      }); 
    } else { throw response.data }
  } catch(error) {
    console.log(error);
    message.error('获取预警列表失败, 请刷新重试!');
  }
}

function *getCleanWarningDetail(action) { // 清洗预警详情
  const { payload } = action;
  try {
    const url = `${APIBasePath}${highAnalysis.getCleanWarningDetail}/${payload.stationCode}`;
    // const url = '/mock/cleanWarning/detail';
    const response = yield call(axios.get,url);
    if (response.data.code === '10000') {
      yield put({
        type: cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS,
        payload: {
          showPage: 'detail',
          dustEffectInfo: response.data.data || [],          
        },
      });
    } else { throw response.data }
  } catch(error) {
    console.log('获取预警详情失败，请重试');
  }
}

function *getTotalDustEffect(action) { // 全局灰尘影响
  const { payload } = action;
  try {
    const { stationCode, startDay, endDay } = payload;
    const url = `${APIBasePath}${highAnalysis.getTotalDustEffect}/${stationCode}/${startDay}/${endDay}`;
    // const url = '/mock/cleanWarning/totalEffect';
    const response = yield call(axios.get,url);
    if (response.data.code === '10000') {
      yield put({
        type: cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS,
        payload: {
          totalEffects: response.data.data || [],          
        },
      }); 
    } else { throw response.data }
  } catch(error) {
    console.log(error);
  }
}

function *getMatrixDustEffect(action) { // 方阵灰尘影响
  const { payload } = action;
  try {
    const { stationCode, startDay, endDay } = payload;
    const url = `${APIBasePath}${highAnalysis.getMatrixDustEffect}/${stationCode}/${startDay}/${endDay}`;
    // const url = '/mock/cleanWarning/matrixEffect';
    const response = yield call(axios.get,url);
    if (response.data.code === '10000') {
      yield put({
        type: cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS,
        payload: {
          showPage: 'detail',
          matrixEffects: response.data.data || [],          
        },
      }); 
    } else { throw response.data }
  } catch(error) {
    console.log(error);
  }
}

export function* watchCleanWarning() {
  yield takeLatest(cleanWarningAction.getCleanWarningList, getCleanWarningList);
  yield takeLatest(cleanWarningAction.getCleanWarningDetail, getCleanWarningDetail);
  yield takeLatest(cleanWarningAction.getTotalDustEffect, getTotalDustEffect);
  yield takeLatest(cleanWarningAction.getMatrixDustEffect, getMatrixDustEffect);
}

