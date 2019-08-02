import { all } from 'redux-saga/effects';
import { watchCommon } from './alphaRedux/commonSaga';
import { watchLogin } from './Login/loginSaga';
import { watchHomepage } from './Home/homepageSaga';

import { watchChangeShowContainer } from './Operation/Ticket/ticketSaga';
import { watchDefect } from './Operation/Ticket/Defect/defectSaga';
import { watchInspect } from './Operation/Ticket/Inspect/inspectSaga';
import { watchPersonnelGps } from './Operation/PersonnelGps/personnelGpsSaga';
import { watchDayReport } from './Operation/Running/DayReport/dayReportSaga';
import { watchIntelligentExper } from './Operation/IntelligentExpert/intelligentExpertSaga';

import { watchEnterprise } from './System/Account/Enterprise/enterpriseSaga';
import { watchDepartment } from './System/Account/Department/departmentSaga';
import { watchRole } from './System/Account/Role/roleSaga';
import { watchUser } from './System/Account/User/userSaga';
import { watchPlan } from './System/Production/Plan/planSaga';
import { watchWarning } from './System/Production/Warning/warningSaga';
import { watchScore } from './System/Production/Score/scoreSaga';

import { watchStationManage } from './System/Station/StationManage/stationManageSaga';
import { watchDeviceManage } from './System/Station/DeviceManage/deviceManageSaga';
import { watchPointManage } from './System/Station/PointManage/pointManageSaga';
import { watchAlarmManage } from './System/Station/AlarmManage/alarmManageSaga';
import { watchPowerCurve } from './System/Station/PowerCurve/powerCurveSaga';
import { watchWeatherStation } from './System/Station/WeatherStationConf/weatherStationSaga';


import { watchSingleStationMonitor } from './Monitor/StationMonitor/SingleStation/singleStationSaga';
import { watchDeviceMonitor } from './Monitor/StationMonitor/DeviceMonitor/deviceMonitorSaga';
import { watchStationMonitor } from './Monitor/StationMonitor/AllStation/stationMonitorSaga';

import {watchAlarmMonitor}  from './Monitor/Alarm/AlarmStatic/alarmSaga';
import {watchAlarmCount} from './Monitor/Alarm/AlarmCount/alarmCountSaga';
import { watchMonitorRealtimeWarning } from './Monitor/Alarm/RealTimeWarning/realtimeWarningSaga';
import { watchMonitorTransferForm } from './Monitor/Alarm/Transfer/transferFormSaga';
import { watchMonitorHandleWarning } from './Monitor/Alarm/HandleRemove/handleRemoveSaga';
import { watchMonitorHistoryWarning } from './Monitor/Alarm/HistoryWarning/historyWarningSaga';
import { watchDataHistoryMonitor } from './Monitor/DataAnalysis/DataHistory/historySaga'; // 数据分析 - 历史趋势
import { watchDataRealtimeMonitor } from './Monitor/DataAnalysis/DataRealtime/realtimeSaga'; // 数据分析 - 实时数据
import { watchDataExport } from './Monitor/DataAnalysis/DataExport/dataExportSaga'; // 数据分析 - 数据导出
import { watchAllDeviceCurve } from './Monitor/PowerCurve/AllDeviceCurve/allDeviceCurveSaga'; // 多设备功率曲线
import { watchSingleDeviceCurve } from './Monitor/PowerCurve/SingleDeviceCurve/singleDeviceCurveSaga'; // 单设备功率曲线

import { watchDataScatterDiagramMonitor } from './Monitor/DataAnalysis/DataScatterDiagram/scatterDiagramSaga'; // 数据分析 - 散点图

import { watchMonitorPowerReport } from './Monitor/Report/PowerReport/powerReportSaga'; // 报表
import { watchMonitorDeviceStatus } from './Monitor/Report/DeviceStatus/deviceStatusSaga'; // 报表
import { watchMonitorMalfunction } from './Monitor/Report/Malfunction/malfunctionSaga'; // 报表
import { watchMonitorPowerLost } from './Monitor/Report/PowerLost/powerLostSaga'; // 报表


import { watchOthersSaga } from './alphaRedux/othersSaga';
// import { watchOtherSaga } from './alphaRedux/otherSaga';
import { watchAllStationSaga } from './StatisticalAnalysis/StationAnalysis/AllStationAnalysis/allStationAnalysisSaga';
import { watchProductionStationSaga } from './StatisticalAnalysis/StationAnalysis/ProductionAnalysis/productionAnalysisSaga';
import { watchStationResourceStationSaga } from './StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/stationResourceAnalysisSaga';
import { watchOperateStationSaga } from './StatisticalAnalysis/StationAnalysis/OperateAnalysis/operateAnalysisSaga';
import { watchStationContrastSaga } from './StatisticalAnalysis/StationAnalysis/StationContrast/stationContrastSaga';
import { watchPerformanceAnalysisSaga } from "./StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/performanceAnalysisSaga";
import { watchManufacturers } from "./StatisticalAnalysis/EquipmentAnalysis/Manufacturers/manufacturersSaga";
import { watchCustomize } from "./StatisticalAnalysis/EquipmentAnalysis/Customize/customizeSaga";
import { watchScoreAnalysis } from "./StatisticalAnalysis/StationAnalysis/ScoreAnalysis/scoreAnalysisSaga";
import { watchIntelligentAnalysis } from "./StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/intelligentAnalysisSaga";



import { watchRealtimeWarning } from "./HighAnalysis/IntelligentWarning/RealTimeWarning/realtimeWarningSaga";
import { watchTransferForm } from "./HighAnalysis/IntelligentWarning/Transfer/transferFormSaga";
import { watchHandleWarning } from "./HighAnalysis/IntelligentWarning/HandleRemove/handleRemoveSaga";
import { watchHistoryWarning } from "./HighAnalysis/IntelligentWarning/HistoryWarning/historyWarningSaga";

