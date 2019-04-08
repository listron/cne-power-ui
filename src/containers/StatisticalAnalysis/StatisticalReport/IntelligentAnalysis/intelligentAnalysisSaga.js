import { put, takeLatest, } from 'redux-saga/effects';
// import axios from 'axios';
// import { message } from 'antd';
// import Path from '../../../../constants/path';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';

function* changeIntelligentAnalysisStore({ payload = {} }) { // 存储payload指定参数，替换reducer-store属性。
  yield put({
    type: intelligentAnalysisAction.changeIntelligentAnalysisStore,
    payload,
  })
}

// function* getSingleStationAnalysis({ payload = {} }){
//   const { genValid } = payload;
//   const url = '/mock/statisticalAnalysis/intelligence/analysis/station';
//   try{
//     const response = yield call(axios.post, url, {
      
//     }
//   }
// }

export function* watchIntelligentAnalysis() {
  yield takeLatest(intelligentAnalysisAction.CHANGE_INTELLIGENT_ANALYSIS_STORE_SAGA, changeIntelligentAnalysisStore);
  // yield takeLatest(intelligentAnalysisAction.getSingleStationAnalysis, getSingleStationAnalysis);
}