import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';

function* changeProductionStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
    payload
  })
}

export function* watchStationResourceStationSaga() {
  yield takeLatest(stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA, changeProductionStationStore);
  

}