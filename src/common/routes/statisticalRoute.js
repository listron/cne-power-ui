import { lazy } from 'react';

const stationAccount = [
  { // 统计分析-电站分析-全部电站-单电站
    path: '/statistical/stationaccount/allstation/:stationCode',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis')),
  }, { // 统计分析-电站分析-全部电站
    path: '/statistical/stationaccount/allstation',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationAnalysis')),
  }, { // 统计分析-电站分析-电站评分
    path: '/statistical/stationaccount/score',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/ScoreAnalysis')),
  }, { // 统计分析-电站分析-生产分析
    path: '/statistical/stationaccount/production',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis')),
  }, { // 统计分析-电站分析-运行分析
    path: '/statistical/stationaccount/operate',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis')),
  }, { // 统计分析-电站分析-资源分析
    path: '/statistical/stationaccount/resource',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis')),
  }, { // 统计分析-电站分析-电站对比
    path: '/statistical/stationaccount/contrast',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast')),
  },
];

const equipment = [
  { //  统计分析-设备分析-性能分析
    path: '/statistical/equipment/performance',
    component: lazy(() => import('../../containers/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysis')),
  }, { // 统计分析-设备分析-设备对比
    path: '/statistical/equipment/manufacturers',
    component: lazy(() => import('../../containers/StatisticalAnalysis/EquipmentAnalysis/Manufacturers/Manufacturers')),
  }, { // 统计分析-设备分析-自定义对比
    path: '/statistical/equipment/customize',
    component: lazy(() => import('../../containers/StatisticalAnalysis/EquipmentAnalysis/Customize/Customize')),
  },
];

const statement = [ // 统计分析 - 统计报表
  { // 统计报表
    path: '/statistical/statement/currency',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StatisticalReport/GeneralReport/GeneralReport')),
  }, { // 统计报表-智能分析报告
    path: '/statistical/statement/intelligentAnalysis',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/IntelligentAnalysis')),
  },
]

export const statisticalRoute = [
  ...stationAccount,
  ...equipment,
  ...statement
];