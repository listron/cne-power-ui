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

function* getAllStationAvalibaData(action) {//判断是否有数据
  const { payload } = action;
  const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
  //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`
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
          operatePlanCompleteData: response.data.data || [],
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          operatePlanCompleteData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        operatePlanCompleteData: [],
      },
    });
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
          powerData: response.data.data || [],
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          powerData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        powerData: [],
      },
    });
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
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          efficiencyData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        efficiencyData: [],
      },
    });
  }
}

function* getUsageRate(action) {//月/年/日组件可利用率
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
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          usageData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        usageData: [],
      },
    });
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
      }else{
        yield put({
          type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
          payload: {
            lostPowerData: [],
          },
        });
      }
    } catch (e) {
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          lostPowerData: [],
        },
      });
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
          lostPowerTypeDatas: response.data.data,
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          lostPowerTypeDatas: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        lostPowerTypeDatas: [],
      },
    });
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
          limitPowerData: response.data.data,
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          limitPowerData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        limitPowerData: [],
      },
    });
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
          yearLimitPowerData: response.data.data,
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          yearLimitPowerData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        yearLimitPowerData: [],
      },
    });
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
          plantPowerData: response.data.data,
        },
      });
    }else{
      yield put({
        type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
        payload: {
          yearLimitPowerData: [],
        },
      });
    }
  } catch (e) {
    yield put({
      type: operateAnalysisAction.GET_OPERATESTATIONDATA_FETCH_SUCCESS,
      payload: {
        yearLimitPowerData: [],
      },
    });
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
}