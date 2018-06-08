import { call, put, takeLatest, delay, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import { stringify } from 'qs';
import {message} from 'antd';
import {setCookie} from '../../utils';
import Config from '../../constants/config';
import Path from '../../constants/path';


//根据域名获取企业信息
function* getCompInfo(action) {
  let url = Config.APIBasePath + Path.APISubPaths.getCompInfo;
  yield put({ type: BEGIN_FETCH });
  try {
    const response = yield call(axios.post, url, {domain: action.params.domain});
    if(response.data.success){
      yield put({ type: GET_COMPINFO_SUCCESS, data: response.data.result });      
      setCookie('enterpriseId',response.data.result.enterpriseId);
    }else{
      yield put({ type: GET_COMPINFO_FAIL, data:{error:response.data.error}});    
      message.error(response.data.error);        
    }
  } catch (e) {
    message.error(e)
  }
}

export function* watchGetCompInfo() {
  yield takeLatest(GET_COMPINFO_SAGA, getCompInfo);
}