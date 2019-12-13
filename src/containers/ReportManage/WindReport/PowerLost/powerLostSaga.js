import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { powerLostAction } from './powerLostAction';
import moment from 'moment';

const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor

function* getPowerLostList(action) {  // 请求报表列表
  const { payload } = action;
  const{startTime,endTime,}=payload;
  const url = `${APIBasePath}${monitor.getPowerReportList}`;
  // const url = `${APIBasePath}${monitor.getPowerLostList}`;
  try {
    yield put({
      type: powerLostAction.changePowerLostStore,
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
        type: powerLostAction.changePowerLostStore,
        payload: {
          filterTable:payload.summaryType,
          total: response.data.data.pageCount || 0,
          powerLostList: response.data.data.dataList || [],
          loading: false,
          ...payload,
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: powerLostAction.changePowerLostStore,
      payload: { ...payload, loading: false, powerLostList: [] },
    })
  }
}


export function* watchMonitorPowerLost() {
  yield takeLatest(powerLostAction.getPowerLostList, getPowerLostList);
}