import { all } from 'redux-saga/effects';
import { watchCommon } from './commonSaga';

import { watchLogin } from './loginSaga';

import { watchDefect } from './operation/ticket/defectSaga'

import { watchInspect } from './operation/ticket/inspectSaga';

import { watchChangeShowContainer } from './operation/ticket/ticketSaga';
 
import { watchEnterprise } from './system/account/enterpriseSaga';
import { watchDepartment } from './system/account/departmentSaga';
import { watchRole } from '../../containers/System/Account/Role/roleSaga';
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
    watchCommon(),
    //登陆注册
    watchLogin(),
    //ticket
    watchChangeShowContainer(),
    //Defect
    watchDefect(),
    // 巡检
    watchInspect(),
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
