import { all } from 'redux-saga/effects';
import { watchCommon } from './alphaRedux/commonSaga';
import { watchPublic } from './alphaRedux/publicSaga';
import { watchLogin } from './Login/loginSaga';
import { watchHomepage } from './Home/homepageSaga';

import { watchWorkStage } from './Operation/WorkStage/workStageSaga';
import { watchWorkPlan } from './Operation/WorkPlan/workPlanSaga';
import { watchPersonnelGps } from './Operation/PersonnelGps/personnelGpsSaga';
import { watchDayReport } from './Operation/Running/DayReport/dayReportSaga';
import { wacthMeterReadSet } from './Operation/Running/MeterReadSet/meterReadSetSaga';
import { watchIntelligentExper } from './Operation/IntelligentExpert/intelligentExpertSaga';
import { watchEamList } from './Operation/EamWork/EamList/eamListSaga';
// 工单
import { watchDefectList } from './Operation/WorkProcess/DefectList/defectListSaga';
import { watchDefectDetail } from './Operation/WorkProcess/DefectDetail/defectDetailSaga';
import { watchInspectList } from './Operation/WorkProcess/InspectList/inspectListSaga';
import { watchInspectDetail } from './Operation/WorkProcess/InspectDetail/inspectDetailSaga';
// 新工单
import { watchEliminateDefectList } from './Operation/NewWorkProcess/EliminateDefectList/defectListSaga';
import { watchEliminateDefectDetail } from './Operation/NewWorkProcess/EliminateDefectDetail/defectDetailSaga';
import { newWatchInspectList } from './Operation/NewWorkProcess/NewInspectList/inspectListSaga';
import { newWatchInspectDetail } from './Operation/NewWorkProcess/NewInspectDetail/inspectDetailSaga';
import { newWatchMeterList } from './Operation/NewWorkProcess/NewMeterList/meterListSaga';
import { newWatchMeterDetail } from './Operation/NewWorkProcess/NewMeterDetail/meterDetailSaga';

import { watchEnterprise } from './System/Account/Enterprise/enterpriseSaga';
import { watchPersonnelManage } from './System/Account/PersonnelManage/personnelManageSaga';
// import { watchDepartment } from './System/Account/Department/departmentSaga';
import { watchRole } from './System/Account/Role/roleSaga';
// import { watchUser } from './System/Account/User/userSaga';
import { watchPlan } from './System/Production/Plan/planSaga';
import { watchWarning } from './System/Production/Warning/warningSaga';
import { watchScore } from './System/Production/Score/scoreSaga';

import { watchStationManage } from './System/Station/StationManage/stationManageSaga';
import { watchDeviceManage } from './System/Station/DeviceManage/deviceManageSaga';
import { watchPointManage } from './System/Station/PointManage/pointManageSaga';
import { watchAlarmManage } from './System/Station/AlarmManage/alarmManageSaga';
import { watchPowerCurve } from './System/Station/PowerCurve/powerCurveSaga';
import { watchWeatherStation } from './System/Station/WeatherStationConf/weatherStationSaga';
import { watchAlarmEvent } from './System/Station/AlarmEvent/alarmEventSaga';
import { watchBranchConfigSaga } from './System/Station/BranchConfig/branchConfigSaga';


import { watchSingleStationMonitor } from './Monitor/StationMonitor/SingleStation/singleStationSaga';
import { watchDeviceMonitor } from './Monitor/StationMonitor/DeviceMonitor/deviceMonitorSaga';
import { watchStationMonitor } from './Monitor/StationMonitor/AllStation/stationMonitorSaga';

