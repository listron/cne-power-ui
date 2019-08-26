import { put, takeLatest, call } from 'redux-saga/effects';
import request from '../../../../utils/request';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dailyQueryAction } from './dailyQueryAction';

const { APIBasePath } = Path.basePaths;
const { statisticalAnalysis } = Path.APISubPaths;

const dataArr = (data, label, value) => {
  if (!data.list) {
    return { ...data, children: data.list, label: data[label], value: data[value] };
  }
  const children = data.list.map(e => dataArr(e, label, value));
  return { ...data, children, label: data[label], value: data[value] };
};

function* getQuota({ payload = {} }) { // 获取指标
  const { stationType } = payload;
  const url = `${APIBasePath}${statisticalAnalysis.getQuota}/${stationType}`;
  try {
    const response = yield call(request.get, url, payload);
    if (response.code === '10000') {
      const quotaData = response.data && response.data.map(cur=>{
        return dataArr(cur, 'desc', 'code');
      });
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          quotaData: quotaData,
        },
      });
      }else {
        throw response.data;
      }
  }catch(e) {
    message.error('获取关键指标数据失败！');
    console.log(e);
  }
}

function* getFault({ payload = {} }) { // 获取故障类型
  const url = `${APIBasePath}${statisticalAnalysis.getFault}`;
  try {
    const response = yield call(request.get, url, {params: payload});
    if (response.code === '10000') {
      const faultData = response.data && response.data.map(cur=>{
        return dataArr(cur, 'name', 'id');
      });
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          faultData: faultData,
        },
      });
      }else {
        throw response.data;
      }
  }catch(e) {
    message.error('获取关键指标数据失败！');
    console.log(e);
  }
}

function *getQuotaList({ payload = {} }) { // 关键指标列表
  const url = `${APIBasePath}${statisticalAnalysis.getQuotaList}`;
  try{
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: {
        tableLoading: true,
      },
    });
    const response = yield call(request.post, url, {...payload});
    const { total = 0 } = response.data;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.code === '10000') {
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          listParam: {
            ...payload,
            pageNum,
            pageSize,
          },
          tableLoading: false,
          quotaListData: response.data || {},
        },
      });
    } else {
      throw response;
    }
  }catch(error) {
    message.error('获取关键指标列表信息失败!');
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: { tableLoading: false },
    });
    console.log(error);
  }
}

function *getFaultList({ payload = {} }) { // 故障信息列表
  const url = `${APIBasePath}${statisticalAnalysis.getFaultList}`;
  try{
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: {
        tableLoading: true,
      },
    });
    const response = yield call(request.post, url, {...payload});
    const { total = 0 } = response.data;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.code === '10000') {
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          listParam: {
            ...payload,
            pageNum,
            pageSize,
          },
          tableLoading: false,
          faultListData: response.data || {},
        },
      });
    } else {
      throw response;
    }
  }catch(error) {
    message.error('获取故障信息列表信息失败!');
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: { tableLoading: false },
    });
    console.log(error);
  }
}

function *getLimitList({ payload = {} }) { // 故障信息列表
  const url = `${APIBasePath}${statisticalAnalysis.getLimitList}`;
  try{
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: {
        tableLoading: true,
      },
    });
    const response = yield call(request.post, url, {...payload});
    const { total = 0 } = response.data;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.code === '10000') {
      yield put({
        type: dailyQueryAction.GET_DAILYQUERY_SUCCESS,
        payload: {
          listParam: {
            ...payload,
            pageNum,
            pageSize,
          },
          tableLoading: false,
          limitListData: response.data|| {},
        },
      });
    } else {
      throw response;
    }
  }catch(error) {
    message.error('获取故障信息列表信息失败!');
    yield put({
      type: dailyQueryAction.changeDailyQueryStore,
      payload: { tableLoading: false },
    });
    console.log(error);
  }
}

export function* watchDailyQuery() {
  yield takeLatest(dailyQueryAction.getQuota, getQuota);
  yield takeLatest(dailyQueryAction.getFault, getFault);
  yield takeLatest(dailyQueryAction.getQuotaList, getQuotaList);
  yield takeLatest(dailyQueryAction.getFaultList, getFaultList);
  yield takeLatest(dailyQueryAction.getLimitList, getLimitList);
}
