import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { workOrderAction } from './workOrderAction';


function* changeWorkOrderStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: workOrderAction.changeWorkOrderStore,
    payload,
  })
}

function* resetStore() {
  yield put({
    type: workOrderAction.RESET_STORE
  })
}

//获取缺陷工单详情  两种状态  get 请求方式  defectID
function* getDefectDetail(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectDetail;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.get, url, { params: { defectId: payload.defectId } });
    if (response.data.code === '10000') {
      yield put({
        type: workOrderAction.getworkOrderFetchSuccess,
        payload: {
          ...payload,
          defectDetail: response.data.data,
          stationType:response.data.data.stationType,
          defectSource:response.data.data.defectSource,
        }
      });
    }else{
      message.error('获取详情失败!!')
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷工单Id列表(用于上一个，下一个)
function* getDefectIdList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectIdList;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: workOrderAction.getworkOrderFetchSuccess,
        payload: {
          defectIdList: response.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷常用语
function* getDefectCommonList(action) { // 参数 languageType：0 全部 1 缺陷 2 巡检
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getCommonList;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: workOrderAction.getworkOrderFetchSuccess,
        payload: {
          commonList: response.data.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷类型信息
function* getDefectTypes(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectTypes;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: workOrderAction.getworkOrderFetchSuccess,
        payload: {
          defectTypes: response.data.data.data,
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//下发工单
function* sendDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.sendDefect;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('下发成功！');
      yield put({
        type: workOrderAction.changeWorkOrderStore,
        payload: {
          callBack: true,
        }
      })
    } else {
      yield put({
        type: workOrderAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//驳回工单
function* rejectDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.rejectDefect;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('驳回成功！');
      yield put({
        type: workOrderAction.changeWorkOrderStore,
        payload: {
          callBack: true,
        }
      })

    } else {
      yield put({
        type: workOrderAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//关闭工单
function* closeDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.closeDefect;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('关闭成功！');
      yield put({
        type: workOrderAction.changeWorkOrderStore,
        payload: {
          callBack: true,
        }
      })
    } else {
      yield put({
        type: workOrderAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//执行工单
function* handleDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.handleDefect;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('处理缺陷成功！');
      yield put({
        type: workOrderAction.changeWorkOrderStore,
        payload: {
          callBack: true,
        }
      })
    } else {
      yield put({
        type: workOrderAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//验收工单
function* checkDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.checkDefect;
  yield put({ type: workOrderAction.workOrderFetch });
  try {
    const response = yield call(axios.post, url, payload);
    console.log(response)
    if (response.data.code === '10000') {
      message.success('验收成功！');
      yield put({
        type: workOrderAction.changeWorkOrderStore,
        payload: {
          callBack: true,
        }
      })
    } else {
      yield put({
        type: workOrderAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}





export function* watchWorkOrder() {
  yield takeLatest(workOrderAction.changeWorkOrderStoreSaga, changeWorkOrderStore);
  yield takeLatest(workOrderAction.resetStore, resetStore);
  yield takeLatest(workOrderAction.getDefectDetail, getDefectDetail);
  yield takeLatest(workOrderAction.getDefectIdList, getDefectIdList);
  yield takeLatest(workOrderAction.getDefectCommonList, getDefectCommonList);
  yield takeLatest(workOrderAction.getDefectTypes, getDefectTypes);
  yield takeLatest(workOrderAction.sendDefect, sendDefect);
  yield takeLatest(workOrderAction.rejectDefect, rejectDefect);
  yield takeLatest(workOrderAction.closeDefect, closeDefect);
  yield takeLatest(workOrderAction.handleDefect, handleDefect);
  yield takeLatest(workOrderAction.checkDefect, checkDefect);

}

