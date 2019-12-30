import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { stationManageAction } from './stationManageAction';

function* getStationList(action) { // 请求电站列表信息
  const { payload } = action;
  // const url = '/mock/system/stationList/001';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}`
  try {
    yield put({ type: stationManageAction.STATION_MANAGE_FETCH });
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: { stationListLoading: true },
    })
    const response = yield call(axios.post, url, payload);
    // if(response.data.code === "10000"){
    const totalNum = response.data.data.total || 0;
    let { pageNum, pageSize } = payload;

    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    yield put({
      type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      payload: {
        ...payload,
        stationList: response.data.data.list || [],
        totalNum,
        pageNum,
        stationListLoading: false,
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('获取电站列表数据失败，请重试');
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: { loading: false, stationListLoading: false, },
    })
  }
}

function* getStationDetail(action) { // 获取选中电站详情；
  const { payload } = action;
  const { selectedStationIndex, showPage = 'detail' } = payload;
  // const url = '/mock/system/stationDetail/001';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationDetail}/${payload.stationCode}`
  try {
    const response = yield call(axios.get, url);
    // if(response.data.code === "10000"){
    yield put({
      type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedStationIndex,
        stationDetail: response.data.data || {},
        showPage,
      }
    })
    // }
  } catch (e) {
    console.log(e);
    message.error('获取电站详情失败，请重试');
  }
}

function* getOtherPageStationDetail(action) { // 电站详情页面翻页时请求详情+table数据翻页
  const { payload } = action;
  // const listUrl = '/mock/system/stationList/001';
  const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationList}`;
  // const detailUrl = '/mock/system/stationDetail/001';
  try {
    yield put({ type: stationManageAction.STATION_MANAGE_FETCH });
    const { selectedStationIndex } = payload;
    delete payload.selectedStationIndex;
    const listResponse = yield call(axios.post, listUrl, payload);
    const selectedStationCode = listResponse.data.data.list[selectedStationIndex].stationCode;
    const detailUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationDetail}/${selectedStationCode}`
    const detailResponse = yield call(axios.get, detailUrl);
    if (detailResponse.data.code === "10000") {
      yield put({
        type: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          selectedStationIndex,
          stationList: listResponse.data.data.list || [],
          totalNum: listResponse.data.data.total || 0,
        }
      })
    } else {
      message.error('获取详情数据失败，请重试');
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: { loading: false },
      })
    }
  } catch (e) {
    console.log(e);
    message.error('获取详情数据失败，请重试');
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: { loading: false },
    })
  }
}

function* saveStationDetail(action) { // 保存编辑的电站详情；
  const { payload } = action;
  // const url = '/mock/system/saveStationDetail';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.saveStationDetail}`
  try {
    yield put({ type: stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === "10000") { // 保存成功后，继续请求电站列表信息 + 该电站详情
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
  } catch (e) {
    console.log(e);
    message.error('保存电站详情失败，请重试');
  }
}

function* deleteStation(action) { // 删除电站(及以下设备)
  const { payload } = action;
  // const url = '/mock/system/deleteStation';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.deleteStation}/${payload.stationCode}`
  try {
    yield put({ type: stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.delete, url, payload);
    if (response.data.code === "10000") { // 删除成功后，继续请求电站列表信息
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
        type: stationManageAction.changeStationManageStore_SAGA,
        payload: {
          showPage: 'list',
        }
      })
    }
  } catch (e) {
    console.log(e);
    message.error('删除电站信息失败，请重试');
  }
}

function* setStationDepartment(action) { // 保存分配至指定电站的部门；
  const { payload } = action;
  // const url = '/mock/system/setDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setStationDepartment}`
  try {
    yield put({ type: stationManageAction.STATION_MANAGE_FETCH });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === "10000") { // 保存成功后，继续请求电站列表信息
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
    } else {
      message.error('分配部门操作失败，请重试');
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: { loading: false },
      })
    }
  } catch (e) {
    console.log(e);
    message.error('分配部门操作失败，请重试');
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: { loading: false },
    })
  }
}


function* getDiagconfigYx(action) {  // 获取遥信配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getYxconfig}${payload.stationCode}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: {
          YxConfigData: response.data.data || []
        },
      });
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YxConfigData: []
      },
    })
  }
}

function* setDiagconfigYx(action) {  // 更改遥信配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setYxconfig}`;
  try {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YxLoading: true,
      },
    })
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: {
          YxLoading: false,
        },
      })
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YxLoading: false,
      },
    })
  }
}

function* getDiagconfigYc(action) {  // 获取遥测或者数据质量配置
  const { payload } = action;
  const { type, stationCode, init } = payload;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getYcconfig}${type}/${stationCode}/${init}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: {
          YcConfigData: response.data.data || []
        },
      });
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YcConfigData: []
      },
    })
  }
}

function* setDiagconfigYc(action) {  // 更改遥测或者数据质量配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setYcconfig}`;
  try {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YcLoading: true,
      },
    })
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: stationManageAction.changeStationManageStore,
        payload: {
          YcLoading: false,
        },
      })
    } else { throw response.data }
  } catch (e) {
    yield put({
      type: stationManageAction.changeStationManageStore,
      payload: {
        YcLoading: false,
      },
    })
  }
}


export function* watchStationManage() {
  yield takeLatest(stationManageAction.GET_STATION_MANAGE_LIST, getStationList);
  yield takeLatest(stationManageAction.GET_STATION_MANAGE_DETAIL, getStationDetail);
  yield takeLatest(stationManageAction.EDIT_STATION_MANAGE_DETAIL, saveStationDetail);
  yield takeLatest(stationManageAction.DELET_STATION_MANAGE, deleteStation);
  yield takeLatest(stationManageAction.SET_STATION_MANAGE_DEPARTMENT, setStationDepartment);
  yield takeLatest(stationManageAction.GET_OTHER_PAGE_STATION_MANAGE_DETAIL, getOtherPageStationDetail);
  yield takeLatest(stationManageAction.getDiagconfigYx, getDiagconfigYx);
  yield takeLatest(stationManageAction.setDiagconfigYx, setDiagconfigYx);
  yield takeLatest(stationManageAction.getDiagconfigYc, getDiagconfigYx);
  yield takeLatest(stationManageAction.setDiagconfigYc, setDiagconfigYx);
}

