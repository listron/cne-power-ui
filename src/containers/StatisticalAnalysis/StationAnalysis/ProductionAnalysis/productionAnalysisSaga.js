import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { productionAnalysisAction } from './productionAnalysisAction';

function* changeProductionStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;

  yield put({
    type: productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE,
    payload
  })
}


export function* watchProductionStationSaga() {
  yield takeLatest(productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA, changeProductionStationStore);

}