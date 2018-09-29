import { all } from 'redux-saga/effects';
import { watchCommon } from './commonSaga';

import { watchLogin } from './loginSaga';

import { watchDefect } from './operation/ticket/defectSaga'

import { watchInspect } from './operation/ticket/inspectSaga';

import { watchChangeShowContainer } from './operation/ticket/ticketSaga';
 
import { watchEnterprise } from '../../containers/System/Account/Enterprise/enterpriseSaga';
import { watchDepartment } from '../../containers/System/Account/Department/departmentSaga';
import { watchRole } from '../../containers/System/Account/Role/roleSaga';
import { watchUser } from '../../containers/System/Account/User/userSaga';

import { watchStationManage } from '../../containers/System/Station/StationManage/stationManageSaga';
import { watchDeviceManage } from '../../containers/System/Station/DeviceManage/deviceManageSaga';
import { watchPointManage } from '../../containers/System/Station/PointManage/pointManageSaga';
import { watchAlarmManage } from '../../containers/System/Station/AlarmManage/alarmManageSaga';

import { watchSingleStationMonitor } from './monitor/stationMonitor/singleStationSaga'; 
import { watchDeviceMonitor } from './monitor/stationMonitor/deviceMonitorSaga';

import {watchStationMonitor} from './monitor/stationMonitor/stationMonitorSaga';
import {watchAlarmMonitor} from '../../containers/Monitor/Alarm/alarmSaga';

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
