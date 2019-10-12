import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { planAction } from './planAction';
import { message } from 'antd';
import moment from 'moment';


function* changePlanStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: planAction.CHANGE_PLAN_STORE,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: planAction.RESET_STORE,
  });
}

function* getPlanList(action) {//请求生产计划列表数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPlanList}`;
  try {
    yield put({ type: planAction.PLAN_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const totalNum = response.data.data.totalNum || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if (totalNum === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: planAction.CHANGE_PLAN_STORE,
        payload: {
          ...payload,
          planData: response.data.data.planData || [],
          totalNum,
          pageNum,
          showPage: 'list',
          loading: false,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    message.error('获取列表失败！');
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        totalNum: 0,
        showPage: 'list',
        planData: [],
        loading: false,
      },
    });
    console.log(e);
  }
}

function* editPlanInfo(action) {// 编辑计划列表
  const { payload } = action;
  // const url = '/mock/system/editPlanInfo';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.eddPlanList}`;
  try {
    yield put({ type: planAction.PLAN_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({ type: planAction.GET_PLAN_FETCH_SUCCESS });
      const params = yield select(state => ({//继续请求生产计划列表
        year: state.system.plan.get('year'),
        stationCodes: state.system.plan.get('stationCodes'),
        sortField: state.system.plan.get('sortField'),
        sortMethod: state.system.plan.get('sortMethod'),
        pageSize: state.system.plan.get('pageSize'),
        pageNum: state.system.plan.get('pageNum'),
      }));
      yield put({
        type: planAction.getPlanList,
        payload: params,
      });
    } else { throw response.data; }
  } catch (e) {
    message.error('编辑失败！');
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        loading: false,
      },
    });
  }
}

function* getOwnStations(action) {//获取所有电站信息
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}`;
  const antherUrl = url + '?planYear=' + payload.planYear;
  yield put({ type: planAction.PLAN_FETCH });
  try {
    const response = yield call(axios.get, antherUrl);
    if (response.data.code === '10000') {
      yield put({
        type: planAction.CHANGE_PLAN_STORE,
        payload: {
          planStations: response.data.data,
          continueAdd: true,
        },
      });
    } else { throw response.data; }
  } catch (e) {
    console.log(e);
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        planStations: [],
        continueAdd: true,
      },
    });
  }
}

function* addPlanInfo(action) {// 添加生产计划列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addPlanList}`;
  try {
    yield put({ type: planAction.PLAN_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000' || response.data.code === '10001') {
      yield put({
        type: planAction.getYearList,
      });
    } else { throw response.data; }
  } catch (e) {
    message.error('添加失败！');
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        loading: false,
      },
    });
  }
}

function* getYearList(action) { // 获取已经计划的年份列表
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getYearList}`;
  try {
    yield put({ type: planAction.PLAN_FETCH });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const planYearList = response.data.data.yearPlan;
      const currentYear = moment().year();
      const selectYear = planYearList.includes(`${currentYear}`) ? currentYear : planYearList[0];
      yield put({
        type: planAction.CHANGE_PLAN_STORE,
        payload: {
          planYearList: planYearList || [],
          planYear: selectYear,
        },
      });
      const params = yield select(state => {
        return ({//继续请求生产计划列表
          year: state.system.plan.get('planYear') || selectYear, //初始状态
          stationCodes: state.system.plan.get('stationCodes'),
          sortField: state.system.plan.get('sortField'),
          sortMethod: state.system.plan.get('sortMethod'),
          pageSize: state.system.plan.get('pageSize'),
          pageNum: state.system.plan.get('pageNum'),
        });
      });
      yield put({
        type: planAction.getPlanList,
        payload: {
          ...params,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        planYearList: [],
        planYear: moment().year(),
      },
    });
  }
}

function* importFile(action) { // 批量导入
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.importPlan}`;
  try {
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        importLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload.formData);
    if (response.data.code === '10000') {
      response.data.message ? message.warn(response.data.message) : message.success('批量导入成功');
      yield put({
        type: planAction.GET_PLAN_FETCH_SUCCESS,
        payload: {
          importLoading: false,
        },
      });
      payload.fn();
      const params = yield select(state => ({//继续请求生产计划列表
        year: state.system.plan.get('planYear'),
        stationCodes: state.system.plan.get('stationCodes'),
        sortField: state.system.plan.get('sortField'),
        sortMethod: state.system.plan.get('sortMethod'),
        pageSize: state.system.plan.get('pageSize'),
        pageNum: state.system.plan.get('pageNum'),
      }));
      yield put({
        type: planAction.getPlanList,
        payload: params,
      });

    } else { throw response.data; }
  } catch (e) {
    message.error(e.message);
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        importLoading: false,
      },
    });
    console.log(e);
  }
}

export function* watchPlan() {
  yield takeLatest(planAction.changePlanStore, changePlanStore);
  yield takeLatest(planAction.getYearList, getYearList);
  yield takeLatest(planAction.getPlanList, getPlanList);
  yield takeLatest(planAction.editPlanInfo, editPlanInfo);
  yield takeLatest(planAction.getOwnStations, getOwnStations);
  yield takeLatest(planAction.addPlanInfo, addPlanInfo);
  yield takeLatest(planAction.resetStore, resetStore);
  yield takeLatest(planAction.importFile, importFile);
}

