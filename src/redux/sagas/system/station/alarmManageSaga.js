import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';

function *changeAlarmManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
    payload,
  })
}

function *getAlarmList(action){ // 请求告警事件列表
  const { payload } = action;
  const url = '/mock/system/alarmManage/alarmList';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAlarmList}`
  try{
    yield put({ type: alarmManageAction.ALARM_MANAGE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      payload:{
        ...payload,
        alarmList: response.data.data.context || [],
        totalNum: response.data.data.totalCount || 0,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *deleteAlarmList(action){ // 清除电站告警事件
  const { payload } = action;
  const url = '/mock/system/alarmManage/deleteAlarm';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteAlarms}/${payload.stationCode}`
  yield put({ type: alarmManageAction.ALARM_MANAGE_FETCH });
  try{
    const response = yield call(axios.delete,url);
    if(response.data.code === '10000'){ // 删除成功后，重新请求已删除告警时间的电站。(看是否[]=>校核)
      const listPayload = yield select(state => ({ 
        stationCode: payload.stationCode,
        deviceTypeCode: state.system.pointManage.get('deviceTypeCode'),
        deviceModelCode: state.system.pointManage.get('deviceModelCode'),
        pointCode: state.system.pointManage.get('pointCode'),
        pageNum: state.system.pointManage.get('pageNum'),
        pageSize: state.system.pointManage.get('pageSize'),
        sortField: state.system.pointManage.get('sortField'),
        sortOrder: state.system.pointManage.get('sortOrder'),
      }));
      yield put({
        type:  alarmManageAction.GET_ALARM_MANAGE_LIST,
        payload:{
          ...listPayload,
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchAlarmManage() {
  yield takeLatest(alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, changeAlarmManageStore);
  yield takeLatest(alarmManageAction.GET_ALARM_MANAGE_LIST, getAlarmList);
  yield takeLatest(alarmManageAction.DELETE_ALARM_MANAGE_LIST, deleteAlarmList);
}

