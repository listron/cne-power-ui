import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { operateAnalysisAction } from './operateAnalysisAction';

function* changeOperateStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;

  yield put({
    type: operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE,
    payload
  })
}
function* getOperatePlanComplete(action) {//年/月/日计划完成情况
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            operatePlanCompleteData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getComponentPowerStatistic(action) {//月/年/日组件发电量统计
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            componentPowerStatisticData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getUsageRate(action) {//月/年/日可利用率
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            usageRatecData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getLostPowerType(action) {//月/年/日电量损失类型
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            lostPowerTypeData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getLimitPowerRate(action) {//月/日限电率同比
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            limitPowerData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getYearLimitPowerRate(action) {//年限电率环比
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            yearLimitPowerData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getPlantPower(action) {//月/年/日厂用电情况/厂损情况
  const { payload } = action;
    //const url = '';
    try{
      yield put({ type:operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            plantPowerData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}



export function* watchOperateStationSaga() {
  yield takeLatest(operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE_SAGA, changeOperateStationStore);
  yield takeLatest(operateAnalysisAction.getOperatePlanComplete, getOperatePlanComplete);
  yield takeLatest(operateAnalysisAction.getComponentPowerStatistic, getComponentPowerStatistic);

  yield takeLatest(operateAnalysisAction.getUsageRate, getUsageRate);
  yield takeLatest(operateAnalysisAction.getLostPowerType, getLostPowerType);
  yield takeLatest(operateAnalysisAction.getLimitPowerRate, getLimitPowerRate);
  yield takeLatest(operateAnalysisAction.getYearLimitPowerRate, getYearLimitPowerRate);
  yield takeLatest(operateAnalysisAction.getPlantPower, getPlantPower);



}