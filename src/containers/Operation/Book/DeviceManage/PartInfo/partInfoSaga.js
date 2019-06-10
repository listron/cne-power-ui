import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { partInfoAction } from './partInfoAction';
import moment from 'moment';
const APIBasePath = Path.basePaths.APIBasePath;
const operation = Path.APISubPaths.operation;

function* getAssetTree(action) {  // 生产资产树
  const { payload } = action;
  // const url =`${APIBasePath}${operation.getAssetTree}`;
  const url = `/mock/v3/ledger/assetslist`;
  const nowTime = moment().utc();
  try {
    const response = yield call(axios.post, url, { ...payload, assetsParentId: '0', nowTime });
    if (response.data.code === '10000') {
      yield put({
        type: partInfoAction.changePartInfoStore,
        payload: {
          ...payload,
         
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: partInfoAction.changePartInfoStore,
      payload: { ...payload, loading: false,  },
    })
  }
}

export function* watchBookAssetsConfig() {
  yield takeLatest(partInfoAction.getAssetTree, getAssetTree);
 
}