import { watchAlarmMonitor } from './Monitor/Alarm/AlarmStatic/alarmSaga';
import { watchAlarmCount } from './Monitor/Alarm/AlarmCount/alarmCountSaga';
import { watchMonitorRealtimeWarning } from './Monitor/Alarm/RealTimeWarning/realtimeWarningSaga';
import { watchMonitorTransferForm } from './Monitor/Alarm/Transfer/transferFormSaga';
import { watchMonitorHandleWarning } from './Monitor/Alarm/HandleRemove/handleRemoveSaga';
import { watchMonitorHistoryWarning } from './Monitor/Alarm/HistoryWarning/historyWarningSaga';
import { watchMonitorDataOverview } from './Monitor/DataAnalysis/Overview/overviewSaga'; // 数据概览
import { watchDataHistoryMonitor } from './Monitor/DataAnalysis/DataHistory/historySaga'; // 数据分析 - 历史趋势
import { watchDataRealtimeMonitor } from './Monitor/DataAnalysis/DataRealtime/realtimeSaga'; // 数据分析 - 实时数据
import { watchDataExport } from './Monitor/DataAnalysis/DataExport/dataExportSaga'; // 数据分析 - 数据导出
import { watchAllDeviceCurve } from './Monitor/PowerCurve/AllDeviceCurve/allDeviceCurveSaga'; // 多设备功率曲线
import { watchSingleDeviceCurve } from './Monitor/PowerCurve/SingleDeviceCurve/singleDeviceCurveSaga'; // 单设备功率曲线

import { watchPvDataHistoryMonitor } from './Monitor/PvDataAnalysis/PvDataHistory/pvHistorySaga'; // 光伏数据分析 - 历史趋势
import { watchPvDataRealtimeMonitor } from './Monitor/PvDataAnalysis/PvDataRealtime/pvRealtimeSaga'; // 光伏数据分析 - 实时数据

import { watchDataScatterDiagramMonitor } from './Monitor/DataAnalysis/DataScatterDiagram/scatterDiagramSaga'; // 数据分析 - 散点图
import { watchDiagnoseCenter } from './Monitor/DiagnoseCenter/diagnoseCenterSaga'; // 诊断中心

import { watchMonitorPowerReport } from './ReportManage/WindReport/PowerReport/powerReportSaga'; // 报表
import { watchMonitorDeviceStatus } from './ReportManage/WindReport/DeviceStatus/deviceStatusSaga'; // 报表
import { watchMonitorMalfunction } from './ReportManage/WindReport/Malfunction/malfunctionSaga'; // 报表
import { watchMonitorPowerLost } from './ReportManage/WindReport/PowerLost/powerLostSaga'; // 报表


import { watchOthersSaga } from './alphaRedux/othersSaga';
// import { watchOtherSaga } from './alphaRedux/otherSaga';
import { watchAllStationSaga } from './StatisticalAnalysis/StationAnalysis/AllStationAnalysis/allStationAnalysisSaga';
import { watchProductionStationSaga } from './StatisticalAnalysis/StationAnalysis/ProductionAnalysis/productionAnalysisSaga';
import { watchStationResourceStationSaga } from './StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/stationResourceAnalysisSaga';
import { watchOperateStationSaga } from './StatisticalAnalysis/StationAnalysis/OperateAnalysis/operateAnalysisSaga';
import { watchStationContrastSaga } from './StatisticalAnalysis/StationAnalysis/StationContrast/stationContrastSaga';
import { watchPerformanceAnalysisSaga } from './StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/performanceAnalysisSaga';
import { watchManufacturers } from './StatisticalAnalysis/EquipmentAnalysis/Manufacturers/manufacturersSaga';
import { watchCustomize } from './StatisticalAnalysis/EquipmentAnalysis/Customize/customizeSaga';
import { watchScoreAnalysis } from './StatisticalAnalysis/StationAnalysis/ScoreAnalysis/scoreAnalysisSaga';
import { watchIntelligentAnalysis } from './StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/intelligentAnalysisSaga';
import { watchDataAnalysisScatterSaga } from './StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/dataAnalysisScatterSaga';
import { watchDailyQuery } from './StatisticalAnalysis/StatisticalReport/DailyQuery/dailyQuerySaga';
import { watchDataAnalysisSequenceSaga } from './StatisticalAnalysis/DataAnalysisTool/DataAnalysisSequence/dataAnalysisSequenceSaga';
import { watchWindResourcesSaga } from './StatisticalAnalysis/DataAnalysisTool/WindResources/windResourcesSaga';



import { watchRealtimeWarning } from './HighAnalysis/IntelligentWarning/RealTimeWarning/realtimeWarningSaga';
import { watchTransferForm } from './HighAnalysis/IntelligentWarning/Transfer/transferFormSaga';
import { watchHandleWarning } from './HighAnalysis/IntelligentWarning/HandleRemove/handleRemoveSaga';
import { watchHistoryWarning } from './HighAnalysis/IntelligentWarning/HistoryWarning/historyWarningSaga';

