import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';

function *changeStationManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  stationManageAction.CHANGE_STATION_MANAGE_STORE,
    payload,
  })
}

function *getStationList(action){ // 请求电站列表信息
  const { payload } = action;
  const url = '/mock/system/stationList/001';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}/${payload.enterpriseId}`
  try{
    yield put({ type:stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.post, url, payload);
    // if(response.data.code === "10000"){
    yield put({
      type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
        stationList: response.data.data.list || [],
        totalNum: response.data.data.total || 0,
      }
    })
    // }
  }catch(e){
    console.log(e);
    message.error('获取电站列表数据失败，请重试');
    yield put({
      type:  stationManageAction.CHANGE_STATION_MANAGE_STORE,
      payload: { loading: false },
    })
  }
}

function *getStationDetail(action){ // 获取选中电站详情；
  const { payload } = action;
  const { selectedStationIndex } = payload;
  const url = '/mock/system/stationDetail/001';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationDetail}/${payload.stationCode}`
  try{
    const response = yield call(axios.get, url);
    // if(response.data.code === "10000"){
    yield put({
      type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedStationIndex,
        stationDetail: response.data.data || {},
        showPage: 'detail',
      }
    })
    // }
  }catch(e){
    console.log(e);
    message.error('获取电站详情失败，请重试');
  }
}

function *getOtherPageStationDetail(action){ // 电站详情页面翻页时请求详情+table数据翻页
  const { payload } = action;
  const listUrl = '/mock/system/stationList/001';
  // const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}/${payload.enterpriseId}`
  const detailUrl = '/mock/system/stationDetail/001';
  try{
    yield put({ type:stationManageAction.STATION_MANAGE_FETCH });
    const { selectedStationIndex } = payload;
    const listParams = delete payload.selectedStationIndex;
    const listResponse = yield call(axios.post, listUrl, listParams);
    const selectedStationId = listResponse.data.data.list[selectedStationIndex];
    // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationDetail}/${payload.selectedStationId}`
    const detailResponse = yield call(axios.get, detailUrl);
    if(detailResponse.data.code === "10000"){
      yield put({
        type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          selectedStationIndex,
          stationList: listResponse.data.data.list || [],
          totalNum: listResponse.data.data.total || 0,
        }
      })
    }else{
      message.error('获取详情数据失败，请重试');
      yield put({
        type:  stationManageAction.CHANGE_STATION_MANAGE_STORE,
        payload: { loading: false },
      })
    }
  }catch(e){
    console.log(e);
    message.error('获取详情数据失败，请重试');
    yield put({
      type:  stationManageAction.CHANGE_STATION_MANAGE_STORE,
      payload: { loading: false },
    })
  }
}

function *saveStationDetail(action){ // 保存编辑的电站详情；
  const { payload } = action;
  const url = '/mock/system/saveStationDetail';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.saveStationDetail}/${payload.enterpriseId}`
  try{
    yield put({ type:stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.put, url, payload);
    if(response.data.code === "10000"){ // 保存成功后，继续请求电站列表信息 + 该电站详情
      const listPayload = yield select(state => ({
        stationType: state.system.stationManage.get('stationType'),
        regionName: state.system.stationManage.get('regionName'),
        stationName: state.system.stationManage.get('stationName'),
        pageNum: state.system.stationManage.get('pageNum'),
        pageSize: state.system.stationManage.get('pageSize'),
        orderField: state.system.stationManage.get('orderField'),
        orderCommand: state.system.stationManage.get('orderCommand'),
      }));
      const selectedStationIndex = yield select(state => state.system.stationManage.get('selectedStationIndex'));
      const tmpStationList = yield select(state => state.system.stationManage.get('stationList'));
      const stationList = tmpStationList.toJS();
      const detailPayload = {
        stationCode: stationList[selectedStationIndex].stationCode,
        selectedStationIndex,
      }
      yield put({ // 重新请求列表
        type: stationManageAction.GET_STATION_MANAGE_LIST,
        payload: { ...listPayload } 
      })
      yield put({ // 重新请求详情
        type: stationManageAction.GET_STATION_MANAGE_DETAIL,
        payload: { ...detailPayload }
      })
    }
  }catch(e){
    console.log(e);
    message.error('保存电站详情失败，请重试');
  }
}

function *deleteStation(action){ // 删除电站(及以下设备)
  const { payload } = action;
  const url = '/mock/system/deleteStation';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteStation}/${payload.enterpriseId}`
  try{
    yield put({ type:stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.delete, url, payload);
    if(response.data.code === "10000"){ // 删除成功后，继续请求电站列表信息
      const payload = yield select(state => ({ 
        stationType: state.system.stationManage.get('stationType'),
        regionName: state.system.stationManage.get('regionName'),
        stationName: state.system.stationManage.get('stationName'),
        pageNum: state.system.stationManage.get('pageNum'),
        pageSize: state.system.stationManage.get('pageSize'),
        orderField: state.system.stationManage.get('orderField'),
        orderCommand: state.system.stationManage.get('orderCommand'),
      }));
      yield put({
        type: stationManageAction.GET_STATION_MANAGE_LIST,
        payload,
      })
      yield put({
        type: stationManageAction.CHANGE_STATION_MANAGE_STORE_SAGA,
        payload: {
          showPage: 'list',
        }
      })
    }
  }catch(e){
    console.log(e);
    message.error('删除电站信息失败，请重试');
  }
}

function *setStationDepartment(action){ // 保存分配至指定电站的部门；
  const { payload } = action;
  const url = '/mock/system/setDepartment';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setStationDepartment}/${payload.enterpriseId}`
  try{
    yield put({ type:stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.post, url, payload);
    if(response.data.code === "10000"){ // 保存成功后，继续请求电站列表信息
      const payload = yield select(state => ({ 
        stationType: state.system.stationManage.get('stationType'),
        regionName: state.system.stationManage.get('regionName'),
        stationName: state.system.stationManage.get('stationName'),
        pageNum: state.system.stationManage.get('pageNum'),
        pageSize: state.system.stationManage.get('pageSize'),
        orderField: state.system.stationManage.get('orderField'),
        orderCommand: state.system.stationManage.get('orderCommand'),
      }));
      yield put({
        type: stationManageAction.GET_STATION_MANAGE_LIST,
        payload,
      })
    }
  }catch(e){
    console.log(e);
    message.error('分配部门操作失败，请重试');
  }
}

export function* watchStationManage() {
  yield takeLatest(stationManageAction.CHANGE_STATION_MANAGE_STORE_SAGA, changeStationManageStore);
  yield takeLatest(stationManageAction.GET_STATION_MANAGE_LIST, getStationList);
  yield takeLatest(stationManageAction.GET_STATION_MANAGE_DETAIL, getStationDetail);
  yield takeLatest(stationManageAction.EDIT_STATION_MANAGE_DETAIL, saveStationDetail);
  yield takeLatest(stationManageAction.DELET_STATION_MANAGE, deleteStation);
  yield takeLatest(stationManageAction.SET_STATION_MANAGE_DEPARTMENT, setStationDepartment);
  yield takeLatest(stationManageAction.GET_OTHER_PAGE_STATION_MANAGE_DETAIL,getOtherPageStationDetail);
}
