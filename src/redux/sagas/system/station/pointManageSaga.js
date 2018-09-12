import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { pointManageAction } from '../../../../constants/actionTypes/system/station/pointManageAction';

function *changePointManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  pointManageAction.CHANGE_POINT_MANAGE_STORE,
    payload,
  })
}
// loading: => POINT_MANAGE_FETCH

function *getPointList(action){ // 请求单个详细数据信息
  const { payload } = action;
  const url = '/mock/system/pointManage/pointsList';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPointList}`
  try{
    yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
    const response = yield call(axios.post,url,payload);
    yield put({
      type:  pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      payload:{
        ...payload,
        pointList: response.data.data.context || [],
        totalNum: response.data.data.totalNum || 0,
      },
    });
  }catch(e){
    console.log(e);
  }
}

function *deletePointList(action){ // 清除测点列表
  const { payload } = action;
  const url = '/mock/system/pointManage/deletePointList';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deletePoints}/${payload.stationCode}`
  yield put({ type: pointManageAction.POINT_MANAGE_FETCH });
  try{
    const response = yield call(axios.delete,url);
    if(response.data.code === '10000'){ // 删除成功后，重新请求已删除测点电站数据。(看是否[]=>校核)
      const listPayload = yield select(state => ({ 
        stationCode: payload.stationCode,
        deviceTypeCode: state.system.pointManage.get('deviceTypeCode'),
        deviceModelCode: state.system.pointManage.get('deviceModelCode'),
        pageNum: state.system.pointManage.get('pageNum'),
        pageSize: state.system.pointManage.get('pageSize'),
        orderField: state.system.pointManage.get('orderField'),
        orderType: state.system.pointManage.get('orderType'),
      }));
      yield put({
        type:  pointManageAction.GET_POINT_MANAGE_LIST,
        payload:{
          ...listPayload,
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchPointManage() {
  yield takeLatest(pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, changePointManageStore);
  yield takeLatest(pointManageAction.GET_POINT_MANAGE_LIST, getPointList)
  yield takeLatest(pointManageAction.DELETE_POINT_MANAGE_LIST, deletePointList)
}

