import { all } from 'redux-saga/effects';
import { watchCommon } from './alphaRedux/commonSaga';

import { watchLogin } from './Login/loginSaga';

import { watchChangeShowContainer } from './Operation/Ticket/ticketSaga';
import { watchDefect } from './Operation/Ticket/Defect/defectSaga';
import { watchInspect } from './Operation/Ticket/Inspect/inspectSaga';
import { watchDayReport } from './Operation/Running/DayReport/dayReportSaga';

import { watchEnterprise } from './System/Account/Enterprise/enterpriseSaga';
import { watchDepartment } from './System/Account/Department/departmentSaga';
import { watchRole } from './System/Account/Role/roleSaga';
import { watchUser } from './System/Account/User/userSaga';

import { watchStationManage } from './System/Station/StationManage/stationManageSaga';
import { watchDeviceManage } from './System/Station/DeviceManage/deviceManageSaga';
import { watchPointManage } from './System/Station/PointManage/pointManageSaga';
import { watchAlarmManage } from './System/Station/AlarmManage/alarmManageSaga';

import { watchSingleStationMonitor } from './Monitor/StationMonitor/SingleStation/singleStationSaga';
import { watchDeviceMonitor } from './Monitor/StationMonitor/DeviceMonitor/deviceMonitorSaga';
import {watchStationMonitor} from './Monitor/StationMonitor/AllStation/stationMonitorSaga';
import {watchAlarmMonitor} from './Monitor/Alarm/alarmSaga';

import { watchOtherSaga } from './alphaRedux/otherSaga';
import { watchAllStationSaga } from './StatisticalAnalysis/StationAnalysis/AllStationAnalysis/allStationAnalysisSaga';
import { watchProductionStationSaga } from './StatisticalAnalysis/StationAnalysis/ProductionAnalysis/productionAnalysisSaga';
import { watchOperateStationSaga } from './StatisticalAnalysis/StationAnalysis/OperateAnalysis/operateAnalysisSaga';
import { watchStationContrastSaga } from './StatisticalAnalysis/StationAnalysis/StationContrast/stationContrastSaga';

import { watchPlan } from './System/Production/Plan/planSaga';
// root saga
export default function* rootSaga() {
  yield all([
    //common
    watchCommon(),
    //登陆注册
    watchLogin(),
    //ticket
    watchChangeShowContainer(),
    watchDefect(),//Defect
    watchInspect(),// 巡检
    watchDayReport(), // operation- 日报

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
    // system-production
    watchPlan(),
    // monitor
    watchStationMonitor(),
    watchDeviceMonitor(),
    watchSingleStationMonitor(),
    watchAlarmMonitor(),
    // 无逻辑关系隐藏页面
    watchOtherSaga(),
    //统计分析的全部电站
    watchAllStationSaga(),
    watchProductionStationSaga(),
    watchOperateStationSaga(),
    watchStationContrastSaga(),
  ])
}
