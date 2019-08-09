import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { dataAnalysisSequenceAction } from './dataAnalysisSequenceAction';
import moment from 'moment';




export function* watchDataAnalysisSequenceSaga() {
  // yield takeLatest(dataAnalysisSequenceAction.getScatterName, getScatterName);
  // yield takeLatest(dataAnalysisSequenceAction.getScatterOtherName, getScatterOtherName);
  // yield takeLatest(dataAnalysisSequenceAction.getScatterData, getScatterData);
}
