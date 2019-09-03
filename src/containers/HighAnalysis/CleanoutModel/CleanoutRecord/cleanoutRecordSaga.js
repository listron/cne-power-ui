import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { cleanoutRecordAction } from './cleanoutRecordAction';

function* changeCleanoutRecordStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: cleanoutRecordAction.RESET_STORE,
  });
}
function* getStationDust(action) {//1.1.3.获取清洗预警—全站灰尘影响图表数据
  const { payload } = action;

  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getStationDust}/${payload.stationCode}/${payload.startTime}/${payload.endTime}`;
  //const url = '/mock/cleanWarning/totalEffect';
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          totalEffects: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getMatrixDust(action) {//1.1.4.方阵灰尘影响图表数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixDust}/${payload.stationCode}/${payload.startTime}/${payload.endTime}`;
  //const url = '/mock/cleanWarning/totalEffect';
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          matrixEffects: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getMainList(action) {//1.1.5.获取各电站清洗计划汇总列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMainList}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;

      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          ...payload,
          total: response.data.data.total || 0,
          mainListData: response.data.data.detailData || [],
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
      payload: {
        total: 0,
        mainListData: [],
        loading: false,
      },
    });
  }
}
function* getDetailList(action) {//1.1.6.获取清洗计划记录列表
  const { payload } = action;
  const { planId } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getDetailList}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const detailtotal = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(detailtotal / pageSize);
      if (detailtotal === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          detailtotal: response.data.data.total || 0,
          cleanPlanNum: response.data.data.cleanPlanNum ? response.data.data.cleanPlanNum : '',
          rainCleanNum: response.data.data.rainCleanNum ? response.data.data.rainCleanNum : '',
          handCleanNum: (response.data.data.handCleanNum || response.data.data.handCleanNum === 0) ? response.data.data.handCleanNum : '--',
          cleanProfit: (response.data.data.cleanProfit || response.data.data.cleanProfit === 0) ? response.data.data.cleanProfit : '--',
          cleanCycle: (response.data.data.cleanCycle || response.data.data.cleanCycle === 0) ?
            response.data.data.cleanCycle : '--',
          cleanTime: (response.data.data.cleanTime || response.data.data.cleanTime === 0) ?
            response.data.data.cleanTime : '--',
          detailListData: response.data.data.detailData || [],
          planId,
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
      payload: {
        detailtotal: 0,
        cleanPlanNum: '',
        rainCleanNum: '',
        handCleanNum: '--',
        cleanProfit: '--',
        cleanCycle: '--',
        cleanTime: '--',
        detailListData: [],
      },
    });

  }
}
function* getAddCleanPlan(action) {//1.1.7.添加人工清洗计划
  const { payload } = action;

  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getAddCleanPlan}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success(`${response.data.message}`);
      const params = yield select(state => ({
        stationCodes: state.highAanlysisReducer.cleanoutRecordReducer.get('stationCodes'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('pageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('pageSize'),
        sortField: state.highAanlysisReducer.cleanoutRecordReducer.get('sortField'),
        sortType: state.highAanlysisReducer.cleanoutRecordReducer.get('sortType'),
      }));
      yield put({ // 请求请求详情页数据
        type: cleanoutRecordAction.getMainList,
        payload: { ...params },
      });
    } else {
      message.error(`清洗计划添加失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getEditCleanPlan(action) {//1.1.8.修改人工清洗计划
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getEditCleanPlan}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {// 编辑成功，重新请求列表，返回详情页，并重新请求列表
      message.success(`${response.data.message}`);
      const params = yield select(state => ({
        stationCode: state.highAanlysisReducer.cleanoutRecordReducer.get('singleStationCode'),
        cleanType: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanType'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageSize'),
      }));
      yield put({ // 请求请求详情页数据
        type: cleanoutRecordAction.getDetailList,
        payload: { ...params },
      });
    } else {
      message.error(`清洗计划详情编辑失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getCleanPlanDetail(action) {//1.1.9.获取人工清洗计划详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getCleanPlanDetail}/${payload.planId}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          cleanPlandetail: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* deleteCleanPlan(action) {//1.1.10.删除清洗计划详情,删除下雨记录也是此接口
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.deleteCleanPlan}/${payload.planId}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.delete, url, payload);
    if (response.data.code === '10000') {// 编辑成功，重新请求列表，返回详情页，并重新请求列表
      const payload = yield select(state => ({
        stationCode: state.highAanlysisReducer.cleanoutRecordReducer.get('singleStationCode'),
        cleanType: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanType'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageSize'),
      }));
      yield put({
        type: cleanoutRecordAction.getDetailList,
        payload,
      });
    } else {
      message.error(`清洗计划详情删除失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getAddRainPlan(action) {//1.1.11.添加下雨清洗计划
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getAddRainPlan}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      if (response.data.message) {//后台说添加失败message不为空，成功message为空
        message.error('降雨时间添加失败，已有该时间段的降雨记录！');
      } else {
        message.success('添加降雨记录成功!');
      }
      const params = yield select(state => ({
        stationCodes: state.highAanlysisReducer.cleanoutRecordReducer.get('stationCodes'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('pageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('pageSize'),
        sortField: state.highAanlysisReducer.cleanoutRecordReducer.get('sortField'),
        sortType: state.highAanlysisReducer.cleanoutRecordReducer.get('sortType'),
      }));
      yield put({ // 请求请求详情页数据
        type: cleanoutRecordAction.getMainList,
        payload: { ...params },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getEditRainPlan(action) {//1.1.12.修改下雨清洗计划
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getEditRainPlan}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {// 编辑成功，重新请求列表，返回详情页，并重新请求列表

      const params = yield select(state => ({
        stationCode: state.highAanlysisReducer.cleanoutRecordReducer.get('singleStationCode'),
        cleanType: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanType'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageSize'),
      }));
      yield put({ // 请求请求详情页数据
        type: cleanoutRecordAction.getDetailList,
        payload: { ...params },
      });
    } else {
      message.error(`降雨时间编辑失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getRainPlanDetail(action) {//1.1.13.获取下雨清洗计划详情
  const { payload } = action;

  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getRainPlanDetail}/${payload.planId}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          rainPlandetail: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getPlanRecordList(action) {//1.1.14.获取清洗记录列表
  const { payload } = action;
  const { planId } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getPlanRecordList}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const cleanRecordTotal = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(cleanRecordTotal / pageSize);
      if (cleanRecordTotal === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          ...payload,
          planId,
          cleanRecordTotal: response.data.data.total || 0,
          cleanRecordPlanTime: response.data.data.planTime || '',
          cleanRecordCost: response.data.data.cleanCost || '--',
          cleanRecordProfit: response.data.data.cleanProfit || '--',
          cleanRecordTime: response.data.data.cleanTime || 0,
          cleanRecordListData: response.data.data.detailData || [],
        },
      });
    } else {
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
      payload: {
        cleanRecordTotal: 0,
        cleanRecordPlanTime: '',
        cleanRecordCost: '--',
        cleanRecordProfit: '--',
        cleanRecordTime: null,
        cleanRecordListData: [],
      },
    });
  }
}
function* getAddCleanRecord(action) {//1.1.15.添加清洗记录
  const { payload } = action;
  const { planId } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getAddCleanRecord}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const params = yield select(state => ({
        stationCode: state.highAanlysisReducer.cleanoutRecordReducer.get('singleStationCode'),
        cleanType: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanType'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('detailPageSize'),
      }));

      const planRecordParams = yield select(state => ({
        // planId: state.highAanlysisReducer.cleanoutRecordReducer.get('planId'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanRecordPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanRecordPageSize'),
      }));
      yield put({ // 请求请求单电站详情页数据
        type: cleanoutRecordAction.getDetailList,
        payload: { ...params },
      });
      yield put({ // 请求计划记录页数据
        type: cleanoutRecordAction.getPlanRecordList,
        payload: { planId, ...planRecordParams },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* editCleanRecord(action) {//1.1.16.修改清洗记录
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.editCleanRecord}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {// 编辑成功，重新请求列表，返回详情页，并重新请求列表
      const params = yield select(state => ({
        planId: state.highAanlysisReducer.cleanoutRecordReducer.get('planId'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('pageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('pageSize'),
      }));
      yield put({ // 请求请求详情页数据
        type: cleanoutRecordAction.getPlanRecordList,
        payload: { ...params },
      });
    } else {
      message.error(`清洗记录详情编辑失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getCleanRecordDetail(action) {//1.1.17.获取清洗记录详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getCleanRecordDetail}/${payload.planId}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          cleanRecorddetail: response.data.data || {},
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* deleteCleanRecord(action) {//1.1.18.删除清洗记录
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.deleteCleanRecord}/${payload.planId}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.delete, url, payload);
    if (response.data.code === '10000') {// 编辑成功，重新请求列表，返回详情页，并重新请求列表
      const payload = yield select(state => ({
        planId: state.highAanlysisReducer.cleanoutRecordReducer.get('planId'),
        pageNum: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanRecordPageNum'),
        pageSize: state.highAanlysisReducer.cleanoutRecordReducer.get('cleanRecordPageSize'),
      }));
      yield put({
        type: cleanoutRecordAction.getPlanRecordList,
        payload,
      });
    } else {
      message.error(`清洗计划详情删除失败!${response.data.message}`);
      yield put({
        type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA,
        payload: { loading: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getMatrix(action) {//获取单电站方阵
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.highAnalysis.getMatrixList}`;
  try {
    yield put({ type: cleanoutRecordAction.CLEANOUT_RECORD_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: cleanoutRecordAction.GET_CLEANOUT_RECORD_FETCH_SUCCESS,
        payload: {
          getMatrixData: response.data.data || [],
        },
      });
    }
  } catch (e) {
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
  yield takeLatest(cleanoutRecordAction.getMatrix, getMatrix);


}

