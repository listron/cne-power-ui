import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { reportStationAction } from './reportStationAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

function* getReportStationList(action) {
  const { payload } = action;
  const url = `${APIBasePath}${reportManage.getReportStationList}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: reportStationAction.changeStore,
        payload: {
          reportStationList: response.data.data || []
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取电站报表列表数据失败！');
    yield put({
      type: reportStationAction.changeStore,
      payload: {
        reportStationList: []
      },
    });
    console.log(e);
  }

}
export function* watchReportStation() {
  yield takeLatest(reportStationAction.getReportStationList, getReportStationList);

}