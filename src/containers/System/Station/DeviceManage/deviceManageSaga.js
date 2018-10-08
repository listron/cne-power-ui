import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { deviceManageAction } from './deviceManageAction';

function *changeDeviceManageStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  deviceManageAction.CHANGE_DEVICE_MANAGE_STORE,
    payload,
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
      pageNum = 0;
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


export function* watchDeviceManage() {
  yield takeLatest(deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, changeDeviceManageStore);
  yield takeLatest(deviceManageAction.GET_DEVICE_MANAGE_LIST,getDeviceList)
}

