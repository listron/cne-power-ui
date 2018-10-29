import { call, put, takeLatest,all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { productionAnalysisAction } from './productionAnalysisAction';
import { allStationAnalysisAction } from '../AllStationAnalysis/allStationAnalysisAction';


function* changeProductionStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;

  yield put({
    type: productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE,
    payload
  })
}
function* getAllStationAvalibaData(action) {//综合指标年月判断
  const { payload } = action;
    //const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
   const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`
    try{
      yield put({ type:productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      console.log(response.data.data,'有数据的年或者月');
      if(response.data.code === '10000') {
        yield put({
          type: productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS,
          payload: {
            allStationAvalibaData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* ProductionPlanComplete(action) {//年/月/日计划完成情况
  const { payload } = action;
    //const url = '';
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.ProductionPlanComplete}`
    try{
      yield put({ type:productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS,
          payload: {
            productionPlanCompleteData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationProductionData(action) {//月/日单电站发电量分析/损失电量/购网电量/上网电量、
  const { payload } = action;
    //const url = '/mock/api/v3/performance/comprehensive/power/monthsorYear';
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationTarget}`
    try{
      yield put({ type:productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH });
      const [powerData,buyPower,saledGen] = yield all([call(axios.post,url,{...payload,dataType:'power'}),call(axios.post,url,{...payload,dataType:'buyPower'}),call(axios.post,url,{...payload,dataType:'saledGen'})]);
      console.log(powerData.data.data, buyPower.data.data,saledGen.data.data,'发电量，购电量，上网电量');
      if(powerData.data.code === '10000'&&buyPower.data.code==='10000'&&saledGen.data.code==='10000') {
        yield put({
          type: productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS,
          payload: {
            singleStationPowerData: powerData.data.data||[],          
            singleStationBuyPowerData: buyPower.data.data||[],          
            singleStationSalePowerData: saledGen.data.data||[],          
                     
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationPlanRateData(action) {//月/年单电站计划完成率分析、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/planrate/years';
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPlanRate}`
    try{
      yield put({ type:productionAnalysisAction.PRODUCTIONSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      console.log(response.data.data,'计划完成率的数据');
      if(response.data.code === '10000') {
        yield put({
          type: productionAnalysisAction.GET_PRODUCTIONSTATIONDATA_FETCH_SUCCESS,
          payload: {
            singleStationPlanRateData: response.data.data || [],          
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
  yield takeLatest(allStationAnalysisAction.getAllStationAvalibaData, getAllStationAvalibaData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPlanRateData, getSingleStationPlanRateData);
  yield takeLatest(productionAnalysisAction.getSingleStationProductionData, getSingleStationProductionData);
  

}