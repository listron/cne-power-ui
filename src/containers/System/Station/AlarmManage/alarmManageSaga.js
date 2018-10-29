import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { alarmManageAction } from './alarmManageAction';

function *changeAlarmManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
    payload,
  })
}

function *getAlarmList(action){ // 请求告警事件列表
  const { payload } = action;
  // const url = '/mock/system/alarmManage/alarmList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAlarmList}`
  try{
    yield put({ type: alarmManageAction.ALARM_MANAGE_FETCH });
    const response = yield call(axios.post,url,{
      ...payload,
      sortField: payload.sortField.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`), //重组字符串
    });

    const totalNum = response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type:  alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      payload:{
        ...payload,
        alarmList: response.data.data || [],
        totalNum: response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0,
        pageNum,
      },
    });
  }catch(e){
    console.log(e);
    yield put({
      type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
      payload: { ...payload, loading: false },
    })
  }
}

function *deleteAlarmList(action){ // 清除电站告警事件
  const { payload } = action;
  // const url = '/mock/system/alarmManage/deleteAlarm';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteAlarms}/${payload.stationCode}`
  yield put({ type: alarmManageAction.ALARM_MANAGE_FETCH });
  try{
    const response = yield call(axios.delete,url);
    if(response.data.code === '10000'){ // 删除成功后，重置数据至清空状态
      yield put({
        type:  alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
        payload:{
          alarmList: [],
          totalNum: 0,
          pageNum: 0,
        },
      });
    }else{
      message.error('清除告警事件失败！')
      yield put({
        type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
        payload: { loading: false },
      })
    }
  }catch(e){
    console.log(e);
    message.error('清除告警事件失败！')
    yield put({
      type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
      payload: { loading: false },
    })
  }
}

export function* watchAlarmManage() {
  yield takeLatest(alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, changeAlarmManageStore);
  yield takeLatest(alarmManageAction.GET_ALARM_MANAGE_LIST, getAlarmList);
  yield takeLatest(alarmManageAction.DELETE_ALARM_MANAGE_LIST, deleteAlarmList);
}

