import { call, takeLatest } from 'redux-saga/effects';
import axios from "axios";
import { performanceAnalysisAction } from "./performanceAnalysisAction";

function* getEquipmentSelection(action){
  const { payload } = action;
  const url = '';
  try {
    const response = yield call(axios.post,url,payload);
    console.log(response);
  }catch(error){
    console.log(error);
  }
}

export function* watchPerformanceAnalysisSaga() {
  yield takeLatest(performanceAnalysisAction.getEquipmentSelection, getEquipmentSelection);
}