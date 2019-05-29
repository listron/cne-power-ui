import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
// import Loadable from 'react-loadable';
import styles from './loading.scss'
import { Spin } from 'antd';

/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/

const routers = [
  { // 主页
    path: '/homepage',
    component: lazy(() => import('../containers/Home/Homepage')),
  }, { // 运维管理-工单-员工定位
    path: '/operation/gps',
    //component: Building,
    component: lazy(() => import('../containers/Operation/PersonnelGps/PersonnelGps')),
  }, { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    component: lazy(() => import('../containers/Operation/Ticket/Ticket')),
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 两票管理>第一种工作票
    path: '/operation/twoTickets/typeone',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 第二种工作票
    path: '/operation/twoTickets/typetwo',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 资产配置
    path: '/operation/book/assetsConfig',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component: lazy(() => import('../containers/Operation/Book/AssetsConfig/AssetsConfig')),
  }, { // 设备管理
    path: '/operation/book/deviceManage',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component: lazy(() => import('../containers/Operation/Book/DeviceManage/DeviceManage')),
  }, { // 设备台账
    path: '/operation/book/deviceAccount',
    component: lazy(() => import('../containers/Operation/Book/DeviceAccount/DeviceAccount')),
    // component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 仓库配置
    path: '/operation/book/warehouse',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component: lazy(() => import('../containers/Operation/Book/Warehouse/Warehouse')),
  }, { // 仓库管理
    path: '/operation/book/warehouseManage',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 出入库记录
    path: '/operation/book/immigrationRecords',
    component: lazy(() => import('../components/Common/Building/Building')),
  },
  { // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    component: lazy(() => import('../containers/Operation/Running/DayReport/DayReport')),
  }, { // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 运维管理-智能专家库
    path: '/operation/intelligentExpert',
    component: lazy(() => import('../containers/Operation/IntelligentExpert/IntelligentExpert')),
  }, { // 系统管理-账户管理-企业
    path: '/system/account/enterprise',
    component: lazy(() => import('../containers/System/Account/Enterprise/Enterprise')),
  }, { // 系统管理-账户管理-部门
    path: '/system/account/department',
    component: lazy(() => import('../containers/System/Account/Department/Department')),
  }, { // 系统管理-账户管理-用户
    path: '/system/account/user',
    component: lazy(() => import('../containers/System/Account/User/User')),
  }, { // 系统管理-账户管理-角色
    path: '/system/account/role',
    component: lazy(() => import('../containers/System/Account/Role/Role')),
  }, { // 实时监控-告警-实时告警
    path: '/monitor/alarm/realtime',
    component: lazy(() => import('../containers/Monitor/Alarm/RealTimeWarning/RealTimeWarning')),
  }, { // 实时监控-告警-已转工单
    path: '/monitor/alarm/transfer',
    component: lazy(() => import('../containers/Monitor/Alarm/Transfer/TransferForm')),
  }, { // 实时监控-告警-手动解除
    path: '/monitor/alarm/relieve',
    component: lazy(() => import('../containers/Monitor/Alarm/HandleRemove/HandleRemove')),
  }, { // 实时监控-告警-历史告警
    path: '/monitor/alarm/history',
    component: lazy(() => import('../containers/Monitor/Alarm/HistoryWarning/HistoryWarning')),
  }, { // 实时监控-告警-单电站告警统计
    path: '/monitor/alarm/statistic/:stationCode',
    component: lazy(() => import('../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic')),
  }, { // 实时监控-告警-告警统计
    path: '/monitor/alarm/statistic',
    component: lazy(() => import('../containers/Monitor/Alarm/AlarmStatic/AlarmStatistic')),
  },
  // { // 实时监控-告警-告警统计
  //   path: '/monitor/alarm/statistics',
  //   component: () => import('../containers/Monitor/Alarm/AlarmCount/AlarmCount'),
  // },
  { // 实时监控-电站监控-全部电站
    path: '/monitor/station',
    component: lazy(() => import('../containers/Monitor/StationMonitor/AllStation/AllStation')),
  }, { // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    component: lazy(() => import('../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor')),
  }, { // 实时监控-电站监控-单电站
    path: '/monitor/singleStation/:stationCode',
    component: lazy(() => import('../containers/Monitor/StationMonitor/SingleStation/SingleStation')),
  },{//实时监控-功率曲线-多设备
    path:'/monitor/powercurve',
    exact:true,
    component:lazy(() => import('../containers/Monitor/PowerCurve/AllDeviceCurve/AllDeviceCurve')),
  },{//实时监控-功率曲线-单设备
    path:'/monitor/powercurve/:stationCode/:deviceFullCode/:time',
    // path:'/hidden/monitor/powercurve/:stationCode/:deviceCode/:time',
    exact:true,
    component: lazy(() => import('../containers/Monitor/PowerCurve/SingleDeviceCurve/SingleDeviceCurve')),
  }, { //实时监控-数据分析-历史趋势
    path: '/monitor/data/history',
    component: lazy(() => import('../containers/Monitor/DataAnalysis/DataHistory/DataHistory')),
  }, { //实时监控-数据分析-散点图
    path: '/monitor/data/scatterDiagram',
    component: lazy(() => import('../containers/Monitor/DataAnalysis/DataScatterDiagram/DataScatterDiagram')),
  }, { //实时监控-数据分析-实时数据
    path: '/monitor/data/realtime',
    component: lazy(() => import('../containers/Monitor/DataAnalysis/DataRealtime/DataRealtime')),
  },
  { //实时监控-报表查询-电量报表
    path: '/monitor/report/powerReport',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component:  lazy(() => import('../containers/Monitor/Report/PowerReport/PowerReport')),
  }, { //实时监控-报表查询-设备状态
    path: '/monitor/report/deviceStatus',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component: lazy(() => import('../containers/Monitor/Report/DeviceStatus/DeviceStatus')),
  }, { //实时监控-报表查询-故障报表
    path: '/monitor/report/malfunction',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component: lazy(() => import('../containers/Monitor/Report/Malfunction/Malfunction')),
  }, { //实时监控-报表查询-损失电量
    path: '/monitor/report/powerLost',
    // component: lazy(() => import('../components/Common/Building/Building')),
    component:lazy(() => import('../containers/Monitor/Report/PowerLost/PowerLost')),
  },
  // { // 隐藏页： 修改密码
  //   path: '/hidden/user/editPassword',
  //   component: () => import('../containers/Others/EditPassword'),
  // },
  { // 隐藏页： 修改账户
    path: '/hidden/user/accountSettings',
    component: lazy(() => import('../containers/Others/AccountSettings')),
  },
  { // 系统管理-电站管理-电站;
    path: '/system/station/stationManage',
    component: lazy(() => import('../containers/System/Station/StationManage/StationManage')),
  }, { // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    component: lazy(() => import('../containers/System/Station/DeviceManage/DeviceManage')),
  }, { // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    component: lazy(() => import('../containers/System/Station/PointManage/PointManage')),
  }, { // 系统管理-电站管理-告警事件
    path: '/system/station/alarmManage',
    component: lazy(() => import('../containers/System/Station/AlarmManage/AlarmManage')),
  }, { // 系统管理-电站管理-功率曲线
    path: '/system/station/powerCurve',
    component: lazy(() => import('../containers/System/Station/PowerCurve/PowerCurve')),
  }, { // 系统管理-计划配置
    path: '/system/config/plan',
    component: lazy(() => import('../containers/System/Production/Plan/Plan')),
  }, { // 系统管理-预警配置
    path: '/system/config/warning',
    component: lazy(() => import('../containers/System/Production/Warning/Warning')),
  }, { // 系统管理-预警配置
    path: '/system/config/performanceScore',
    component: lazy(() => import('../containers/System/Production/Score/Score')),
  }, { // 统计分析-电站分析-全部电站-单电站
    path: '/statistical/stationaccount/allstation/:stationCode',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis')),
  }, { // 统计分析-电站分析-全部电站
    path: '/statistical/stationaccount/allstation',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis')),
  }, { // 统计分析-电站分析-电站评分
    path: '/statistical/stationaccount/score',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/ScoreAnalysis')),
  }, { // 统计分析-电站分析-生产分析
    path: '/statistical/stationaccount/production',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis')),
  }, { // 统计分析-电站分析-运行分析
    path: '/statistical/stationaccount/operate',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis')),
  }, { // 统计分析-电站分析-资源分析
    path: '/statistical/stationaccount/resource',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis')),
  }, { // 统计分析-电站分析-电站对比
    path: '/statistical/stationaccount/contrast',
    component: lazy(() => import('../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast')),
  }, { //  统计分析-设备分析-性能分析
    path: '/statistical/equipment/performance',
    component: lazy(() => import('../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis')),
  }, { // 统计分析-设备分析-设备对比
    path: '/statistical/equipment/manufacturers',
    component: lazy(() => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Manufacturers/Manufacturers')),
  }, { // 统计分析-设备分析-自定义对比
    path: '/statistical/equipment/customize',
    component: lazy(() => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Customize/Customize')),
  }, { // 统计报表
    path: '/statistical/statement/currency',
    component: lazy(() => import('../containers/StatisticalAnalysis/StatisticalReport/GeneralReport/GeneralReport')),
  }, { // 统计报表-智能分析报告
    path: '/statistical/statement/intelligentAnalysis',
    component: lazy(() => import('../containers/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/IntelligentAnalysis')),
  }, { // 高级分析 实时告警
    path: '/analysis/intelligentWarning/realtime',
    component: lazy(() => import('../containers/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarning')),
  }, { // 高级分析 - 已转工单
    path: '/analysis/intelligentWarning/transfer',
    component: lazy(() => import('../containers/HighAnalysis/IntelligentWarning/Transfer/TransferForm')),
  }, { // 高级分析 - 手动解除
    path: '/analysis/intelligentWarning/handleremove',
    component: lazy(() => import('../containers/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemove')),
  }, { // 高级分析 - 历史告警
    path: '/analysis/intelligentWarning/historywarning',
    component: lazy(() => import('../containers/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarning')),
  }, { // 高级分析>清洗模型>清洗预警
    path: '/analysis/cleanout/warning',
    component: lazy(() => import('../containers/HighAnalysis/CleanoutModel/CleanWarning/CleanWarning')),
  }, { // 单电站清洗计划与记录详情
    path: '/analysis/cleanout/record/:stationCode',
    component: lazy(() => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord')),
  }, { // 高级分析>清洗模型>清洗计划与记录
    path: '/analysis/cleanout/record',
    component: lazy(() => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord')),
  }, { // 组串异常分析
    path: '/analysis/formation/abnormal',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 高级分析-低效组串预警-待处理预警
    path: '/analysis/earlyWarning/unhandle',
    component: lazy(() => import('../containers/HighAnalysis/EarlyWarning/Unhandle/Unhandle')),
  }, { // 高级分析-低效组串预警-已忽略
    path: '/analysis/earlyWarning/ignore',
    component: lazy(() => import('../containers/HighAnalysis/EarlyWarning/Ignore/Ignore')),
  }, { // 高级分析-低效组串预警-已转工单
    path: '/analysis/earlyWarning/transfer',
    component: lazy(() => import('../containers/HighAnalysis/EarlyWarning/Transfer/Transfer')),
  }, { // 高级分析-低效组串预警-历史预警
    path: '/analysis/earlyWarning/history',
    component: lazy(() => import('../containers/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarn')),
  }, { // 高级分析-风机故障检测与诊断-故障预警
    path: '/analysis/faultDiagnose/faultWarn',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/FaultWarn/FaultWarn')),
  },{ // 高级分析-风机故障检测与诊断-故障预警-单风场故障预警
    path: '/analysis/faultDiagnose/fanWarn/:fanWarnId',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/FaultWarnList/FaultWarnList')),
  },{ // 高级分析-风机故障检测与诊断-故障预警-单风机详情图表展示
    path: '/hidden/analysis/single/fan',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan')),
  },{ // 高级分析-风机故障检测与诊断-故障预警-按模型单风机详情图表展示
    path: '/hidden/analysis/single/fan/:code',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan')),
  },{ // 高级分析-风机故障检测与诊断-故障预警-按模型单风机详情图表展示
    path: '/hidden/analysis/all/fan/:stationCode',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/FaultAllFan/FaultAllFan')),
  },{ // 高级分析-风机故障检测与诊断-算法控制台
    path: '/analysis/faultDiagnose/algorithmControl',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/AlgorithmControl/AlgorithmControl')),
  },{ // 高级分析-风机故障检测与诊断-历史预警
    path: '/analysis/faultDiagnose/historyWarn',
    component: lazy(() => import('../containers/HighAnalysis/FaultDiagnose/HistoryWarn/HistoryWarn')),
  },{ // 偏航对风分析
    path: '/analysis/yaw/wind',
    component: lazy(() => import('../components/Common/Building/Building')),
  }, { // 预警事件配置
    path: '/analysis/yaw/config',
    component: lazy(() => import('../components/Common/Building/Building')),
  },
];

// const Loading = ({ pastDelay, timedOut, error }) => {
//   if (pastDelay) {
//     return (<div className={styles.preComponent}>
//      <Spin size="large" tip="Loading..." />
//   </div>);
//   } else if (timedOut) {
//     return <div>Taking a long time...</div>;
//   } else if (error) {
//     return <div className={styles.preComponent}>Error! 请重新刷新页面</div>;
//   }
//   return null;
// };

// const RouteWithSubRoutes = ({ component, routes, path, exact = true}) => {
//   const Component = Loadable({
//     loader: component,
//     loading: Loading,
//     timeout: 10000
//   });
//   return (
//     <Route
//       path={path}
//       exact={exact}
//       render={props => (
//         <Component {...props} routes={routes} />
//       )}
//     />
//   )
// };

export const routerConfig = routers.map((route, i) => (<Route
  key={route.path}
  path={route.path}
  exact={route.exact}
  render={props => (
    <Suspense fallback={
      <div className={styles.preComponent}>
          <Spin size="large" tip="Loading..." />
      </div>}
    >
      <route.component {...props} />
    </Suspense>
  )}
/>));






