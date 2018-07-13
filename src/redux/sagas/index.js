import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  watchTopMenuChange,
  watchGetStations,
  watchGetDeviceTypes,
  watchGetDevices,
  watchGetPartition,
} from './commonSaga';
import { 
  // watchSendCode, 
  watchLogin, 
  // watchCheckCode, 
  // watchChangePSW, 
  // watchSignup, 
  // watchGetShowStatus, 
  // watchChangeShowStatus, 
  // watchCreateRegister 
} from './login';

import { 
  watchPreLoginPageChangeSaga
} from './preLogin/preLoginSaga';

import {
  watchLoginSaga,
  watchVerificationCode,
  watchCheckCode,
} from './preLogin/loginSaga';

import {
  watchCheckPhoneRegister,
} from './preLogin/registerSaga';

import {
  watchGetDefectList,
  watchBatchDeleteDefect,
  watchBatchSendDefect,
  watchBatchRejectDefect,
  watchBatchClosedDefect,
  watchBatchCheckdDefect,
  watchSetDefectId,
  watchSetSelectedDefect,
  watchGetDefectDetail,
  watchGetDefectCommonList,
  watchSendDefect,
  watchRejectDefect,
  watchCloseDefect,
  watchHandleDefect,
  watchCheckDefect,
  watchGetDefectTypes,
  watchCreateNewDefect,
  watchClearDefect,
} from './operation/ticket/defectSaga'

import {
  watchGetInspectList,
  watchGetInspectDetail,
  watchSetInspectId,  
  watchAddInspectAbnormal,
  watchClearInspect,
  watchTransformDefect,
  watchSetInspectCheck,
  watchFinishInspect,
  watchCreateInspect,
  watchDeleteAbnormal,
  watchGetInspectStandard,
  watchInspectCheckBatch,
} from './operation/ticket/inspectSaga';

import {
  watchChangeShowContainer
} from './operation/ticket/ticketSaga';

import { watchEnterpriseSaga } from './system/enterpriseSaga';

import axios from 'axios';

import {
  GET_POSTS_SAGA,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAIL,
} from '../../constants/actionTypes';

import {
  GET_POSTS_URL
} from '../../constants/url';

const FetchActions = [GET_POSTS_SAGA];

// worker saga
function* showPostsAsync(action) {
  let type = action.type;
  console.log('start action:' + type)
  try {
    console.log('=========Action RUN================')
    const response = yield call(axios.get, GET_POSTS_URL);
    yield put({ type: GET_POSTS_SUCCESS, posts: response.data });
    console.log('=========Dispatch Success================');
  } catch (e) {
    yield put({ type: GET_POSTS_FAIL, error: e });
    console.log('=========Dispatch Failure================');
    console.log(e);
  }
}

// watcher saga
function* watchGetPosts() {
  yield takeLatest(FetchActions, showPostsAsync);
}

// root saga
export default function* rootSaga() {
  yield all([
    //common
    watchTopMenuChange(),
    watchGetStations(),
    watchGetDeviceTypes(),
    watchGetDevices(),
    watchGetPosts(),
    watchGetPartition(),
    //登陆注册
    watchPreLoginPageChangeSaga(), 
    watchLoginSaga(),
    watchLogin(),
    watchVerificationCode(),
    watchCheckCode(),
    watchCheckPhoneRegister(),
    
    // watchGetCompInfo(),
    // watchCheckPhone(),
    // watchChangePSW(),
    // // watchGetComInfoSu(),
    // watchSignup(),
    // // watchCheckPhoneSU(),
    // watchGetShowStatus(),
    // watchChangeShowStatus(),
    // watchCreateRegister(),
    //Defect
    watchGetDefectList(),
    watchSetDefectId(),
    watchSetSelectedDefect(),
    watchGetDefectDetail(),
    watchBatchDeleteDefect(),
    watchBatchSendDefect(),
    watchBatchRejectDefect(),
    watchBatchClosedDefect(),
    watchBatchCheckdDefect(),
    watchGetDefectCommonList(),
    watchSendDefect(),
    watchRejectDefect(),
    watchCloseDefect(),
    watchHandleDefect(),
    watchCheckDefect(),
    watchChangeShowContainer(),
    watchGetDefectTypes(),
    watchCreateNewDefect(),
    watchClearDefect(),
    // 巡检
    watchGetInspectList(),
    watchSetInspectId(),
    watchGetInspectDetail(),
    watchAddInspectAbnormal(),
    watchClearInspect(),
    watchTransformDefect(),
    watchSetInspectCheck(),
    watchFinishInspect(),
    watchCreateInspect(),
    watchDeleteAbnormal(),
    watchGetInspectStandard(),
    watchInspectCheckBatch(),
    //ticket

    //system-enterprise
    watchEnterpriseSaga(),
  ])
} 