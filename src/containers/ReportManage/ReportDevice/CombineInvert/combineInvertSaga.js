import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '@constants/path';
import { combineInvertAction } from './combineInvertReducer';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

function* getCombineInvertList(action) {
  const { payload } = action;
  const { dateType } = payload;
  const dateTypeArr = ['day', 'month'];
  const url = dateTypeArr.includes(dateType) ? `${APIBasePath}${reportManage.getCombineInvert}` : `${APIBasePath}${reportManage.getDayCombineInvert}`;
  try {
    yield put({
      type: combineInvertAction.changeStore,
      payload: {
        listLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const totalNum = response.data.data.pageCount || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if (totalNum === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      const tmpParmas = yield select((state) => {
        return state.reportManageReducer.combineInvert.get('parmas').toJS();
      });
      yield put({
        type: combineInvertAction.changeStore,
        payload: {
          total: totalNum,
          reportList: response.data.data.dataList || [],
          listLoading: false,
          parmas: {
            ...tmpParmas,
            pageNum,
          },
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取电站报表列表数据失败！');
    yield put({
      type: combineInvertAction.changeStore,
      payload: {
        reportList: [],
        listLoading: false,
      },
    });
    console.log(e);
  }
}

function* getDisabledStation(action) {
  const url = `${APIBasePath}${reportManage.disabledStations}`;
  try {
    const response = yield call(axios.post, url, { deviceTypeCode: 206 });
    if (response.data.code === '10000') {
      yield put({
        type: combineInvertAction.changeStore,
        payload: {
          disabledStation: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    yield put({
      type: combineInvertAction.changeStore,
      payload: {
        disabledStation: [],
      },
    });
    console.log(e);
  }
}



export function* watchCombineInvert() {
  yield takeLatest(combineInvertAction.getCombineInvertList, getCombineInvertList);
  yield takeLatest(combineInvertAction.getDisabledStation, getDisabledStation);
}
