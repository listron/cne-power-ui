import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { operateAnalysisAction } from './operateAnalysisAction';

function* changeOperateStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;

  yield put({
    type: operateAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE,
    payload
  })
}


export function* watchOperateStationSaga() {
  yield takeLatest(operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE_SAGA, changeOperateStationStore);

}