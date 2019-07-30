import { lazy } from 'react';

const intelligentWarning = [ // 高级分析  智能预警 
  { // 高级分析 实时告警
    path: '/analysis/intelligentWarning/realtime',
    component: lazy(() => import('../../containers/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarning')),
  }, { // 高级分析 - 已转工单
    path: '/analysis/intelligentWarning/transfer',
    component: lazy(() => import('../../containers/HighAnalysis/IntelligentWarning/Transfer/TransferForm')),
  }, { // 高级分析 - 手动解除
    path: '/analysis/intelligentWarning/handleremove',
    component: lazy(() => import('../../containers/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemove')),
  }, { // 高级分析 - 历史告警
    path: '/analysis/intelligentWarning/historywarning',
    component: lazy(() => import('../../containers/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarning')),
  },
];

const cleanoutModel = [
  { // 高级分析>清洗模型>清洗预警
    path: '/analysis/cleanout/warning',
    component: lazy(() => import('../../containers/HighAnalysis/CleanoutModel/CleanWarning/CleanWarning')),
  }, { // 单电站清洗计划与记录详情
    path: '/analysis/cleanout/record/:stationCode',
    component: lazy(() => import('../../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord')),
  }, { // 高级分析>清洗模型>清洗计划与记录
    path: '/analysis/cleanout/record',
    component: lazy(() => import('../../containers/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecord')),
  },
];

const EarlyWarning = [ // 高级分析-低效组串预警 什么鬼名字。 起的跟语义完全不符。
  { // 高级分析-低效组串预警-待处理预警
    path: '/analysis/earlyWarning/unhandle',
    component: lazy(() => import('../../containers/HighAnalysis/EarlyWarning/Unhandle/Unhandle')),
  }, { // 高级分析-低效组串预警-已忽略
    path: '/analysis/earlyWarning/ignore',
    component: lazy(() => import('../../containers/HighAnalysis/EarlyWarning/Ignore/Ignore')),
  }, { // 高级分析-低效组串预警-已转工单
    path: '/analysis/earlyWarning/transfer',
    component: lazy(() => import('../../containers/HighAnalysis/EarlyWarning/Transfer/Transfer')),
  }, { // 高级分析-低效组串预警-历史预警
    path: '/analysis/earlyWarning/history',
    component: lazy(() => import('../../containers/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarn')),
  },
];

const FaultDiagnose = [// 高级分析 - 风机预警 这个名字也是，起的跟目录完全不对等。语义化做的太差。
  { // 高级分析-风机故障检测与诊断-故障预警
    path: '/analysis/faultDiagnose/faultWarn',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/FaultWarn/FaultWarn')),
  }, { // 高级分析-风机故障检测与诊断-故障预警-单风场故障预警
    path: '/analysis/faultDiagnose/fanWarn/:fanWarnId',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/FaultWarnList/FaultWarnList')),
  }, { // 高级分析-风机故障检测与诊断-故障预警-单风机详情图表展示
    path: '/hidden/analysis/single/fan',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan')),
  }, { // 高级分析-风机故障检测与诊断-故障预警-按模型单风机详情图表展示
    path: '/hidden/analysis/single/fan/:code',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan')),
  }, { // 高级分析-风机故障检测与诊断-故障预警-按模型单风机详情图表展示
    path: '/hidden/analysis/all/fan/:stationCode',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/FaultAllFan/FaultAllFan')),
  }, { // 高级分析-风机故障检测与诊断-算法控制台
    path: '/analysis/faultDiagnose/algorithmControl',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/AlgorithmControl/AlgorithmControl')),
  }, { // 高级分析-风机故障检测与诊断-历史预警
    path: '/analysis/faultDiagnose/historyWarn',
    component: lazy(() => import('../../containers/HighAnalysis/FaultDiagnose/HistoryWarn/HistoryWarn')),
  },
];

const yawAnalysis = [ // 偏航对风分析
  { // 组串异常分析
    path: '/analysis/formation/abnormal',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, { // 偏航对风分析
    path: '/analysis/yaw/wind',
    component: lazy(() => import('../../components/Common/Building/Building')),
  }, { // 预警事件配置
    path: '/analysis/yaw/config',
    component: lazy(() => import('../../components/Common/Building/Building')),
  },
];

const achievement = [
  { // 集团绩效
    path: '/statistical/achievement/analysis/:pathKey',
    component: lazy(() => import('../../containers/StatisticalAnalysis/Achievement/AchievementLayout')),
  },
];

export const highAnalysisRoute = [
  ...intelligentWarning,
  ...cleanoutModel,
  ...yawAnalysis,
  ...EarlyWarning,
  ...FaultDiagnose,
  ...achievement,
];
