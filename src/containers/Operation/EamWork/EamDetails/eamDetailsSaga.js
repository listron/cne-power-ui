import {put, call, takeLatest, select} from 'redux-saga/effects';
import {eamDetailsAction} from './eamDetailsAction';
import axios from 'axios';
import path from '@path';

import {message} from 'antd';

const {basePaths, APISubPaths} = path;
const {APIBasePath} = basePaths;
const {eamTicket} = APISubPaths;

function* getEamDetails(action) { // 获取EAM详情
  const {payload} = action;
  const url = `${APIBasePath}${eamTicket.getEamDetails}/${encodeURI(payload.workOrderNo)}`;
  try {
    yield put({
      type: eamDetailsAction.changeStore,
      payload: {
        loading: true,
        listParams: {...payload},
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { eamDetailData } = yield select(state => state.operation.eamDetails.toJS());
      yield put({
        type: eamDetailsAction.changeStore,
        payload: {
          loading: false,
          eamDetailData: {
            ...response.data.data,
            workOrder: response.data.data.workOrder ? response.data.data.workOrder : eamDetailData.workOrder,
          },
        },
      });


    } else {
      throw response.data;
    }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: eamDetailsAction.changeStore,
      payload: {
        loading: false,
      },
    });
    console.log(e);
  }
}

export function* watchEamDetail() {
  yield takeLatest(eamDetailsAction.getEamDetails, getEamDetails);
}

