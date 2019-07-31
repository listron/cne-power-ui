import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';




export function* watchDataAnalysisScatterSaga() {
  // yield takeLatest(dataAnalysisScatterAction.CHANGE_ALLSTATIONDATA_STORE_SAGA, changeAllStationStore);


}