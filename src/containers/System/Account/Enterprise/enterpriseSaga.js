import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import Cookie from 'js-cookie';
import { enterpriseAction } from './enterpriseAction';

//存储payload指定参数，替换reducer-store属性。
function *changeEnterpriseStore(action){
  const { payload } = action;
  yield put({
    type:  enterpriseAction.enterpriseRuducerReplace,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  enterpriseAction.RESET_STORE
  })
}

//请求企业列表数据--暂不删除，以后可能恢复企业列表
/*
  function *getEnterprisList(action){
    const { payload } = action;
    const url = '/mock/system/enterprisList';
    // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getEnterprisList}/${payload.userID}`
    try{
      yield put({ type:enterpriseAction.fetching });
      const response = yield call(axios.get,url);

      const totalNum = response.data.data.totalNum || 0;
      let { currentPage, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if(totalNum === 0){ // 总数为0时，展示0页
        currentPage = 1;
      }else if(maxPage < currentPage){ // 当前页已超出
        currentPage = maxPage;
      }
      yield put({
        type:  enterpriseAction.enterpriseFetchSuccess,
        payload:{
          ...payload,
          enterpriseData: response.data.data.enterpriseData,
          totalNum,
          currentPage,
        },
      });
    }catch(e){
      console.log(e);
    }
  }
*/

//请求单个详细数据信息
function *getEnterpriseDetail(action){
  const { payload } = action;
  // const url = '/mock/system/enterprisDetail/12';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getEnterprisDetail}/${payload.enterpriseId}`
  try{
    yield put({ type:enterpriseAction.fetching });
    const response = yield call(axios.get,url);
    yield put({
      type:  enterpriseAction.enterpriseFetchSuccess,
      payload:{
        enterpriseDetail: response.data.data || {},
        showPage: 'detail',
      },
    });
  }catch(e){
    console.log(e);
  }
}
//初次进入企业-不再提醒编辑企业详情
function *ignoreEnterpirseEdit(action){
  const { payload } = action;
  const url = '/mock/system/ignoreDetail';
  // const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.saveEnterpriseDetail}`
  try{
    yield put({ type:enterpriseAction.fetching });
    const response = yield call(axios.post,url,payload);
    if(response.data.code === "10000"){
      yield put({
        type:  enterpriseAction.enterpriseFetchSuccess,
      });
    }
  }catch(e){
    console.log(e);
  }
}
//新建+编辑企业信息
function *saveEnterpriseInfor(action){
  const { payload } = action;
  // const url = '/mock/system/changeEnterprise';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.saveEnterpriseDetail}`
  try{
    yield put({ type:enterpriseAction.fetching });
    const response = yield call(axios.put,url,payload);
    if(response.data.code === "10000"){
      const { enterpriseLogo } = payload;
      enterpriseLogo && Cookie.set('enterpriseLogo', enterpriseLogo);
      yield put({
        type:  enterpriseAction.getEnterpriseDetail,
        payload:{
          enterpriseId: payload.enterpriseId
        }
      });
    }
  }catch(e){
    console.log(e);
  }
}


export function* watchEnterprise() {
  yield takeLatest(enterpriseAction.changeEnterpriseStore, changeEnterpriseStore);
  yield takeLatest(enterpriseAction.resetStore, resetStore);
  // yield takeLatest(enterpriseAction.getEnterprisList, getEnterprisList);
  yield takeLatest(enterpriseAction.getEnterpriseDetail, getEnterpriseDetail);
  yield takeLatest(enterpriseAction.saveEnterpriseInfor, saveEnterpriseInfor);
  yield takeLatest(enterpriseAction.ignoreEnterpirseEdit,ignoreEnterpirseEdit);

}

