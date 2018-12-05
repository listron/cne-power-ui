import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { cleanoutRecordAction } from './cleanoutRecordAction';

function *changeCleanoutRecordStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  cleanoutRecordAction.RESET_STORE
  })
}
function* getStationDust(action) {//综合指标年月判断
  const { payload } = action;
    //const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
   const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getStationDust}`
    try{
      yield put({ type:cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
          payload: {
            allStationAvalibaData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}






export function* watchCleanoutRecord() {
  yield takeLatest(cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA, changeCleanoutRecordStore);
  yield takeLatest(cleanoutRecordAction.resetStore, resetStore);

  yield takeLatest(cleanoutRecordAction.getStationDust, getStationDust);
  yield takeLatest(cleanoutRecordAction.getMatrixDust, getMatrixDust);
  yield takeLatest(cleanoutRecordAction.getMainList, getMainList);
  yield takeLatest(cleanoutRecordAction.getDetailList, getDetailList);
  yield takeLatest(cleanoutRecordAction.getAddCleanPlan, getAddCleanPlan);
  yield takeLatest(cleanoutRecordAction.getEditCleanPlan, getEditCleanPlan);
  yield takeLatest(cleanoutRecordAction.getCleanPlanDetail, getCleanPlanDetail);
  yield takeLatest(cleanoutRecordAction.deleteCleanPlan, deleteCleanPlan);
  yield takeLatest(cleanoutRecordAction.getAddRainPlan, getAddRainPlan);
  yield takeLatest(cleanoutRecordAction.getEditRainPlan, getEditRainPlan);
  yield takeLatest(cleanoutRecordAction.getRainPlanDetail, getRainPlanDetail);
  yield takeLatest(cleanoutRecordAction.getPlanRecordList, getPlanRecordList);
  yield takeLatest(cleanoutRecordAction.getAddCleanRecord, getAddCleanRecord);
  yield takeLatest(cleanoutRecordAction.editCleanRecord, editCleanRecord);
  yield takeLatest(cleanoutRecordAction.getCleanRecordDetail, getCleanRecordDetail);
  yield takeLatest(cleanoutRecordAction.deleteCleanRecord, deleteCleanRecord);
 
 
}

