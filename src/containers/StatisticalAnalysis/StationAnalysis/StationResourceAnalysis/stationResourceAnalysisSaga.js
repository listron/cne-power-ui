import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';

function* changeResourceStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
    payload
  })
}


function *resetStore(){
  yield put({
    type:  stationResourceAnalysisAction.RESET_STORE
  })
}


function* getAllStationAvalibaData(action) {//判断是否有数据
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourceAvalibaData: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourceAvalibaData: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function*  getResourcePlan(action){ // 计划完成情况
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getResourcePlan}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourcePlanData: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourcePlanData: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getResourcePvCompare(action) {//月/日单电站光资源同比
  const { payload } = action;
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPvCompare}`
    try{
      yield put({ type:stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
          payload: {
            PvCompareData: response.data.data||[],          
          },
        });     
      } else{
        yield put({
          type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
          payload:{
            PvCompareData: [],
          },
        });
      } 
    }catch(e){
      console.log(e);
    }
}

function* getResourceYearPvCompare(action) {//年单电站光资源环比
  const { payload } = action;  
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationYearPvCompare}`
    try{
      yield put({ type:stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
      const response = yield call(axios.post,url,payload);
      if(response.data.code === '10000') {
        yield put({
          type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
          payload: {
            YearPvCompareData: response.data.data||[],          
          },
        });     
      } else{
        yield put({
          type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
          payload:{
            YearPvCompareData: [],
          },
        });
      } 
    }catch(e){
      console.log(e);
    }
}

function* getResourceMonthLight(action){ //月/日光资源分布
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getResourceMonthLight}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourceMonthLight: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourceMonthLight: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getResourceYearLight(action){ //年光资源分布
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getResourceYearLight}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourceYearLight: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourceYearLight: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function* getResourceMonthWeather(action){ //月/年天气预报
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getResourceMonthWeather}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourceMonthWeather: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourceMonthWeather: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function* getResourceDayWeather(action){ //日天气预报
  const { payload } = action;
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getResourceDayWeather}`
  try {
    yield put({ type: stationResourceAnalysisAction.STATIONRESOURCESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationResourceAnalysisAction.GET_STATIONRESOURCESTATIONDATA_FETCH_SUCCESS,
        payload: {
          resourceDayWeather: response.data.data || [],
        },
      });
    }else{
      yield put({
        type:  stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE,
        payload:{
          resourceDayWeather: [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}



export function* watchStationResourceStationSaga() {
  yield takeLatest(stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA, changeResourceStore);
  yield takeLatest(stationResourceAnalysisAction.getAllStationAvalibaData, getAllStationAvalibaData);
  yield takeLatest(stationResourceAnalysisAction.getResourcePlan, getResourcePlan);
  yield takeLatest(stationResourceAnalysisAction.getResourceMonthLight, getResourceMonthLight);
  yield takeLatest(stationResourceAnalysisAction.getResourceYearLight, getResourceYearLight);
  yield takeLatest(stationResourceAnalysisAction.getResourceMonthWeather, getResourceMonthWeather);
  yield takeLatest(stationResourceAnalysisAction.getResourceDayWeather, getResourceDayWeather);
  yield takeLatest(stationResourceAnalysisAction.getResourcePvCompare, getResourcePvCompare);
  yield takeLatest(stationResourceAnalysisAction.getResourceYearPvCompare, getResourceYearPvCompare);
  yield takeLatest(stationResourceAnalysisAction.RESET_STORE, resetStore);
}