import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { malfunctionAction } from './malfunctionAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor

function* getMalfunctionList(action) {  // 请求报表列表
  const { payload } = action;
  const {startTime,endTime}= payload;
  const url = `${APIBasePath}${monitor.getMalfunctionList}`;
  // const url = `/mock/v3/wind/report/fan/devicefault`;
  try {
    yield put({
      type: malfunctionAction.changeMalfunctionStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      // startTime:moment( startTime).utc().format(''),
      // endTime:moment( endTime).utc().format(''),
      timeZone:moment().utcOffset() / 60,
     
    });
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: malfunctionAction.changeMalfunctionStore,
        payload: {
          total: response.data.data.pageCount || 0,
          malfunctionList: response.data.data.dataList || [],
          loading: false,
          ...payload,
          filterTable:payload.summaryType
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: malfunctionAction.changeMalfunctionStore,
      payload: { ...payload, loading: false, malfunctionList: [] },
    })
  }
}
function* getMalfunctionDetail(action) {  // 请求设备状态明细
  const { payload } = action;
  const {startTime,endTime}= payload;
  const url = `${APIBasePath}${monitor.getMalfunctionDetail}`;
  // const url = `/mock/v3/wind/report/fan/devicefault/detail`;
  try {
    yield put({
      type: malfunctionAction.changeMalfunctionStore,
      payload: {
        ...payload,
        loading: true,
       
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      // startTime:moment( startTime).utc().format(''),
      // endTime:moment( endTime).utc().format(''),
      timeZone:moment().utcOffset() / 60,

    });
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: malfunctionAction.changeMalfunctionStore,
        payload: {
          total: response.data.data.pageCount || 0,
          malfunctionDetailList: response.data.data.dataList || [],
          loading: false,
          ...payload,
          filterTable:payload.summaryType
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: malfunctionAction.changeMalfunctionStore,
      payload: { ...payload, loading: false, malfunctionDetailList: [] },
    })
  }
}


export function* watchMonitorMalfunction() {
  yield takeLatest(malfunctionAction.getMalfunctionList, getMalfunctionList);
  yield takeLatest(malfunctionAction.getMalfunctionDetail, getMalfunctionDetail);
}