import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { deviceStatusAction } from './deviceStatusAction';
import moment from 'moment';
import { cloneableGenerator } from 'redux-saga/utils';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor

function* getDeviceStatusList(action) {  // 请求报表列表
  const { payload } = action;

  const { startTime, endTime } = payload;
  const url = `${APIBasePath}${monitor.getDeviceStatusList}`;
  // const url = `/mock/v3/wind/report/fan/devicestatus`;
  try {
    yield put({
      type: deviceStatusAction.changeDeviceStatusStore,
      payload: {
        ...payload,
        loading: true,

      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      // startTime:moment( startTime).utc().format(''),
      // endTime:moment( endTime).utc().format(''),
      timeZone: moment().utcOffset() / 60,

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
        type: deviceStatusAction.changeDeviceStatusStore,
        payload: {
          total: response.data.data.pageCount || 0,
          deviceStatusList: response.data.data.dataList || [],
          loading: false,
          ...payload,
          filterTable: payload.summaryType
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);

    yield put({
      type: deviceStatusAction.changeDeviceStatusStore,
      payload: { ...payload, loading: false, deviceStatusList: [] },
    })
  }
}
function* getDeviceStatusDetail(action) {  // 请求设备状态明细
  const { payload } = action;
  const { startTime, endTime } = payload;
  const url = `${APIBasePath}${monitor.getDeviceStatusDetail}`;
  // const url = `/mock/v3/wind/report/fan/devicestatus/detail`;
  try {
    yield put({
      type: deviceStatusAction.changeDeviceStatusStore,
      payload: {
        ...payload,
        loading: true,

      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      // startTime:moment( startTime).utc().format(''),
      // endTime:moment( endTime).utc().format(''),
      timeZone: moment().utcOffset() / 60,

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
        type: deviceStatusAction.changeDeviceStatusStore,
        payload: {
          total: response.data.data.pageCount || 0,
          statusDetailList: response.data.data.dataList || [],
          loading: false,
          ...payload,
          filterTable: payload.summaryType
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: deviceStatusAction.changeDeviceStatusStore,
      payload: { ...payload, loading: false, statusDetailList: [] },
    })
  }
}


export function* watchMonitorDeviceStatus() {
  yield takeLatest(deviceStatusAction.getDeviceStatusList, getDeviceStatusList);
  yield takeLatest(deviceStatusAction.getDeviceStatusDetail, getDeviceStatusDetail);
}