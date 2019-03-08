import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

/*
  注： path变量中，以/hidden开头的路径，将不展示在菜单中；
*/

const routers = [
  { // 主页
    path: '/homepage',
    exact: true,
    component: () => import('../containers/Home/Homepage'),
  }, { // 运维管理-工单-员工定位
    path: '/operation/gps',
    exact: true,
    //component: Building,
    component: () => import('../containers/Operation/PersonnelGps/PersonnelGps'),
  }, { // 运维管理-工单-工单列表
    path: '/operation/ticket/list',
    exact: true,
    component: () => import('../containers/Operation/Ticket/Ticket'),
  }, { // 运维管理-工单-工单统计
    path: '/operation/ticket/statistics',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 两票管理>第一种工作票
    path: '/operation/twoTickets/typeone',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 第二种工作票
    path: '/operation/twoTickets/typetwo',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 备品备件
    path: '/operation/book/sparePart',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 工器具
    path: '/operation/book/instrument',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 运维管理-电站运行-日报
    path: '/operation/running/dayReport',
    exact: true,
    component: () => import('../containers/Operation/Running/DayReport/DayReport'),
  }, { // 运维管理-电站运行-月报
    path: '/operation/running/monthReport',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 运维管理-经验库
    path: '/operation/experience',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 系统管理-账户管理-企业
    path: '/system/account/enterprise',
    exact: true,
    component: () => import('../containers/System/Account/Enterprise/Enterprise'),
  }, { // 系统管理-账户管理-部门
    path: '/system/account/department',
    exact: true,
    component: () => import('../containers/System/Account/Department/Department'),
  }, { // 系统管理-账户管理-用户
    path: '/system/account/user',
    exact: true,
    component: () => import('../containers/System/Account/User/User'),
  }, { // 系统管理-账户管理-角色
    path: '/system/account/role',
    exact: true,
    component: () => import('../containers/System/Account/Role/Role'),
  }, { // 实时监控-告警-已转工单
    path: '/monitor/alarm/realtime',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/RealTimeWarning/RealTimeWarning'),
  }, { // 实时监控-告警-已转工单
    path: '/monitor/alarm/transfer',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/Transfer/TransferForm'),
  }, { // 实时监控-告警-手动解除
    path: '/monitor/alarm/relieve',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/HandleRemove/HandleRemove'),
  }, { // 实时监控-告警-历史告警
    path: '/monitor/alarm/history',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/HistoryWarning/HistoryWarning'),
  }, { // 实时监控-告警-告警统计
    path: '/monitor/alarm/statistic',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/AlarmStatistic'),
  }, { // 告警统计单电站
    path: '/monitor/alarm/statistic/:stationCode',
    exact: true,
    component: () => import('../containers/Monitor/Alarm/AlarmStatistic'),
  }, { // 实时监控-电站监控-全部电站
    path: '/monitor/station',
    exact: true,
    component: () => import('../containers/Monitor/StationMonitor/AllStation/AllStation'),
  }, { // 菜单栏中不展示的--单设备实时监控
    path: '/hidden/monitorDevice/:stationCode/:deviceTypeCode/:deviceCode',
    exact: true,
    component: () => import('../containers/Monitor/StationMonitor/DeviceMonitor/DeviceMonitor'),
  }, { // 实时监控-电站监控-单电站
    path: '/monitor/singleStation/:stationCode',
    exact: true,
    component: () => import('../containers/Monitor/StationMonitor/SingleStation/SingleStation'),
  },{//实时监控-功率曲线-多设备
    path:'/monitor/powercurve',
    exact:true,
    component:() => import('../containers/Monitor/PowerCurve/AllDeviceCurve//AllDeviceCurve')
  },{//实时监控-功率曲线-单设备
    path:'/monitor/powercurve/:stationCode/:deviceFullCode/:time',
    // path:'/hidden/monitor/powercurve/:stationCode/:deviceCode/:time',
    exact:true,
    component:() => import('../containers/Monitor/PowerCurve/SingleDeviceCurve/SingleDeviceCurve')
  }, { //实时监控-数据分析-历史趋势
    path: '/monitor/data/history',
    exact: true,
    component: () => import('../containers/Monitor/DataAnalysis/DataHistory/DataHistory'),
  }, { //实时监控-数据分析-实时数据
    path: '/monitor/data/realtime',
    exact: true,
    component: () => import('../containers/Monitor/DataAnalysis/DataRealtime/DataRealtime'),
  }, { // 隐藏页： 修改密码
    path: '/hidden/user/editPassword',
    exact: true,
    component: () => import('../containers/Others/EditPassword'),
  }, { // 系统管理-电站管理-电站;
    path: '/system/station/stationManage',
    exact: true,
    component: () => import('../containers/System/Station/StationManage/StationManage'),
  }, { // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    exact: true,
    component: () => import('../containers/System/Station/DeviceManage/DeviceManage'),
  }, { // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    exact: true,
    component: () => import('../containers/System/Station/PointManage/PointManage'),
  }, { // 系统管理-电站管理-告警事件
    path: '/system/station/alarmManage',
    exact: true,
    component: () => import('../containers/System/Station/AlarmManage/AlarmManage'),
  }, { // 系统管理-电站管理-功率曲线
    path: '/system/station/powerCurve',
    exact: true,
    component: () => import('../containers/System/Station/PowerCurve/PowerCurve'),
  }, { // 系统管理-计划配置
    path: '/system/config/plan',
    exact: true,
    component: () => import('../containers/System/Production/Plan/Plan'),
  }, { // 系统管理-预警配置
    path: '/system/config/warning',
    exact: true,
    component: () => import('../containers/System/Production/Warning/Warning'),
  }, { // 统计分析-电站分析-全部电站
    path: '/statistical/stationaccount/allstation',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis'),
  }, { // 统计分析-电站分析-全部电站-单电站
    path: '/statistical/stationaccount/allstation/:stationCode',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis'),
  }, { // 统计分析-电站分析-电站评分
    path: '/statistical/stationaccount/score',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/ScoreAnalysis'),
  }, { // 统计分析-电站分析-生产分析
    path: '/statistical/stationaccount/production',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis'),
  }, { // 统计分析-电站分析-运行分析
    path: '/statistical/stationaccount/operate',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis'),
  }, { // 统计分析-电站分析-资源分析
    path: '/statistical/stationaccount/resource',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis'),
  }, { // 统计分析-电站分析-电站对比
    path: '/statistical/stationaccount/contrast',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast'),
  }, { //  统计分析-设备分析-性能分析
    path: '/statistical/equipment/performance',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis'),
    // component: Building,
  }, { // 统计分析-设备分析-设备对比
    path: '/statistical/equipment/manufacturers',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Manufacturers/Manufacturers'),
  }, { // 统计分析-设备分析-自定义对比
    path: '/statistical/equipment/customize',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/EquipmentAnalysis/Customize/Customize'),
  }, { // 统计报表
    path: '/statistical/statement/currency',
    exact: true,
    component: () => import('../containers/StatisticalAnalysis/StatisticalReport/GeneralReport/GeneralReport'),
  }, { // 高级分析 实时告警
    path: '/analysis/intelligentWarning/realtime',
    exact: true,
    component: () => import('../containers/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarning'),
  }, { // 高级分析 - 已转工单
    path: '/analysis/intelligentWarning/transfer',
    exact: true,
    component: () => import('../containers/HighAnalysis/IntelligentWarning/Transfer/TransferForm'),
  }, { // 高级分析 - 手动解除
    path: '/analysis/intelligentWarning/handleremove',
    exact: true,
    component: () => import('../containers/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemove'),
  }, { // 高级分析 - 历史告警
    path: '/analysis/intelligentWarning/historywarning',
    exact: true,
    component: () => import('../containers/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarning'),
  }, { // 高级分析>清洗模型>清洗预警
    path: '/analysis/cleanout/warning',
    exact: true,
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanWarning/CleanWarning'),
  }, { // 高级分析>清洗模型>清洗计划与记录
    path: '/analysis/cleanout/record',
    exact: true,
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord'),
  }, { // 单电站清洗计划与记录详情
    path: '/analysis/cleanout/record/:stationCode',
    exact: true,
    component: () => import('../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord'),
  }, { // 组串异常分析
    path: '/analysis/formation/abnormal',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 高级分析-低效组串预警-待处理预警
    path: '/analysis/earlyWarning/unhandle',
    exact: true,
    component: () => import('../containers/HighAnalysis/EarlyWarning/Unhandle/Unhandle'),
  }, { // 高级分析-低效组串预警-已忽略
    path: '/analysis/earlyWarning/ignore',
    exact: true,
    component: () => import('../containers/HighAnalysis/EarlyWarning/Ignore/Ignore'),
  }, { // 高级分析-低效组串预警-已转工单
    path: '/analysis/earlyWarning/transfer',
    exact: true,
    component: () => import('../containers/HighAnalysis/EarlyWarning/Transfer/Transfer'),
  }, { // 高级分析-低效组串预警-历史预警
    path: '/analysis/earlyWarning/history',
    exact: true,
    component: () => import('../containers/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarn'),
  }, { // 偏航对风分析
    path: '/analysis/yaw/wind',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  }, { // 预警事件配置
    path: '/analysis/yaw/config',
    exact: true,
    component: () => import('../components/Common/Building/Building'),
  },
];

const RouteWithSubRoutes = route => {
  const Component = Loadable({
    loader: route.component,
    loading: ({ isloading, error }) => {
      return <div></div>
    }
  });
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => (
        <Component {...props} routes={route.routes} />
      )}
    />
  )
};
export const routerConfig = routers.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);






