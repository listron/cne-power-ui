import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { assetConfigAction } from './assetsConfigAction';
import moment from 'moment';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor

function *getAssetConfigList(action) {  // 请求报表列表
  const { payload } = action;
  const url =`${APIBasePath}${monitor.getAssetConfigList}`;
  // const url =`/mock/v3/wind/report/fan/gen`;

  try{
    
    const response = yield call(axios.post,url,{...payload,});
    if(response.data.code === '10000') {
      yield put({
        type:assetConfigAction.changeAssetConfigStore,
        payload: {
          filterTable:payload.summaryType,
          assetList: response.data.data.dataList||[],
          loading:false,
          ...payload,
        },
      });     
    }else{
      throw response.data
    }  
  }catch(e){
    console.log(e);
    yield put({
      type:assetConfigAction.changeAssetConfigStore,
      payload: { ...payload, loading: false ,assetList:[]},
    })
  }
}


export function* watchBookAssetsConfig() {
  yield takeLatest(assetConfigAction.getAssetConfigList, getAssetConfigList);
}