import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { handleRemoveAction } from './handleRemoveAction.js';
const APIBasePath = Path.basePaths.APIBasePath;
const monitor = Path.APISubPaths.monitor
function* getHandleRemoveStatistic(action) {//1.3.2.	获取多电站活动告警数统计
  const { payload } = action;
  const url = `${APIBasePath}${monitor.getAlarmNum}/${payload.warningStatus}/${payload.warningType}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      const result = response.data && response.data.data;
      yield put({
        type: handleRemoveAction.changeHandleRemoveStore,
        payload: {
          oneWarningNum: (result.oneWarningNum || result.oneWarningNum === 0) ? result.oneWarningNum : '--',
          twoWarningNum: (result.twoWarningNum || result.twoWarningNum === 0) ? result.twoWarningNum : '--',
          threeWarningNum: (result.threeWarningNum || result.threeWarningNum === 0) ? result.threeWarningNum : '--',
          fourWarningNum: (result.fourWarningNum || result.fourWarningNum === 0) ? result.fourWarningNum : '--',

        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: handleRemoveAction.changeHandleRemoveStore,
      payload: {
        oneWarningNum: '--',
        twoWarningNum: '--',
        threeWarningNum: '--',
        fourWarningNum: '--',
      },
    });
  }
}
function* getHandleRemoveList(action) {  // 请求手动解除告警列表
  const { payload, } = action;
  const { stationCodes, rangTime, } = payload;
  const url = `${APIBasePath}${monitor.getHistoryAlarm}`
  try {
    yield put({
      type: handleRemoveAction.changeHandleRemoveStore,
      payload: {
        loading: true,
      },
    });
    const response = yield call(axios.post, url, {
      ...payload,
      stationCode: stationCodes,
      startTime: rangTime,
    });
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
        type: handleRemoveAction.changeHandleRemoveStore,
        payload: {
          total : response.data.data.total||0,
          handleRemoveList: response.data.data.list || [],
          loading: false,
          ...payload,
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: handleRemoveAction.changeHandleRemoveStore,
      payload: { ...payload, loading: false, realtimeWarning: [] },
    })
  }
}
function* getHandleRemoveTransfer(action) {  // 转工单
  const { payload } = action;
  const url = `${APIBasePath}${monitor.transferAlarm}`
  try {
    const response = yield call(axios.post, url, {...payload,warningType:'限值告警'});
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveAction.changeHandleRemoveStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const alarmNum= yield select(state =>({
        warningType: state.highAanlysisReducer.handleRemoveReducer.get('warningType'),
        warningStatus: state.highAanlysisReducer.handleRemoveReducer.get('warningStatus'),
      }));
      yield put({
        type: handleRemoveAction.getHandleRemoveStatistic,
        payload: alarmNum
      })
      const params = yield select(state => ({//继续请求手动解除
        warningLevel: state.highAanlysisReducer.handleRemoveReducer.get('warningLevel'),
        stationCodes: state.highAanlysisReducer.handleRemoveReducer.get('stationCodes'),
        deviceTypeCode: state.highAanlysisReducer.handleRemoveReducer.get('deviceTypeCode'),
        rangTime: state.highAanlysisReducer.handleRemoveReducer.get('rangTime'),
        warningTypeStatus: state.highAanlysisReducer.handleRemoveReducer.get('warningTypeStatus'),
        pageNum:state.highAanlysisReducer.handleRemoveReducer.get('pageNum'),
        pageSize:state.highAanlysisReducer.handleRemoveReducer.get('pageSize'),
        warningType:state.highAanlysisReducer.handleRemoveReducer.get('warningType'),
      }));
      yield put({
        type: handleRemoveAction.getHandleRemoveList,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* cancleHandleRemove(action) {  // 取消手动解除告警
  const { payload } = action;
  const url = `${APIBasePath}${monitor.resetRelieveAlarm}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveAction.changeHandleRemoveStore,
        payload: {
          selectedRowKeys: []
        }
      });
      const alarmNum= yield select(state =>({
        warningType: state.highAanlysisReducer.handleRemoveReducer.get('warningType'),
        warningStatus: state.highAanlysisReducer.handleRemoveReducer.get('warningStatus'),
      }));
      yield put({
        type: handleRemoveAction.getHandleRemoveStatistic,
        payload: alarmNum
      })
      const params = yield select(state => ({//继续请求实时告警
        warningLevel: state.highAanlysisReducer.handleRemoveReducer.get('warningLevel'),
        stationCodes: state.highAanlysisReducer.handleRemoveReducer.get('stationCodes'),
        deviceTypeCode: state.highAanlysisReducer.handleRemoveReducer.get('deviceTypeCode'),
        rangTime: state.highAanlysisReducer.handleRemoveReducer.get('rangTime'),
        warningTypeStatus: state.highAanlysisReducer.handleRemoveReducer.get('warningTypeStatus'),
        pageNum:state.highAanlysisReducer.handleRemoveReducer.get('pageNum'),
        pageSize:state.highAanlysisReducer.handleRemoveReducer.get('pageSize'),
        warningType:state.highAanlysisReducer.handleRemoveReducer.get('warningType'),
      }));
      yield put({
        type: handleRemoveAction.getHandleRemoveList,
        payload: params
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* getHandleRemoveInfo(action) {  // 请求屏蔽详情
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.monitor.getRelieveInfo}/${payload.operateId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: handleRemoveAction.changeHandleRemoveStore,
        payload: {
          relieveInfo: response.data.data||{}
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function* watchHandleWarning() {
  yield takeLatest(handleRemoveAction.getHandleRemoveStatistic, getHandleRemoveStatistic);
  yield takeLatest(handleRemoveAction.getHandleRemoveList, getHandleRemoveList);
  yield takeLatest(handleRemoveAction.getHandleRemoveTransfer, getHandleRemoveTransfer);
  yield takeLatest(handleRemoveAction.cancleHandleRemove, cancleHandleRemove);
  yield takeLatest(handleRemoveAction.getHandleRemoveInfo, getHandleRemoveInfo);
}