import { watchCleanoutRecord } from './HighAnalysis/CleanoutModel/CleanoutRecord/cleanoutRecordSaga';
import { watchCleanWarning } from './HighAnalysis/CleanoutModel/CleanWarning/cleanWarningSaga';
import { watchUnhandle } from './HighAnalysis/EarlyWarning/Unhandle/unhandleSaga';
import { watchIgnore } from './HighAnalysis/EarlyWarning/Ignore/ignoreSaga';
import { watchTransfer } from './HighAnalysis/EarlyWarning/Transfer/transferSaga';
import { watchHistory } from './HighAnalysis/EarlyWarning/HistoryWarn/historyWarnSaga';

import { watchAlgorithmControl } from './HighAnalysis/FaultDiagnose/AlgorithmControl/algorithmControlSaga';
import { watchFaultWarn } from './HighAnalysis/FaultDiagnose/FaultWarn/faultWarnSaga';
import { watchFaultWarnList } from './HighAnalysis/FaultDiagnose/FaultWarnList/faultWarnListSaga';
import { watchFaultAllFan } from './HighAnalysis/FaultDiagnose/FaultAllFan/faultAllFanSaga';
import { watchFaultSingleFan } from './HighAnalysis/FaultDiagnose/FaultSingleFan/faultSingleFanSaga';
import { watchFaultWarnHistory } from './HighAnalysis/FaultDiagnose/HistoryWarn/historyWarnSaga';

import { watchAchieveLayout } from './HighAnalysis/Achievement/achieveSaga'; // 高级分析 - 风电分析 - layout
import { watchGroupAchieve } from './HighAnalysis/Achievement/GroupAchieve/groupAchieveSaga'; // 高级分析-风电分析-集团
import { watchAreaAchieve } from './HighAnalysis/Achievement/AreaAchieve/areaAchieveSaga'; // 高级分析-风电分析-区域
import { watchStationAhieve } from './HighAnalysis/Achievement/StationAchieve/stationAchieveSaga'; // 高级分析-风电分析-电站
import { watchRunAchieve } from './HighAnalysis/Achievement/RunAchieve/runAchieveSaga'; // 高级分析-风电分析-运行
import { watchStopAhieve } from './HighAnalysis/Achievement/StopStatus/stopStatusSaga'; // 高级分析 - 风电分析 - 停机状态分析
import { watchActuatorAchieve } from './HighAnalysis/Achievement/Actuator/actuatorSaga'; // 高级分析 - 风电分析 - 执行机构

import { watchBookAssetsConfig } from './Operation/Book/AssetsConfig/assetsConfigSaga';
import { watchBookDeviceManage } from './Operation/Book/DeviceManage/deviceManageSaga';
import { watchBookPartsInfo } from './Operation/Book/DeviceManage/PartInfo/partInfoSaga';
import { watchDeviceAccount } from './Operation/Book/DeviceAccount/deviceAccountSaga';
import { watchWarehouse } from './Operation/Book/Warehouse/warehouseSaga';
import { watchWarehouseManage } from './Operation/Book/WarehouseManage/warehouseManageSaga';
import { watchStockRecords } from './Operation/Book/StockRecords/stockRecordsSaga';
import { watchExaminer } from './Operation/TwoTickets/Examiner/examinerSaga';
import { watchOperateFlow } from './Operation/TwoTickets/OperateFlow/operateFlowSaga';
import { watchWorkFlow } from './Operation/TwoTickets/WorkFlow/workFlowSaga';
import { watchCadePartSaga } from './Operation/CaseSet/casePartSaga';

//报表管理
import { watchReportStation } from './ReportManage/PvReport/ReportStation/reportStationSaga';
import { watchCenterInvert } from './ReportManage/PvReport/ReportDevice/CenterInvert/centerInvertSaga';
import { watchWeatherStationReport } from './ReportManage/PvReport/ReportDevice/WeatherStation/weatherStationSaga';
import { watchCombineInvert } from './ReportManage/PvReport/ReportDevice/CombineInvert/combineInvertSaga';
import { watchConfluenceBox } from './ReportManage/PvReport/ReportDevice/ConfluenceBox/confluenceBoxSaga';






