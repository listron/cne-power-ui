import { call, takeLatest,put,all } from 'redux-saga/effects';
import axios from "axios";
import Path from '../../../../constants/path';
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
function* getEleLineCode(action) {//集电线路
  const { payload } = action;
    //const url = '';
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getEleLineCode}/${payload.stationCode}/${payload.deviceTypeCode}`
    try{
      yield put({ type:performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH  });
      const response = yield call(axios.get,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {
            eleLineCodeData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}
function* getPerformance(action) {
  const { payload } = action;
    //const url = '';
    const conversioneffUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getconversioneff}`
    const hoursUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHours}`
    const availabilityUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailability}`
    try{
      yield put({ type:performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
      const [conversioneff,hour,availability] = yield all([call(axios.post,conversioneffUrl,{...payload}),call(axios.post,hoursUrl,{...payload,dataType:'hour'}),call(axios.post,availabilityUrl,{...payload})]);
      if(conversioneff.data.code === '10000') {
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {
            conversioneffData: conversioneff.data.data||[],          
          },
        });     
      }  
      if(hour.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            hourData: hour.data.data||[],          
          },
        });     
      }
      if(availability.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            availabilityData: availability.data.data||[],          
          },
        });     
      }
    }catch(e){
      console.log(e);
    }
}
function* getFault(action) {
  const { payload } = action;
    //const url = '';
    const availabilityUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailability}`
    const hoursUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHours}`
    try{
      yield put({ type:performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
      const [availability,faultNum,faultTime] = yield all([call(axios.post,availabilityUrl,{...payload}),call(axios.post,hoursUrl,{...payload,dataType:'faultNum'}),call(axios.post,hoursUrl,{...payload,dataType:'faultTime'})]);
      if(availability.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            lostPowerData: availability.data.data||[],          
          },
        });     
      }
      if(faultNum.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            faultNumData: faultNum.data.data||[],          
          },
        });     
      }
      if(faultTime.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            faultTimeData: faultTime.data.data||[],          
          },
        });     
      }
    
    }catch(e){
      console.log(e);
    }
}
function* getPerformanceContrast(action) {
  const { payload } = action;
    //const url = '';
    const conversioneffUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getconversioneffContrast}`
    const hoursUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHoursContrast}`
    const availabilityUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailabilityContrast}`
    try{
      yield put({ type:performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
      const [conversioneff,hour,availability] = yield all([call(axios.post,conversioneffUrl,{...payload}),call(axios.post,hoursUrl,{...payload,dataType:'hour'}),call(axios.post,availabilityUrl,{...payload})]);
      if(conversioneff.data.code === '10000') {
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {
            conversioneffData: conversioneff.data.data||[],          
          },
        });     
      }  
      if(hour.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            hourData: hour.data.data||[],          
          },
        });     
      }
      if(availability.data.code==='10000'){
        yield put({
          type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
          payload: {                 
            availabilityData: availability.data.data||[],          
          },
        });     
      }
    }catch(e){
      console.log(e);
    }
}
function* getFaultContrast(action) {
  const { payload } = action;
  //const url = '';
  const availabilityUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailabilityContrast}`
  const hoursUrl= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHoursContrast}`
  try{
    yield put({ type:performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [availability,faultNum,faultTime] = yield all([call(axios.post,availabilityUrl,{...payload}),call(axios.post,hoursUrl,{...payload,dataType:'faultNum'}),call(axios.post,hoursUrl,{...payload,dataType:'faultTime'})]);
    if(availability.data.code==='10000'){
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {                 
          lostPowerData: availability.data.data||[],          
        },
      });     
    }
    if(faultNum.data.code==='10000'){
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {                 
          faultNumData: faultNum.data.data||[],          
        },
      });     
    }
    if(faultTime.data.code==='10000'){
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {                 
          faultTimeData: faultTime.data.data||[],          
        },
      });     
    }
  
  }catch(e){
    console.log(e);
  }
}



export function* watchPerformanceAnalysisSaga() {
  yield takeLatest(performanceAnalysisAction.getEquipmentSelection, getEquipmentSelection);
  yield takeLatest(performanceAnalysisAction.getEleLineCode, getEleLineCode);
  yield takeLatest(performanceAnalysisAction.getPerformance, getPerformance);
  yield takeLatest(performanceAnalysisAction.getFault, getFault);
  yield takeLatest(performanceAnalysisAction.getPerformanceContrast, getPerformanceContrast);
  yield takeLatest(performanceAnalysisAction.getFaultContrast, getFaultContrast);
 
}
