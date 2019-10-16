import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '@constants/path';
import { centerInvertAction } from './centerInvertReducer';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

function* getCenterInverList(action) {
  const { payload } = action;
  const { dateType } = payload;
  const dateTypeArr = ['day', 'month'];
  const url = dateTypeArr.includes[dateType] ? `${APIBasePath}${reportManage.getCenterInvert}` : `${APIBasePath}${reportManage.getDayCenterInvert}`;
  try {
    yield put({
      type: centerInvertAction.changeStore,
      payload: {
        listLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: centerInvertAction.changeStore,
        payload: {
          reportList: response.data.data || [],
          listLoading: false,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取电站报表列表数据失败！');
    yield put({
      type: centerInvertAction.changeStore,
      payload: {
        reportList: [],
        listLoading: false,
      },
    });
    console.log(e);
  }
}

function* exportCenterInvert(action) {
  const { payload } = action;
  const { dateType } = payload;
  const dateTypeArr = ['day', 'month'];
  const url = dateTypeArr.includes[dateType] ? `${APIBasePath}${reportManage.getCenterInvert}` : `${APIBasePath}${reportManage.getDayCenterInvert}`;
  try {
    yield put({
      type: centerInvertAction.changeStore,
      payload: {
        exportLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.info('导出成功');
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('导出失败');
    yield put({
      type: centerInvertAction.changeStore,
      payload: {
        reportList: [],
        exportLoading: false,
      },
    });
    console.log(e);
  }
}


export function* watchCenterInvert() {
  yield takeLatest(centerInvertAction.getCenterInverList, getCenterInverList);
  yield takeLatest(centerInvertAction.exportCenterInvert, exportCenterInvert);

}