// root saga
export default function* rootSaga() {
  yield all([
    watchCommon(), // common
    watchPublic(), // public
    watchLogin(), // 登录注册
    watchHomepage(), // 主页
    watchWorkStage(), // 工作台
    watchWorkPlan(), // 工作计划管理
    watchPersonnelGps(), //员工定位
    watchDayReport(), // operation- 日报
    wacthMeterReadSet(), // 抄表设置
    watchIntelligentExper(), // 光伏智能专家库
    watchEamList(),

    watchDefectList(), // 缺陷列表
    watchDefectDetail(), // 缺陷详情
    watchInspectList(), // 巡检列表
    watchInspectDetail(), // 巡检详情

    watchEliminateDefectList(), // 新缺陷列表
    watchEliminateDefectDetail(), // 新缺陷详情
    newWatchInspectList(), // 新巡检列表
    newWatchInspectDetail(), // 新巡检详情
    newWatchMeterList(), // 新抄表列表
    newWatchMeterDetail(), // 新抄表详情

    //system-enterprise
    watchEnterprise(),
    watchPersonnelManage(),
    // watchDepartment(),
    watchRole(),
    // watchUser(),
    // system - station
    watchStationManage(),
    watchDeviceManage(),
    watchPointManage(),
    watchAlarmManage(),
    watchPowerCurve(),
    watchWeatherStation(),
    watchAlarmEvent(), // 平台级告警事件
    watchBranchConfigSaga(),
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
    watchMonitorDataOverview(), // 数据分析 - 数据概览
    watchDataHistoryMonitor(), // 数据分析 - 历史趋势
    watchDataRealtimeMonitor(), // 数据分析 - 实时数据
    watchDataExport(), // 数据分析 - 数据导出
    watchAllDeviceCurve(), //功率曲线
    watchSingleDeviceCurve(), //单风机功率曲线
    watchMonitorPowerReport(), //报表--电量
    watchMonitorDeviceStatus(), //报表-设备状态
    watchMonitorMalfunction(), //报表-故障
    watchMonitorPowerLost(), //报表--电量损失
    watchPvDataHistoryMonitor(), // 光伏数据分析-历史趋势
    watchPvDataRealtimeMonitor(), // 光伏数据分析-实时数据


    watchDataScatterDiagramMonitor(), //  数据分析 - 散点图
    watchDiagnoseCenter(), // 诊断中心

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
    watchDataAnalysisScatterSaga(), //数据分析散点图
    watchDailyQuery(), // 日报查询
    watchDataAnalysisSequenceSaga(),
    watchWindResourcesSaga(), // 数据分析工具-风资源-风能频率图
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

    watchAchieveLayout(), //  高级分析 - 风电分析 - layout
    watchGroupAchieve(), // 高级分析 - 风电分析 - 集团
    watchAreaAchieve(), // 高级分析 - 风电分析 - 区域
    watchStationAhieve(), // 高级分析 - 风电分析 - 电站
    watchStopAhieve(), // 高级分析 - 风电分析 - 停机状态分析
    watchRunAchieve(), // 高级分析 - 风电分析 - 运行
    watchActuatorAchieve(), // 高级分析 - 风电分析 - 执行机构
    // 工单
    //operation_Book台账
    watchBookAssetsConfig(), //资产配置
    watchBookDeviceManage(), //设备管理
    watchBookPartsInfo(), //组件信息
    watchDeviceAccount(), //设备台账
    watchWarehouse(), //仓库配置
    watchWarehouseManage(), // 仓库管理
    watchStockRecords(), //出入库记录
    watchExaminer(), // 两票 -审核人
    watchOperateFlow(), //两票 -操作票
    watchWorkFlow(), ////两票 -工作票
    //案例集
    watchCadePartSaga(), //案例集
    // 报表管理
    watchReportStation(), //电站报表
    watchCenterInvert(), //设备报表
    watchWeatherStationReport(), //气象站报表
    watchCombineInvert(), //逆变器（组串）
    watchConfluenceBox(), //汇流箱
  ]);
}

