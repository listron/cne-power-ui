import {call, put, takeLatest, select} from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import {message} from 'antd';
import {planAction} from './planAction';
import {userAction} from "../../Account/User/userAction";
import {commonAction} from "../../../alphaRedux/commonAction";


function* changePlanStore(action) {//存储payload指定参数，替换reducer-store属性。
  const {payload} = action;
  yield put({
    type: planAction.CHANGE_PLAN_STORE,
    payload,
  })
}

function* getPlanList(action) {//请求生产计划列表数据
  const {payload} = action;
  // const url = '/mock/system/planList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPlanList}`
  try {
    yield put({type: planAction.PLAN_FETCH});
    const response = yield call(axios.post, url, payload);

    const totalNum = response.data.data.totalNum || 0;
    let {pageNum, pageSize} = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 0;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: planAction.GET_PLAN_FETCH_SUCCESS,
      payload: {
        ...payload,
        planData: response.data.data.planData || [],
        totalNum,
        pageNum,
      },
    });
  } catch (e) {
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        totalNum: 0,
        loading: false
      },
    });
    console.log(e);
  }


}

function* editPlanInfo(action) {
  const {payload} = action;
  // const url = '/mock/system/editPlanInfo';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.eddPlanList}`

  try {
    yield put({type: planAction.PLAN_FETCH});
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({type: planAction.GET_PLAN_FETCH_SUCCESS});
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
    }
  } catch (e) {
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        loading: false
      },
    });
  }
}

//获取所有电站信息
function* getOwnStations(action) {
  const {payload} = action;
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getStations}`;
  const antherUrl=url+'?planYear='+payload.planYear;
  yield put({type: planAction.PLAN_FETCH});
  try {
    const response = yield call(axios.get, antherUrl);
    if (response.data.code === '10000') {
      let planStations = [];
      response.data.data.map((item, key) => {
        return item.isPlan === 1 ? planStations.push(item.stationCode) : null
      });
      yield put({
        type: planAction.CHANGE_PLAN_STORE,
        payload: {
          planStations: planStations,
          continueAdd:true
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* addPlanInfo(action) {
  const {payload} = action;
  // const url = '/mock/system/editPlanInfo';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addPlanList}`

  try {
    yield put({type: planAction.PLAN_FETCH});
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({type: planAction.GET_PLAN_FETCH_SUCCESS});
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
    }
  } catch (e) {
    yield put({
      type: planAction.CHANGE_PLAN_STORE,
      payload: {
        loading: false
      },
    });
  }
}


export function* watchPlan() {
  yield takeLatest(planAction.changePlanStore, changePlanStore);
  yield takeLatest(planAction.getPlanList, getPlanList);
  yield takeLatest(planAction.editPlanInfo, editPlanInfo);
  yield takeLatest(planAction.getOwnStations, getOwnStations);
  yield takeLatest(planAction.addPlanInfo, addPlanInfo);
}

