import { all } from 'redux-saga/effects';
import { watchCommon } from './alphaRedux/commonSaga';
import { watchLogin } from './Login/loginSaga';
import { watchHomepage } from './Home/homepageSaga';

import { watchChangeShowContainer } from './Operation/Ticket/ticketSaga';
import { watchDefect } from './Operation/Ticket/Defect/defectSaga';
import { watchInspect } from './Operation/Ticket/Inspect/inspectSaga';
import { watchPersonnelGps } from './Operation/PersonnelGps/personnelGpsSaga';
import { watchDayReport } from './Operation/Running/DayReport/dayReportSaga';

import { watchEnterprise } from './System/Account/Enterprise/enterpriseSaga';
import { watchDepartment } from './System/Account/Department/departmentSaga';
import { watchRole } from './System/Account/Role/roleSaga';
import { watchUser } from './System/Account/User/userSaga';
import { watchPlan } from './System/Production/Plan/planSaga';
import { watchWarning } from './System/Production/Warning/warningSaga';

import { watchStationManage } from './System/Station/StationManage/stationManageSaga';
import { watchDeviceManage } from './System/Station/DeviceManage/deviceManageSaga';
import { watchPointManage } from './System/Station/PointManage/pointManageSaga';
import { watchAlarmManage } from './System/Station/AlarmManage/alarmManageSaga';
import { watchPowerCurve } from './System/Station/PowerCurve/powerCurveSaga';

import { watchSingleStationMonitor } from './Monitor/StationMonitor/SingleStation/singleStationSaga';
import { watchDeviceMonitor } from './Monitor/StationMonitor/DeviceMonitor/deviceMonitorSaga';
import {watchStationMonitor} from './Monitor/StationMonitor/AllStation/stationMonitorSaga';
import {watchAlarmMonitor} from './Monitor/Alarm/alarmSaga';
import {watchMonitorRealtimeWarning} from './Monitor/Alarm/RealTimeWarning/realtimeWarningSaga';
import {watchMonitorTransferForm} from './Monitor/Alarm/Transfer/transferFormSaga';
import {watchMonitorHandleWarning} from './Monitor/Alarm/HandleRemove/handleRemoveSaga';
import {watchMonitorHistoryWarning} from './Monitor/Alarm/HistoryWarning/historyWarningSaga';

import { watchOtherSaga } from './alphaRedux/otherSaga';
import { watchAllStationSaga } from './StatisticalAnalysis/StationAnalysis/AllStationAnalysis/allStationAnalysisSaga';
import { watchProductionStationSaga } from './StatisticalAnalysis/StationAnalysis/ProductionAnalysis/productionAnalysisSaga';
import { watchStationResourceStationSaga } from './StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/stationResourceAnalysisSaga';
import { watchOperateStationSaga } from './StatisticalAnalysis/StationAnalysis/OperateAnalysis/operateAnalysisSaga';
import { watchStationContrastSaga } from './StatisticalAnalysis/StationAnalysis/StationContrast/stationContrastSaga';
import { watchPerformanceAnalysisSaga } from "./StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/performanceAnalysisSaga";
import { watchManufacturers } from "./StatisticalAnalysis/EquipmentAnalysis/Manufacturers/manufacturersSaga";
import { watchCustomize } from "./StatisticalAnalysis/EquipmentAnalysis/Customize/customizeSaga";



import { watchRealtimeWarning} from "./HighAnalysis/IntelligentWarning/RealTimeWarning/realtimeWarningSaga";
import { watchTransferForm} from "./HighAnalysis/IntelligentWarning/Transfer/transferFormSaga";
import { watchHandleWarning} from "./HighAnalysis/IntelligentWarning/HandleRemove/handleRemoveSaga";
import { watchHistoryWarning} from "./HighAnalysis/IntelligentWarning/HistoryWarning/historyWarningSaga";

import { watchCleanoutRecord} from "./HighAnalysis/CleanoutModel/CleanoutRecord/cleanoutRecordSaga";
import { watchCleanWarning } from "./HighAnalysis/CleanoutModel/CleanWarning/cleanWarningSaga";
import { watchUnhandle } from "./HighAnalysis/EarlyWarning/Unhandle/unhandleSaga";
import { watchIgnore } from "./HighAnalysis/EarlyWarning/Ignore/ignoreSaga";
import { watchTransfer } from "./HighAnalysis/EarlyWarning/Transfer/transferSaga";
import { watchHistory } from "./HighAnalysis/EarlyWarning/HistoryWarn/historyWarnSaga";

import { watchWorkOrder } from "./Operation/Ticket/WorkOrder/workOrderSaga";



// root saga
export default function* rootSaga() {
  yield all([
    watchCommon(), // common
    watchLogin(), // 登录注册
    watchHomepage(), // 主页
    //ticket
    watchChangeShowContainer(),
    watchDefect(),//Defect
    watchInspect(),// 巡检
    watchPersonnelGps(),//员工定位
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
    watchPowerCurve(),
    // system-production
    watchPlan(),
    watchWarning(), //预警配置
    // monitor
    watchStationMonitor(),
    watchDeviceMonitor(),
    watchSingleStationMonitor(),
    watchAlarmMonitor(),
    watchMonitorRealtimeWarning(),
    watchMonitorTransferForm(),
    watchMonitorHandleWarning(),
    watchMonitorHistoryWarning(),
    // 无逻辑关系隐藏页面
    watchOtherSaga(),
    //统计分析的全部电站
    watchAllStationSaga(),
    watchProductionStationSaga(),
    watchOperateStationSaga(),
    watchStationContrastSaga(),
    watchStationResourceStationSaga(),
    //设备分析
    watchPerformanceAnalysisSaga(),
    watchManufacturers(),
    watchCustomize(),
    //高级分析>清洗模型>清洗记录+清洗预警
    watchRealtimeWarning(),
    watchTransferForm(),
    watchHandleWarning(),
    watchHistoryWarning(),
    watchCleanoutRecord(),
    watchCleanWarning(),
    // 高级分析-低效组串
    watchUnhandle(),
    watchIgnore(),
    watchTransfer(),
    watchHistory(),
    // 工单
    watchWorkOrder(),
    
  ])
}
