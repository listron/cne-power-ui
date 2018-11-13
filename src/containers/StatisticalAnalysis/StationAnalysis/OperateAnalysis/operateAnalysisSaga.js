import { call, put, takeLatest, all } from 'redux-saga/effects';
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

function *resetStore(){
  yield put({
    type:  operateAnalysisAction.RESET_STORE
  })
}

function* getAllStationAvalibaData(action) {//判断是否有数据
  const { payload } = action;
  // const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
  const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          operateAvalibaData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getOperatePlanComplete(action) {//年/月/日计划完成情况
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperatePlanComplete}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          operatePlanCompleteData: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求计划完成情况失败')
  }
}
function* getComponentPowerStatistic(action) {//月/年/日组件发电量统计
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperateComponentPower}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          powerData: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求组件发电量统计失败',e)   
  }
}


function* getPowerEfficiency(action){ // 月/年/日发电效率
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPowerEffective}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          efficiencyData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求发电效率失败')
  }
}

function* getUsageRate(action) {//月/年/日可利用率
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperateUsageRate}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          usageData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求可利用率失败')
  }
}

function* getlostPower(action){ // 年/月/日单电站 损失电量
  const { payload } = action;
    const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationTarget}`
   
    try {
      yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
      const response = yield call(axios.post, url, payload);
      if (response.data.code === '10000') {
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            lostPowerData: response.data.data || [],
          },
        });
      }
    } catch (e) {
      console.log(e);
      console.log('请求损失电量失败')
    }
}

function* getLostPowerType(action) {//月/年/日电量损失类型
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperateLostPowerType}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          lostPowerTypeDatas: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
   console.log('请求电量损失类型失败')
  }
}
function* getLimitPowerRate(action) {//月/日限电率同比
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperateLimitPowerRate}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          limitPowerData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
     console.log('请求限电率失败')
  }
}
function* getYearLimitPowerRate(action) {//年限电率环比
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperateYearLimitPower}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          yearLimitPowerData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求年限电率失败')
  }
}
function* getPlantPower(action) {//月/年/日厂用电情况/厂损情况
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getOperatePlantPower}`;
  try {
    yield put({ type: operateAnalysisAction.OPERATESTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          plantPowerData: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
    console.log('请求厂用电情况/厂损情况失败')
  }
}

export function* watchOperateStationSaga() {
  yield takeLatest(operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE_SAGA, changeOperateStationStore);
  yield takeLatest(operateAnalysisAction.getAllStationAvalibaData, getAllStationAvalibaData);
  yield takeLatest(operateAnalysisAction.getOperatePlanComplete, getOperatePlanComplete);
  yield takeLatest(operateAnalysisAction.getComponentPowerStatistic, getComponentPowerStatistic);
  yield takeLatest(operateAnalysisAction.getLostPowerType, getLostPowerType);
  yield takeLatest(operateAnalysisAction.getLimitPowerRate, getLimitPowerRate);
  yield takeLatest(operateAnalysisAction.getYearLimitPowerRate, getYearLimitPowerRate);
  yield takeLatest(operateAnalysisAction.getPlantPower, getPlantPower);
  yield takeLatest(operateAnalysisAction.getUsageRate, getUsageRate);
  yield takeLatest(operateAnalysisAction.getPowerEfficiency, getPowerEfficiency);
  yield takeLatest(operateAnalysisAction.getlostPower, getlostPower);
  yield takeLatest(operateAnalysisAction.resetStore, resetStore);
}