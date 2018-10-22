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
function* getAllStationAvalibaData(action) {//综合指标年月判断
  const { payload } = action;
    const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
   // const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      console.log(response.data.data,'有数据的年或者月');
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationAvalibaData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getAllStationStatisticData(action) {//月/年多电站计划完成、
  const { payload } = action;
    const url = '/mock/api/v3/performance/comprehensive/plans';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationStatistic}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      console.log(response.data.data,'计划完成情况');
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationStatisticData: response.data.data||{},          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getAllStationStatisticTableData(action) {//月/年多电站table数据、
  const { payload } = action;
    const url = '/mock/api/v3/performance/comprehensive/statistics';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationStatisticTable}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      console.log(response.data.data,'电站发电量的table表格');
      const totalNum = response.data.data.pageCount||0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if(totalNum === 0){ // 总数为0时，展示0页
        pageNum = 0;
      }else if(maxPage < pageNum){ // 当前页已超出
        pageNum = maxPage;
      }
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationStatisticTableData: response.data.data.statisticsList||[], 
            totalNum,
            pageNum,
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getAllStationMonthBarData(action) {//月多电站bar数据、
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationMonthBar}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.get,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationMonthBarData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getAllStationMonthPieData(action) {//月/年多电站pie数据、
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationMonthPie}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.get,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationMonthPieData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getAllStationYearBarData(action) {//年多电站图表
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationYearBar}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            AllStationYearBarData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationStatisticData(action) {//月/年/日单电站计划完成情况
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationStatistic}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationStatisticData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationTargetData(action) {//月/日单电站发电量分析/损失电量/购网电量/上网电量、
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationTarget}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationTargetData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationMonthPieData(action) {//年单电站发电量分析/损失电量/购网电量/上网电量
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationMonthPie}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.get,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationMonthPieData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationYearTargetData(action) {//月/年单电站计划完成率分析、
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationYearTarget}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationYearTargetData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationPlanRateData(action) {//日单电站当月累计完成率、
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPlanRate}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationPlanRateData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationDayCompleteRateData(action) {//月/日单电站光资源同比
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationDayCompleteRate}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationDayCompleteRateData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationPvCompareData(action) {//年单电站光资源环比
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPvCompare}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationPvCompareData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationYearPvCompareData(action) {//月/年/日单电站发电效率
  const { payload } = action;  
  //const url = '';
  //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationYearPvCompare}`
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationYearPvCompareData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getSingleStationPowerEffectiveData(action) {//
  const { payload } = action;
    //const url = '';
    //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPowerEffective}`
  
    try{
      yield put({ type:allStationAnalysisAction.ALLSTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
          payload: {
            SingleStationPowerEffectiveData: response.data.data,          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}

export function* watchAllStationSaga() {
  yield takeLatest(allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE_SAGA, changeAllStationStore);
  yield takeLatest(allStationAnalysisAction.getAllStationAvalibaData, getAllStationAvalibaData);
  yield takeLatest(allStationAnalysisAction.getAllStationStatisticData, getAllStationStatisticData);
  yield takeLatest(allStationAnalysisAction.getAllStationStatisticTableData, getAllStationStatisticTableData);
  yield takeLatest(allStationAnalysisAction.getAllStationMonthBarData, getAllStationMonthBarData);
  yield takeLatest(allStationAnalysisAction.getAllStationMonthPieData, getAllStationMonthPieData);
  yield takeLatest(allStationAnalysisAction.getAllStationYearBarData, getAllStationYearBarData);
  yield takeLatest(allStationAnalysisAction.getSingleStationStatisticData, getSingleStationStatisticData);
  yield takeLatest(allStationAnalysisAction.getSingleStationTargetData, getSingleStationTargetData);
  yield takeLatest(allStationAnalysisAction.getSingleStationMonthPieData, getSingleStationMonthPieData);
  yield takeLatest(allStationAnalysisAction.getSingleStationYearTargetData, getSingleStationYearTargetData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPlanRateData, getSingleStationPlanRateData);
  yield takeLatest(allStationAnalysisAction.getSingleStationDayCompleteRateData, getSingleStationDayCompleteRateData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPvCompareData, getSingleStationPvCompareData);
  yield takeLatest(allStationAnalysisAction.getSingleStationYearPvCompareData, getSingleStationYearPvCompareData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPowerEffectiveData, getSingleStationPowerEffectiveData);

}