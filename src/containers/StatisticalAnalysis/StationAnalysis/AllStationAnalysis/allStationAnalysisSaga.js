import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allStationAnalysisAction } from './allStationAnalysisAction.js';

function* changeAllStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE,
    payload
  })
}
export function* watchAllStationSaga() {
  // yield takeLatest(allStationAnalysisAction.GET_ALLSTATIONDATA_SAGA, getMonitorStation);
  yield takeLatest(allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE_SAGA, changeAllStationStore);


}