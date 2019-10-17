import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { reportStationAction } from './reportStationAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

function* getReportStationList(action) {
  const { payload } = action;
  // const url = `${APIBasePath}${reportManage.getReportStationList}`;
  const url = '/mock/v3/sun/report/station/list';
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) {
        pageNum = 1;
      } else if (maxPage < pageNum) {
        pageNum = maxPage;
      }
      yield put({
        type: reportStationAction.changeStore,
        payload: {
          ...payload,
          total,
          reportStationList: response.data.data.dataList || [],
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
        total: 0,
        reportStationList: [],
      },
    });
    console.log(e);
  }

}
function* exportReportStationList(action) {
  const { payload } = action;
  const url = `${APIBasePath}${reportManage.exportReportStationList}`;
  try {
    yield put({
      type: reportStationAction.changeStore,
      payload: {
        exportLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);

    if (response.data.code === '10000') {
      message.success('电站报表导出成功');
      yield put({
        type: reportStationAction.changeStore,
        payload: {
          exportLoading: false,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('电站报表导出失败！');
    yield put({
      type: reportStationAction.changeStore,
      payload: {
        exportLoading: false,
      },
    });
    console.log(e);
  }

}
export function* watchReportStation() {
  yield takeLatest(reportStationAction.getReportStationList, getReportStationList);
  yield takeLatest(reportStationAction.exportReportStationList, exportReportStationList);

}
