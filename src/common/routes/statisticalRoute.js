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
  }, { // 统计报表-智能报表
    path: '/statistical/statement/intelligentReport',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StatisticalReport/IntelligentReport/IntelligentReport')),
  }, { // 统计报表-日报查询
    path: '/statistical/statement/dailyQuery',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StatisticalReport/DailyQuery/DailyQuery')),
  }, { // 统计报表-分析报告
    path: '/statistical/statement/analysisReport',
    component: lazy(() => import('../../containers/StatisticalAnalysis/StatisticalReport/AnalysisReport/AnalysisReport')),
  },
];
const analysisTool = [
  {
    path: '/statistical/analysisTool/scatter',
    component: lazy(() => import('../../containers/StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/DataAnalysisScatter.jsx')),
  },
  {
    path: '/statistical/analysisTool/sequence',
    component: lazy(() => import('../../containers/StatisticalAnalysis/DataAnalysisTool/DataAnalysisSequence/DataAnalysisSequence.jsx')
    ),
  },
  {
    path: '/statistical/analysisTool/resources',
    component: lazy(() => import('../../containers/StatisticalAnalysis/DataAnalysisTool/WindResources/WindResources.jsx')
    ),
  },
  // {
  //   path: '/statistical/analysisTool/sequence',
  //   component: lazy(() => import('../../containers/StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/DataAnalysisScatter.jsx')
  //   ),
  // }
];

export const statisticalRoute = [
  ...stationAccount,
  ...equipment,
  ...statement,
  ...analysisTool,
];
