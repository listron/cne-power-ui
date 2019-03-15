import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import styles from './loading.scss'
/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/

const routers = [
  { // 主页
    path: '/homepage',
    component: () => import('../containers/Home/Homepage'),
  }, { // 运维管理-工单-员工定位
    path: '/operation/gps',
    //component: Building,
    component: () => import('../containers/Operation/PersonnelGps/PersonnelGps'),
  }, { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    component: () => import('../containers/Operation/Ticket/Ticket'),
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    component: () => import('../components/Common/Building/Building'),
  }, { // 两票管理>第一种工作票
    path: '/operation/twoTickets/typeone',
    component: () => import('../components/Common/Building/Building'),
  }, { // 第二种工作票
    path: '/operation/twoTickets/typetwo',
    component: () => import('../components/Common/Building/Building'),
  }, { // 备品备件
    path: '/operation/book/sparePart',
    component: () => import('../components/Common/Building/Building'),
  }, { // 工器具
    path: '/operation/book/instrument',
    component: () => import('../components/Common/Building/Building'),
  }, { // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    component: () => import('../containers/Operation/Running/DayReport/DayReport'),
  }, { // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    component: () => import('../components/Common/Building/Building'),
  }, { // 运维管理-经验库
    path: '/operation/experience',
    component: () => import('../components/Common/Building/Building'),
  }, { // 系统管理-账户管理-企业
    path: '/system/account/enterprise',
    component: () => import('../containers/System/Account/Enterprise/Enterprise'),
  }, { // 系统管理-账户管理-部门
    path: '/system/account/department',
    component: () => import('../containers/System/Account/Department/Department'),
  }, { // 系统管理-账户管理-用户
    path: '/system/account/user',
    component: () => import('../containers/System/Account/User/User'),
  }, { // 系统管理-账户管理-角色
    path: '/system/account/role',
    component: () => import('../containers/System/Account/Role/Role'),
  }, { // 实时监控-告警-实时告警
    path: '/monitor/alarm/realtime',
    component: () => import('../containers/Monitor/Alarm/RealTimeWarning/RealTimeWarning'),
  }, { // 实时监控-告警-已转工单
    path: '/monitor/alarm/transfer',
    component: () => import('../containers/Monitor/Alarm/Transfer/TransferForm'),
  }, { // 实时监控-告警-手动解除
    path: '/monitor/alarm/relieve',
    component: () => import('../containers/Monitor/Alarm/HandleRemove/HandleRemove'),
  }, { // 实时监控-告警-历史告警
    path: '/monitor/alarm/history',
    component: () => import('../containers/Monitor/Alarm/HistoryWarning/HistoryWarning'),
  }, { // 实时监控-告警-单电站告警统计
    path: '/monitor/alarm/statistic/:stationCode',
    component: () => import('../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic'),
  }, { // 实时监控-告警-告警统计
    path: '/monitor/alarm/statistic',
    component: () => import('../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic'),
  }, { // 实时监控-电站监控-全部电站
    path: '/monitor/station',
    component: () => import('../containers/Monitor/StationMonitor/AllStation/AllStation'),
  }, { // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    component: () => import('../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor'),
  }, { // 实时监控-电站监控-单电站
    path: '/monitor/singleStation/:stationCode',
    component: () => import('../containers/Monitor/StationMonitor/SingleStation/SingleStation'),
  }, { //实时监控-数据分析-历史趋势
    path: '/monitor/data/history',
    component: () => import('../containers/Monitor/DataAnalysis/DataHistory/DataHistory'),
  }, { //实时监控-数据分析-散点图
    path: '/monitor/data/scatterDiagram',
    component: () => import('../containers/Monitor/DataAnalysis/DataScatterDiagram/DataScatterDiagram'),
  }, { //实时监控-数据分析-实时数据
    path: '/monitor/data/realtime',
    component: () => import('../containers/Monitor/DataAnalysis/DataRealtime/DataRealtime'),
    // component: () => import('../components/Common/Building/Building'),
  }, { //实时监控-报表查询-电量报表
    path: '/monitor/report/powerReport',
    component: () => import('../components/Common/Building/Building'),
  }, { //实时监控-报表查询-设备状态
    path: '/monitor/report/deviceStatus',
    component: () => import('../components/Common/Building/Building'),
  }, { //实时监控-报表查询-故障报表
    path: '/monitor/report/malfunction',
    component: () => import('../components/Common/Building/Building'),
  }, { //实时监控-报表查询-损失电量
    path: '/monitor/report/powerLost',
    component: () => import('../components/Common/Building/Building'),
  }, { // 隐藏页： 修改密码
    path: '/hidden/user/editPassword',
    component: () => import('../containers/Others/EditPassword'),
  }, { // 系统管理-电站管理-电站;
    path: '/system/station/stationManage',
    component: () => import('../containers/System/Station/StationManage/StationManage'),
  }, { // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    component: () => import('../containers/System/Station/DeviceManage/DeviceManage'),
  }, { // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    component: () => import('../containers/System/Station/PointManage/PointManage'),
  }, { // 系统管理-电站管理-告警事件
    path: '/system/station/alarmManage',
    component: () => import('../containers/System/Station/AlarmManage/AlarmManage'),
  }, { // 系统管理-电站管理-功率曲线
    path: '/system/station/powerCurve',
    component: () => import('../containers/System/Station/PowerCurve/PowerCurve'),
  }, { // 系统管理-计划配置
    path: '/system/config/plan',
    component: () => import('../containers/System/Production/Plan/Plan'),
  }, { // 系统管理-预警配置
    path: '/system/config/warning',
    component: () => import('../containers/System/Production/Warning/Warning'),
  }, { // 系统管理-预警配置
    path: '/system/config/performanceScore',
    component: () => import('../containers/System/Production/Score/Score')
  }, { // 统计分析-电站分析-全部电站-单电站
    path: '/statistical/stationaccount/allstation/:stationCode',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis'),
  }, { // 统计分析-电站分析-全部电站
    path: '/statistical/stationaccount/allstation',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis'),
  }, { // 统计分析-电站分析-电站评分
    path: '/statistical/stationaccount/score',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/ScoreAnalysis'),
  }, { // 统计分析-电站分析-生产分析
    path: '/statistical/stationaccount/production',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis'),
  }, { // 统计分析-电站分析-运行分析
    path: '/statistical/stationaccount/operate',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis'),
  }, { // 统计分析-电站分析-资源分析
    path: '/statistical/stationaccount/resource',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis'),
  }, { // 统计分析-电站分析-电站对比
    path: '/statistical/stationaccount/contrast',
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast'),
  }, { //  统计分析-设备分析-性能分析
    path: '/statistical/equipment/performance',
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis'),
  }, { // 统计分析-设备分析-设备对比
    path: '/statistical/equipment/manufacturers',
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Manufacturers/Manufacturers'),
  }, { // 统计分析-设备分析-自定义对比
    path: '/statistical/equipment/customize',
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Customize/Customize'),
  }, { // 统计报表
    path: '/statistical/statement/currency',
    component: () => import('../containers/StatisticalAnalysis/StatisticalReport/GeneralReport/GeneralReport'),
  }, { // 高级分析 实时告警
    path: '/analysis/intelligentWarning/realtime',
    component: () => import('../containers/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarning'),
  }, { // 高级分析 - 已转工单
    path: '/analysis/intelligentWarning/transfer',
    component: () => import('../containers/HighAnalysis/IntelligentWarning/Transfer/TransferForm'),
  }, { // 高级分析 - 手动解除
    path: '/analysis/intelligentWarning/handleremove',
    component: () => import('../containers/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemove'),
  }, { // 高级分析 - 历史告警
    path: '/analysis/intelligentWarning/historywarning',
    component: () => import('../containers/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarning'),
  }, { // 高级分析>清洗模型>清洗预警
    path: '/analysis/cleanout/warning',
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanWarning/CleanWarning'),
  }, { // 单电站清洗计划与记录详情
    path: '/analysis/cleanout/record/:stationCode',
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord'),
  }, { // 高级分析>清洗模型>清洗计划与记录
    path: '/analysis/cleanout/record',
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord'),
  }, { // 组串异常分析
    path: '/analysis/formation/abnormal',
    component: () => import('../components/Common/Building/Building'),
  }, { // 高级分析-低效组串预警-待处理预警
    path: '/analysis/earlyWarning/unhandle',
    component: () => import('../containers/HighAnalysis/EarlyWarning/Unhandle/Unhandle'),
  }, { // 高级分析-低效组串预警-已忽略
    path: '/analysis/earlyWarning/ignore',
    component: () => import('../containers/HighAnalysis/EarlyWarning/Ignore/Ignore'),
  }, { // 高级分析-低效组串预警-已转工单
    path: '/analysis/earlyWarning/transfer',
    component: () => import('../containers/HighAnalysis/EarlyWarning/Transfer/Transfer'),
  }, { // 高级分析-低效组串预警-历史预警
    path: '/analysis/earlyWarning/history',
    component: () => import('../containers/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarn'),
  }, { // 偏航对风分析
    path: '/analysis/yaw/wind',
    component: () => import('../components/Common/Building/Building'),
  }, { // 预警事件配置
    path: '/analysis/yaw/config',
    component: () => import('../components/Common/Building/Building'),
  },
];


const Loading = ({ pastDelay, timedOut, error }) => {
  if (pastDelay) {
    return (<div className={styles.preComponent}>
    <i className={`${styles.rotate}`}></i>
     <p>loading....</p>
  </div>);
  } else if (timedOut) {
    return <div>Taking a long time...</div>;
  } else if (error) {
    return <div className={styles.preComponent}>Error! 请重新刷新页面</div>;
  }
  return null;
};

const RouteWithSubRoutes = ({ component, routes, path, exact = true}) => {
  const Component = Loadable({
    loader: component,
    loading: Loading,
    timeout: 10000
  });
  return (
    <Route
      path={path}
      exact={exact}
      render={props => (
        <Component {...props} routes={routes} />
      )}
    />
  )
};
export const routerConfig = routers.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);