import { watchCleanoutRecord } from "./HighAnalysis/CleanoutModel/CleanoutRecord/cleanoutRecordSaga";
import { watchCleanWarning } from "./HighAnalysis/CleanoutModel/CleanWarning/cleanWarningSaga";
import { watchUnhandle } from "./HighAnalysis/EarlyWarning/Unhandle/unhandleSaga";
import { watchIgnore } from "./HighAnalysis/EarlyWarning/Ignore/ignoreSaga";
import { watchTransfer } from "./HighAnalysis/EarlyWarning/Transfer/transferSaga";
import { watchHistory } from "./HighAnalysis/EarlyWarning/HistoryWarn/historyWarnSaga";

import { watchAlgorithmControl } from "./HighAnalysis/FaultDiagnose/AlgorithmControl/algorithmControlSaga";
import { watchFaultWarn } from "./HighAnalysis/FaultDiagnose/FaultWarn/faultWarnSaga";
import { watchFaultWarnList } from "./HighAnalysis/FaultDiagnose/FaultWarnList/faultWarnListSaga";
import { watchFaultAllFan } from "./HighAnalysis/FaultDiagnose/FaultAllFan/faultAllFanSaga";
import { watchFaultSingleFan } from "./HighAnalysis/FaultDiagnose/FaultSingleFan/faultSingleFanSaga";
import { watchFaultWarnHistory } from "./HighAnalysis/FaultDiagnose/HistoryWarn/historyWarnSaga";

import { watchAhieveLayout } from './HighAnalysis/Achievement/achieveSaga'; // 高级分析 - 风电分析 - layout
import { watchGroupAhieve } from './HighAnalysis/Achievement/GroupAchieve/groupAchieveSaga'; // 高级分析-风电分析-集团

import { watchWorkOrder } from "./Operation/Ticket/WorkOrder/workOrderSaga";
import { watchBookAssetsConfig } from "./Operation/Book/AssetsConfig/assetsConfigSaga";
import { watchBookDeviceManage } from "./Operation/Book/DeviceManage/deviceManageSaga";
import { watchBookPartsInfo } from "./Operation/Book/DeviceManage/PartInfo/partInfoSaga";
import { watchDeviceAccount } from "./Operation/Book/DeviceAccount/deviceAccountSaga";
import { watchWarehouse } from "./Operation/Book/Warehouse/warehouseSaga";
import { watchWarehouseManage } from './Operation/Book/WarehouseManage/warehouseManageSaga';
import { watchStockRecords } from "./Operation/Book/StockRecords/stockRecordsSaga";
import { watchExaminer } from "./Operation/TwoTickets/Examiner/examinerSaga";
import { watchOperateFlow } from "./Operation/TwoTickets/OperateFlow/operateFlowSaga";
import { watchWorkFlow } from "./Operation/TwoTickets/WorkFlow/workFlowSaga";

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
    watchIntelligentExper(), // 光伏智能专家库

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
    watchWeatherStation(),
    // system-production
    watchPlan(),
    watchWarning(), //预警配置
    watchScore(), // 绩效评分
    // monitor
    watchStationMonitor(),
    watchDeviceMonitor(),
    watchSingleStationMonitor(),
    watchAlarmMonitor(),
    watchAlarmCount(),
    watchMonitorRealtimeWarning(),
    watchMonitorTransferForm(),
    watchMonitorHandleWarning(),
    watchMonitorHistoryWarning(),
    watchDataHistoryMonitor(), // 数据分析 - 历史趋势
    watchDataRealtimeMonitor(), // 数据分析 - 实时数据
    watchDataExport(), // 数据分析 - 数据导出
    watchAllDeviceCurve(),//功率曲线
    watchSingleDeviceCurve(),//单风机功率曲线
    watchMonitorPowerReport(),//报表--电量
    watchMonitorDeviceStatus(),//报表-设备状态
    watchMonitorMalfunction(),//报表-故障
    watchMonitorPowerLost(),//报表--电量损失


    watchDataScatterDiagramMonitor(), //  数据分析 - 散点图

    watchOthersSaga(),
    // watchOtherSaga(),
    //统计分析的全部电站
    watchAllStationSaga(),
    watchProductionStationSaga(),
    watchOperateStationSaga(),
    watchStationContrastSaga(),
    watchStationResourceStationSaga(),
    watchScoreAnalysis(), //电站评分
    //设备分析
    watchPerformanceAnalysisSaga(),
    watchManufacturers(),
    watchCustomize(),
    // 统计报表
    watchIntelligentAnalysis(), // 智能分析报告
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
    // 高级分析-风机故障检测与诊断
    watchAlgorithmControl(),
    watchFaultWarn(),
    watchFaultWarnList(),
    watchFaultAllFan(),
    watchFaultWarnHistory(),
    watchFaultSingleFan(),

    watchAhieveLayout(), //  高级分析 - 风电分析 - layout
    watchGroupAhieve(), // 高级分析 - 风电分析 - 集团
    // 工单
    watchWorkOrder(),
    //operation_Book台账
    watchBookAssetsConfig(),//资产配置
    watchBookDeviceManage(),//设备管理
    watchBookPartsInfo(),//组件信息
    watchDeviceAccount(),//设备台账
    watchWarehouse(),//仓库配置
    watchWarehouseManage(), // 仓库管理
    watchStockRecords(),//出入库记录
    watchExaminer(), // 两票 -审核人
    watchOperateFlow(),//两票 -操作票
    watchWorkFlow(),////两票 -工作票
  ])
}
