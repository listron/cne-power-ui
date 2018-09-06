import { all } from 'redux-saga/effects';
import {
  watchCommonStoreChange,
  watchGetStations,
  watchGetStationDeviceTypes,
  watchGetDeviceTypes,
  watchGetDevices,
  watchGetPartition,
} from './commonSaga';

import { watchLogin } from './loginSaga';

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
import { watchUser } from './system/account/userSaga';

import { watchStationManage } from './system/station/stationManageSaga';
import { watchDeviceManage } from './system/station/deviceManageSaga';
import { watchPointManage } from './system/station/pointManageSaga';
import { watchAlarmManage } from './system/station/alarmManageSaga';

import { watchSingleStationMonitor } from './monitor/stationMonitor/singleStationSaga'; 
import { watchDeviceMonitor } from './monitor/stationMonitor/deviceMonitorSaga';

import {watchStationMonitor} from './monitor/stationMonitor/stationMonitorSaga';
import {watchAlarmMonitor} from './monitor/alarmSaga';

import { watchOtherSaga } from './otherSaga';

// root saga
export default function* rootSaga() {
  yield all([
    //common
    watchCommonStoreChange(),
    watchGetStations(),
    watchGetStationDeviceTypes(),
    watchGetDeviceTypes(),
    watchGetDevices(),
    watchGetPartition(),
    //登陆注册
    watchLogin(),
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
    // system - station
    watchStationManage(),
    watchDeviceManage(),
    watchPointManage(),
    watchAlarmManage(),
    // monitor
    watchStationMonitor(),
    watchDeviceMonitor(),
    watchSingleStationMonitor(),
    watchAlarmMonitor(),
    // 无逻辑关系隐藏页面
    watchOtherSaga()
  ])
}
