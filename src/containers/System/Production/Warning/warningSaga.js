import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import {warningAction} from './warningAction.js';
import Cookie from 'js-cookie';


function *changeStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  warningAction.CHANGE_WARNING_STORE,
    payload,
  })
}

function *getSeriesData(action){ //获取低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getSeriesData}`
  try{
    yield put({ type:warningAction.WARNING_MANAGE_FETCH });
    const response = yield call(axios.get,url,payload);
    if(response.data.code==='10000'){
      yield put({
        type:  warningAction.WARNING_MANAGE_FETCHZ_SUCESS,
        payload:{
          getConf : response.data.data || {},
          lostGenPercent : response.data.data.lostGenPercent,
          isSend : response.data.data.isSend,
          sendNum : response.data.data.sendNum,
        },
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *addSeriesData(action){ //修改低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addSeriesData}`
  try{
    yield put({ type:warningAction.WARNING_MANAGE_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code==='10000'){
      yield put({
        type : warningAction.getSeriesData
      });
    }
  }catch(e){
    console.log(e);
  }
}

function *getCleaningData(action){ //获取清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getCleaningData}/${payload.enterpriseId}`
  try{
    yield put({ type:warningAction.WARNING_MANAGE_FETCH });
    const response = yield call(axios.get,url,payload);
    yield put({
      type:  warningAction.WARNING_MANAGE_FETCHZ_SUCESS,
      payload:{
        getClean : response.data.data || {},
        lossPowerPercent : response.data.data && response.data.data.lossPowerPercent||null,
      },
    });
    }catch(e){
    console.log(e);
  }
}

function *addCleaningData(action){ //设置清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addCleaningData}`
  try{
    yield put({ type:warningAction.WARNING_MANAGE_FETCH });
    const response = yield call(axios.post,url,payload);
    if(response.data.code==='10000'){
      const params = { 
        enterpriseId: Cookie.get('enterpriseId'),
        };
      yield put({
        type : warningAction.getCleaningData,
        payload: { ...params }
      });
    }
  }catch(e){
    console.log(e);
  }
}

export function* watchWarning() {
  yield takeLatest(warningAction.getSeriesData, getSeriesData);
  yield takeLatest(warningAction.getCleaningData, getCleaningData);
  yield takeLatest(warningAction.addSeriesData, addSeriesData);
  yield takeLatest(warningAction.addCleaningData, addCleaningData);
  yield takeLatest(warningAction.CHANGE_WARNING_STORE_SAGA, changeStore);
}