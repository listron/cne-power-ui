import { all } from 'redux-saga/effects';
import {
  watchCommonStoreChange,
  watchGetStations,
  watchGetDeviceTypes,
  watchGetDevices,
  watchGetPartition,
} from './commonSaga';

import {
  watchLogin
} from './loginSaga';

import { watchUser } from './system/account/userSaga';

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

import { watchEnterprise } from './system/account/enterpriseSaga';
import { watchDepartment } from './system/account/departmentSaga';
import { watchRole } from './system/account/roleSaga';

import { watchDeviceMonitor } from './monitor/stationMonitor/deviceMonitorSaga';

// root saga
export default function* rootSaga() {
  yield all([
    //common
    watchCommonStoreChange(),
    watchGetStations(),
    watchGetDeviceTypes(),
    watchGetDevices(),
    watchGetPartition(),
    //登陆注册
    watchLogin(),
    // watchLoginPageChange(), 
    // watchLogin(),
    // watchVerificationCode(),
    // watchCheckCode(),
    // watchCheckPhoneRegister(),
    // watchJoinInSaga(),
    // watchResetPassword(),
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
    watchEnterprise(),
    watchDepartment(),
    watchRole(),
    watchUser(),
    // monitor
    watchDeviceMonitor(),
  ])
} 