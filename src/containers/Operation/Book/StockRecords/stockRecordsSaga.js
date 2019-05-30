import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../../constants/path';
import { stockRecordsAction } from './stockRecordsAction';
import { message } from 'antd';
// import moment from 'moment';
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

function *getWarehouseName({ payload = {} }) { // 选择仓库名称
  try{
    const url = `${APIBasePath}${operation.warehouseName}`;
    yield put({
      type: stockRecordsAction.stockRecordsStore,
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: stockRecordsAction.GET_STOCKRECORDS_SUCCESS,
        payload: {
          ...payload,
          warehouseNames: response.data.data || []
        }
      })
    } else {
      throw response.data;
    }
  }catch(error) {
    message.error('获取仓库名称信息失败!');
    console.log(error);
  }
}

function *getInRecordList({ payload = {} }) { // 入库列表
  const url = `${APIBasePath}${operation.inRecordList}`;
  try{
    yield put({
      type: stockRecordsAction.stockRecordsStore,
      payload: {
        tableLoading: true,
        ...payload,
      }
    })
    const response = yield call(axios.post, url, {...payload});
    const { pageCount = 0 } = response.data.data;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(pageCount / pageSize);
    if (pageCount === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: stockRecordsAction.GET_STOCKRECORDS_SUCCESS,
        payload: {
          ...payload,
          pageNum,
          pageSize,
          tableLoading: false,
          inRecordListData: response.data.data || {},
        },
      });
    } else {
      throw response.data
    }
  }catch(error) {
    message.error('获取入库列表信息失败!');
    console.log(error);
  }
}
 


export function* watchStockRecords() {
  yield takeLatest(stockRecordsAction.getWarehouseName, getWarehouseName);
  yield takeLatest(stockRecordsAction.getInRecordList, getInRecordList);
}