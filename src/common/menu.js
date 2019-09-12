import { isUrl } from '../utils';

/*
  文件说明： 菜单配置项
  页面显示展示的菜单集中管理，点击后页面跳转至对应路径。设计菜单最多包含三级。
  参数说明：
  1. name：该级菜单对应名称，
  2. path: 对应url路径；
      要求：一级路径，必须不得重复！！且不得包含任何特殊字符只能以小驼峰单词命名！！=>菜单解析规则，未遵守必出bug！！
  3. children: 该菜单下子菜单数组
  4. clickable: 该菜单点击效果==>后期考虑配置，clickable为true时不管是几级菜单均可跳转路径展示。
  5. iconStyle: 菜单附加的icon图标
  6. defaultPath: 每个一级菜单下，必须有且仅有一个true，代表该一级目录(模块)下默认立刻展示的页面
  7. rightKey: 权限控制关键字
*/

const menuData = [
  {
    name: '主页',
    path: 'homepage',
    defaultPath: true,
    rightKey: 'homepage',
  },
  {
    name: '实时监控',
    path: 'monitor',
    rightKey: 'monitor',
    children: [
      {
        name: '电站监控',
        iconStyle: 'icon-monitoring',
        path: 'station',
        defaultPath: true,
        rightKey: 'monitor_station',
      }, {
        name: '功率曲线',
        iconStyle: 'icon-monitoring',
        path: 'powercurve',
        rightKey: 'monitor_powerCurve',
      }, {
        name: '数据分析',
        iconStyle: 'icon-da',
        path: 'data',
        rightKey: 'monitor_dataAnalysis',
        children: [
          {
            name: '散点图',
            path: 'scatterDiagram',
            rightKey: 'dataAnalysis_scatterPlot',
          }, {
            name: '历史趋势',
            path: 'history',
            rightKey: 'dataAnalysis_historyTrend',
          }, {
            name: '实时数据',
            path: 'realtime',
            rightKey: 'dataAnalysis_realTime',
          }, {
            name: '数据导出',
            path: 'dataExport',
            rightKey: 'dataAnalysis_dataExport',
          },
        ],
      }, {
        name: '报表查询',
        iconStyle: 'icon-trends',
        path: 'report',
        rightKey: 'monitor_reportQuery',
        children: [
          {
            name: '电量报表',
            path: 'powerReport',
            rightKey: 'reportQuery_powerReport',
          }, {
            name: '设备状态',
            path: 'deviceStatus',
            rightKey: 'reportQuery_deviceStatus',
          }, {
            name: '故障报表',
            path: 'malfunction',
            rightKey: 'reportQuery_malfunction',
          }, {
            name: '损失电量',
            path: 'powerLost',
            rightKey: 'reportQuery_powerLost',
          },
        ],
      }, {
        name: '告警',
        iconStyle: 'icon-alarm1',
        path: 'alarm',
        rightKey: 'monitor_alarm',
        children: [
          {
            name: '实时告警',
            path: 'realtime',
            rightKey: 'monitor_alarm_realTime',
          }, {
            name: '已转工单',
            path: 'transfer',
            rightKey: 'monitor_alarm_realTime',
          }, {
            name: '手动解除',
            path: 'relieve',
            rightKey: 'monitor_alarm_realTime',
          }, {
            name: '历史告警',
            path: 'history',
            rightKey: 'monitor_alarm_history',
          }, {
            name: '告警统计',
            path: 'statistic',
            rightKey: 'monitor_alarm_statistics',
          },
          // {
          //   name: '告警统计',
          //   path: 'statistics',
          //   rightKey: 'monitor_alarm_statistics',
          // }
        ],
      },
    ],
  }, {
    name: '运维管理',
    path: 'operation',
    rightKey: 'operation',
    children: [
      {
        name: '员工定位',
        path: 'gps',
        iconStyle: 'icon-mapman',
        rightKey: 'operation_locate',
        defaultPath: true,
      }, {
        name: '工单',
        iconStyle: 'icon-gd2',
        path: 'ticket',
        rightKey: 'operation_worklist',
        children: [
          {
            name: '工单列表',
            path: 'list',
            defaultPath: true,
            rightKey: 'operation_worklist_work',
          }, {
            name: '工单统计',
            path: 'statistics',
            rightKey: 'operation_worklist_statistics',
          },
        ],
      }, {
        name: '两票管理',
        path: 'twoTickets',
        iconStyle: 'icon-gd1',
        rightKey: 'operation_twoTicket',
        children: [
          {
            name: '审核人设置',
            path: 'examiner',
            rightKey: 'operation_twoTicket_config',
          }, {
            name: '工作票',
            path: 'workflow',
            rightKey: 'operation_twoTicket_work',
          }, {
            name: '操作票',
            path: 'operateflow',
            rightKey: 'operation_twoTicket_operation',
          },
        ],
      }, {
        name: '台账',
        path: 'book',
        iconStyle: 'icon-gd3',
        rightKey: 'operation_book',
        children: [
          {
            name: '资产配置',
            path: 'assetsConfig',
            defaultPath: true,
            rightKey: 'operation_book_assetConfig',
          }, {
            name: '设备管理',
            path: 'deviceManage',
            rightKey: 'operation_book_deviceManage',
          }, {
            name: '设备台账',
            path: 'deviceAccount',
            rightKey: 'operation_book_deviceBook',
          }, {
            name: '仓库配置',
            path: 'warehouse',
            rightKey: 'operation_book_warehouseConfig',
          }, {
            name: '仓库管理',
            path: 'warehouseManage',
            rightKey: 'operation_book_warehouseManage',
          }, {
            name: '出入库记录',
            path: 'stockRecords',
            rightKey: 'operation_book_warehouseRecord',
          },
        ],
      }, {
        name: '电站运行',
        path: 'running',
        iconStyle: 'icon-running',
        rightKey: 'operation_running',
        children: [
          {
            name: '日报',
            path: 'dayReport',
            rightKey: 'operation_running_daily',
          }, {
            name: '月报',
            path: 'monthReport',
            rightKey: 'operation_running_monthly',
          },
        ],
      }, {
        name: '智能专家库',
        path: 'intelligentExpert',
        iconStyle: 'icon-gd4',
        rightKey: 'operation_experience',
      },
    ],
  },
  {
    name: '统计分析',
    path: 'statistical',
    rightKey: 'statistics',
    children: [
      {
        name: '电站分析',
        iconStyle: 'icon-station-data',
        path: 'stationaccount',
        rightKey: 'statistics_station',
        children: [
          {
            name: '全部电站',
            path: 'allstation',
            defaultPath: true,
            rightKey: 'statistics_station_all',
          }, {
            name: '电站评分',
            path: 'score',
            rightKey: 'statistics_station_score',
          }, {
            name: '生产分析',
            path: 'production',
            rightKey: 'statistics_station_production',
          }, {
            name: '运行分析',
            path: 'operate',
            rightKey: 'statistics_station_operation',
          }, {
            name: '资源分析',
            path: 'resource',
            rightKey: 'statistics_station_resource',
          }, {
            name: '电站对比',
            path: 'contrast',
            rightKey: 'statistics_station_comparation',
          },
        ],
      }, {
        name: '设备分析',
        path: 'equipment',
        iconStyle: 'icon-device-data',
        rightKey: 'statistics_device',
        children: [
          {
            name: '性能分析',
            path: 'performance',
            rightKey: 'statistics_device_performance',
          }, {
            name: '设备对比',
            path: 'manufacturers',
            rightKey: 'statistics_device',
          }, {
            name: '自定义对比',
            path: 'customize',
            rightKey: 'statistics_device',
          },
        ],

      }, {
        name: '统计报表',
        path: 'statement',
        iconStyle: 'icon-count',
        rightKey: 'statistics_report',
        children: [
          {
            name: '通用报表',
            path: 'currency',
            defaultPath: true,
            rightKey: 'statistics_report_general',
          },
          {
            name: '智能分析报告',
            path: 'intelligentAnalysis',
            rightKey: 'statistics_report_report',
          },
          {
            name: '智能报表',
            path: 'intelligentReport',
            rightKey: 'statistics_report_table',
          },
          {
            name: '日报查询',
            path: 'dailyQuery',
            rightKey: 'statistics_report_dailyQuery',
          },
        ],
      }, {
        name: '数据分析工具',
        path: 'analysisTool',
        iconStyle: 'icon-device-data',
        rightKey: 'analysis_dataTool',
        children: [
          {
            name: '散点图',
            path: 'scatter',
            rightKey: 'analysis_dataTool_scatter',
          },
          {
            name: '时序图',
            path: 'sequence',
            rightKey: 'analysis_dataTool_sequence',
          },
          // {
          //   name: '统计图',
          //   path: 'histogram',
          //   rightKey: 'analysis_dataTool_histogram',
          // },
        ],
      },
    ],
  },
  {
    name: '高级分析',
    path: 'analysis',
    rightKey: 'analysis',
    children: [
      // {
      //   name: '光伏发电量评估',
      //   path: 'assess',
      //   defaultPath: true,
      //   iconStyle: 'icon-usermanage',
      //   rightKey: 'analysis_powerGeneration',
      // },
      {
        name: '智能预警',
        iconStyle: 'icon-usermanage',
        path: 'intelligentWarning',
        rightKey: 'analysis_intelligentWarning',
        children: [
          {
            name: '实时预警',
            path: 'realtime',
            defaultPath: true,
            rightKey: 'analysis_intelligentWarning_pending',
          }, {
            name: '已转工单',
            path: 'transfer',
            rightKey: 'analysis_intelligentWarning_worklist',
          }, {
            name: '手动解除',
            path: 'handleremove',
            rightKey: 'analysis_intelligentWarning_remove',
          }, {
            name: '历史预警',
            path: 'historywarning',
            rightKey: 'analysis_intelligentWarning_history',
          },
        ],
      },
      {
        name: '清洗模型',
        iconStyle: 'icon-cleaning-model',
        path: 'cleanout',
        rightKey: 'analysis_cleanModel',
        children: [
          {
            name: '清洗预警',
            path: 'warning',
            // defaultPath: true,
            rightKey: 'monitor',
            defaultPath: true,
            // rightKey: 'analysis_cleanModel',
          }, {
            name: '清洗计划与记录',
            path: 'record',
            rightKey: 'analysis_cleanModel',
          },
        ],
      },
      {
        name: '低效组串预警',
        path: 'earlyWarning',
        iconStyle: 'icon-pvlogo',
        rightKey: 'analysis_inefficientDetect',
        children: [
          {
            name: '待处理预警',
            path: 'unhandle',
            rightKey: 'analysis_inefficientDetect',
          }, {
            name: '已忽略',
            path: 'ignore',
            rightKey: 'analysis_inefficientDetect',
          }, {
            name: '已转工单',
            path: 'transfer',
            rightKey: 'analysis_inefficientDetect',
          }, {
            name: '历史预警',
            path: 'history',
            rightKey: 'analysis_inefficientDetect',
          },
        ],
      },
      {
        name: '偏航对风分析',
        path: 'yaw',
        iconStyle: 'icon-usermanage',
        rightKey: 'analysis_yaw',
        children: [
          {
            name: '偏航对风分析',
            path: 'wind',
            defaultPath: true,
            rightKey: 'analysis_yaw',
          }, {
            name: '预测事件配置',
            path: 'config',
            rightKey: 'analysis_yaw',
          },
        ],
      },
      {
        name: '风机预警',
        iconStyle: 'icon-windlogo',
        path: 'faultDiagnose',
        rightKey: 'analysis_turbineFDD',
        children: [
          {
            name: '故障预警',
            path: 'faultWarn',
            defaultPath: true,
            rightKey: 'analysis_turbineFDD_recent',
          }, {
            name: '历史预警',
            path: 'historyWarn',
            rightKey: 'analysis_turbineFDD_history',
          }, {
            name: '算法控制台',
            path: 'algorithmControl',
            rightKey: 'analysis_turbineFDD_console',
          },
        ],
      }, {
        name: '风电分析',
        path: 'achievement',
        rightKey: 'analysis_windPower',
        iconStyle: 'icon-windany',
        children: [
          {
            name: '集团绩效分析',
            path: 'analysis/group',
            rightKey: 'analysis_windPower_groupPerformance',
          }, {
            name: '区域绩效分析',
            path: 'analysis/area',
            rightKey: 'analysis_windPower_regionPerformance',
          }, {
            name: '电站效能分析',
            path: 'analysis/station',
            rightKey: 'analysis_windPower_stationPerformance',
          }, {
            name: '运行数据分析',
            path: 'analysis/run',
            rightKey: 'analysis_windPower_operationalData',
          }, {
            name: '停机状态分析',
            path: 'analysis/stop',
            rightKey: 'analysis_windPower_stopStatus',
          }, {
            name: '执行机构分析',
            path: 'analysis/actuator',
            rightKey: 'analysis_windPower_stopStatus',
          },
        ],
      },
    ],
  }, {
    name: '系统管理',
    path: 'system',
    rightKey: 'system',
    children: [
      {
        name: '账户管理',
        iconStyle: 'icon-usermanage',
        path: 'account',
        rightKey: 'system_account',
        children: [
          {
            name: '企业',
            path: 'enterprise',
            defaultPath: true,
            rightKey: 'system_account_enterprise',
          }, {
            name: '部门',
            path: 'department',
            rightKey: 'system_account_department',
          }, {
            name: '用户',
            path: 'user',
            rightKey: 'system_account_user',
          }, {
            name: '角色',
            path: 'role',
            rightKey: 'system_account_role',
          },
        ],
      }, {
        name: '电站管理',
        iconStyle: 'icon-elecmanage',
        path: 'station',
        rightKey: 'system_station',
        children: [
          {
            name: '电站',
            path: 'stationManage',
            rightKey: 'system_station_stat',
          }, {
            name: '设备',
            path: 'deviceManage',
            rightKey: 'system_station_device',
          }, {
            name: '测点',
            path: 'pointManage',
            rightKey: 'system_station_point',
          }, {
            name: '告警事件',
            path: 'alarmManage',
            rightKey: 'system_station_alert',
          },
          {
            name: '功率曲线',
            path: 'powerCurve',
            rightKey: 'system_station_powercurve',
          },
          {
            name: '气象站配置',
            path: 'weatherStation',
            rightKey: 'system_weatherConfig',
          },
        ],
      }, {
        name: '计划配置',
        iconStyle: 'icon-planed',
        path: 'config',
        rightKey: 'system_config',
        children: [
          {
            name: '绩效评分',
            path: 'performanceScore',
            rightKey: 'system_config_score',
          }, {
            name: '生产计划',
            path: 'plan',
            rightKey: 'system_config',
          }, {
            name: '预警配置',
            path: 'warning',
            rightKey: 'system_config_warning',
          },
        ],
      },
    ],
  },
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path) && path !== '/') {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const menu = formatter(menuData);


// const rigthMenu = ['homepage', 'monitor_station', 'monitor_alarm_realTime', 'operation_worklist', 'operation_worklist_work'];
// const rightHandler = {
//   monitor_alarm_realTime: ['alarm_remove','alarm_worklist','monitor_alarm_remove','monitor_alarm_history'],
//   operation_worklist_work: ['workExamine_defect_review', 'workExamine_defect_check', 'workExamine_inspection_check'],
// }
