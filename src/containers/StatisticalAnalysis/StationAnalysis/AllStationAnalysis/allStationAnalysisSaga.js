import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { allStationAnalysisAction } from './allStationAnalysisAction.js';

function* changeAllStationStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE,
    payload,
  });
}
function* getAllStationAvalibaData(action) {//综合指标年月判断
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/dataavaliba';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationAvaliba}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          allStationAvalibaData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getAllStationStatisticData(action) {//月/年多电站计划完成、
  const { payload } = action;
  // const url = '/mock/api/v3/performance/comprehensive/plans';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationStatistic}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          allStationStatisticData: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getAllStationStatisticTableData(action) {//月/年多电站table数据、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/statistics';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationStatisticTable}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    const totalNum = response.data.data.pageCount || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          allStationStatisticTableData: response.data.data.statisticsList || [],
          totalNum,
          pageNum,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getAllStationMonthBarData(action) {//月多电站bar数据、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/chart/monthOrYear';

  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationMonthBar}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          allStationMonthBarData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getAllStationMonthPieData(action) {//月/年多电站pie数据、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/piecharts/month/userId/dataType/year';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAllStationMonthPie}/${payload.userId}/${payload.dataType}/${payload.year}/${payload.stationType}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          allStationMonthPieData: response.data.data && response.data.data.monthPowerData || [],
          allStationMonthComplete: response.data.data && response.data.data.planRate || '',
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getSingleStationStatisticData(action) {//月/年/日单电站计划完成情况
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/plan';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationStatistic}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationStatisticData: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationTargetData(action) {//月/日单电站发电量分析/损失电量/购网电量/上网电量、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/power/monthsorYear';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationTarget}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const [powerData, lostPowerData] = yield all([call(axios.post, url, { ...payload, dataType: 'power' }), call(axios.post, url, { ...payload, dataType: 'lostPower' })]);
    if (powerData.data.code === '10000' && lostPowerData.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationPowerData: powerData.data.data || [],
          singleStationLostPowerData: lostPowerData.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationMonthPieData(action) {//月单电站图表-饼图
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/piechart/month/stationCode/year';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationMonthPie}/${payload.stationCode}/${payload.year}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationMonthPieData: response.data.data && response.data.data.monthPowerData || [],
          singleStationPlanRate: response.data.data && response.data.data.planRate || '',
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getSingleStationPlanRateData(action) {//月/年单电站计划完成率分析、
  const { payload } = action;
  //const url = '/mock/api/v3/performance/comprehensive/planrate/years';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPlanRate}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationPlanRateData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationDayCompleteRateData(action) {//日单电站当月累计完成率、
  const { payload } = action;
  //const url = '';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationDayCompleteRate}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationDayCompleteRateData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationPvCompareData(action) {//月/日单电站光资源同比
  const { payload } = action;
  //const url = '';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPvCompare}`;
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationPvCompareData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationYearPvCompareData(action) {//年单电站光资源环比
  const { payload } = action;
  //const url = '';
  //const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationYearPvCompare}`
  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          SingleStationYearPvCompareData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getSingleStationPowerEffectiveData(action) {////月/年/日单电站发电效率
  const { payload } = action;
  //const url = '';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getSingleStationPowerEffective}`;

  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {
          singleStationPowerEffectiveData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* exportAllstationTableData(action) {//导出table
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.exportAllstationTableData}`;

  try {
    yield put({ type: allStationAnalysisAction.ALLSTATIONDATA_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: allStationAnalysisAction.GET_ALLSTATIONDATA_FETCH_SUCCESS,
        payload: {

        },
      });
    }
  } catch (e) {
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
  //yield takeLatest(allStationAnalysisAction.getAllStationYearBarData, getAllStationYearBarData);
  yield takeLatest(allStationAnalysisAction.getSingleStationStatisticData, getSingleStationStatisticData);
  yield takeLatest(allStationAnalysisAction.getSingleStationTargetData, getSingleStationTargetData);
  yield takeLatest(allStationAnalysisAction.getSingleStationMonthPieData, getSingleStationMonthPieData);
  //yield takeLatest(allStationAnalysisAction.getSingleStationYearTargetData, getSingleStationYearTargetData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPlanRateData, getSingleStationPlanRateData);
  yield takeLatest(allStationAnalysisAction.getSingleStationDayCompleteRateData, getSingleStationDayCompleteRateData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPvCompareData, getSingleStationPvCompareData);
  yield takeLatest(allStationAnalysisAction.getSingleStationYearPvCompareData, getSingleStationYearPvCompareData);
  yield takeLatest(allStationAnalysisAction.getSingleStationPowerEffectiveData, getSingleStationPowerEffectiveData);
  yield takeLatest(allStationAnalysisAction.exportAllstationTableData, exportAllstationTableData);

}
