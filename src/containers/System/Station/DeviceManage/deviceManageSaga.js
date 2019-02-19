import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceManageAction } from './deviceManageAction';
import { message } from 'antd';


function *changeDeviceManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  deviceManageAction.RESET_STORE
  })
}

function *getDeviceList(action){ // 请求设备列表
  const { payload } = action;
  // const url = '/mock/system/deviceManage/deviceList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDeviceList}`
  try{
    yield put({ type:deviceManageAction.DEVICE_MANAGE_FETCH });
    const response = yield call(axios.post,url,{
      ...payload,
      sortField: payload.sortField.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`), //重组字符串
    });

    const totalNum = response.data.data.totalNum || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type:  deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload:{
        ...payload,
        deviceList: response.data.data.context || [],
        totalNum,
        pageNum,
      },
    });
  }catch(e){
    console.log(e);
    yield put({
      type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload:{ ...payload, loading: false },
    })
  }
}


function *addDeviceDetail(action){ // 增加设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addDeviceInfo}`
  try{
    const response = yield call(axios.post, url,{...payload});
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        showPage: 'list',
      }
    })
    // }
  }catch(e){
    console.log(e);
    message.error('新增电站设备失败');
  }
}


function *getStationDeviceDetail(action){ // 获取选中设备详情；
  const { payload } = action;
  const { selectedStationIndex } = payload;
  // const url = '/mock/system/stationDetail/001';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.showDeviceInfo}/${payload.deviceFullcode}`
  try{
    const response = yield call(axios.get, url);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        selectedStationIndex,
        stationDeviceDetail: response.data.data || {},
        showPage: 'detail',
      }
    })
    // }
  }catch(e){
    console.log(e);
    message.error('获取电站设备详情失败，请重试');
  }
}

function *getOtherPageDeviceDetail(action){ // 设备详情页面翻页时请求详情+table数据翻页
  const { payload } = action;
  const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDeviceList}`
  try{
    yield put({ type:deviceManageAction.DEVICE_MANAGE_FETCH });
    const { selectedStationIndex } = payload;
    delete payload.selectedStationIndex;
    const listResponse = yield call(axios.post, listUrl, payload);
    const selectedStationCode = listResponse.data.data.context[selectedStationIndex].stationCode;
    const detailUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationDetail}/${selectedStationCode}`
    const detailResponse = yield call(axios.get, detailUrl);
    if(detailResponse.data.code === "10000"){
      yield put({
        type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
        payload: {
          ...payload,
          selectedStationIndex,
          deviceList: listResponse.data.data.context || [],
          totalNum: listResponse.data.data.total || 0,
        }
      })
    }else{
      message.error('获取详情数据失败，请重试');
      yield put({
        type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
        payload: { loading: false },
      })
    }
  }catch(e){
    console.log(e);
    message.error('获取详情数据失败，请重试');
    yield put({
      type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
      payload: { loading: false },
    })
  }
}
function *editDeviceDetail(action){ // 编辑设备详情；
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.editDeviceInfo}`
  try{
    const response = yield call(axios.put, url);
    // if(response.data.code === "10000"){
    yield put({
      type: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      payload: {
        showPage: 'list',
      }
    })
  }catch(e){
    console.log(e);
    message.error('编辑电站详情失败，请重试');
  }
}


export function* watchDeviceManage() {
  yield takeLatest(deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, changeDeviceManageStore);
  yield takeLatest(deviceManageAction.resetStore, resetStore);
  yield takeLatest(deviceManageAction.GET_DEVICE_MANAGE_LIST,getDeviceList);
  yield takeLatest(deviceManageAction.addDeviceDetail,addDeviceDetail);
  yield takeLatest(deviceManageAction.getStationDeviceDetail,getStationDeviceDetail);
  yield takeLatest(deviceManageAction.getStationDeviceDetail,getOtherPageDeviceDetail);
  yield takeLatest(deviceManageAction.editDeviceDetail,editDeviceDetail);
}

