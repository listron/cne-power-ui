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

import { watchDefect } from './operation/ticket/defectSaga'

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

import { watchChangeShowContainer } from './operation/ticket/ticketSaga';
 
import { watchEnterprise } from './system/account/enterpriseSaga';
import { watchDepartment } from './system/account/departmentSaga';
import { watchRole } from './system/account/roleSaga';
import { watchUser } from './system/account/userSaga';

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
    //ticket
    watchChangeShowContainer(),
    //Defect
    watchDefect(),
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
    watchStationMonitor(),
    watchDeviceMonitor(),
    watchSingleStationMonitor(),
    watchAlarmMonitor(),
    // 无逻辑关系隐藏页面
    watchOtherSaga()
  ])
}
