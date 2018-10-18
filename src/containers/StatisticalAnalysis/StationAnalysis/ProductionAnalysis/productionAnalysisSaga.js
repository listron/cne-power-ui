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
function* ProductionPlanComplete(action) {//年/月/日计划完成情况
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS,
          payload: {
            productionPlanCompleteData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}

export function* watchProductionStationSaga() {
  yield takeLatest(productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA, changeProductionStationStore);
  yield takeLatest(productionAnalysisAction.ProductionPlanComplete, ProductionPlanComplete);

}