import { put, takeLatest, } from 'redux-saga/effects';
// import axios from 'axios';
// import { message } from 'antd';
// import Path from '../../../../constants/path';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

function* changeIntelligentAnalysisStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
    payload,
  })
}

export function* watchIntelligentAnalysis() {
  yield takeLatest(intelligentAnalysisAction.CHANGE_INTELLIGENT_ANALYSIS_STORE_SAGA, changeIntelligentAnalysisStore);
}