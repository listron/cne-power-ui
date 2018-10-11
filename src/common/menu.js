import {isUrl} from '../utils';

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
    path: '/',
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
          }
        ],
      }
    ],
  }, {
    name: '运维管理',
    path: 'operation',
    rightKey: 'operation',
    children: [
      {
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
          }
        ]
      }, {
        name: '两票管理',
        path: 'twoTickets',
        iconStyle: 'icon-usermanage',
        rightKey: 'operation_twoTicket',
        children: [
          {
            name: '第一种工作票',
            path: 'typeone',
            rightKey: 'monitor',
          }, {
            name: '第二种工作票',
            path: 'typetwo',
            rightKey: 'monitor',
          }
        ]
      }, {
        name: '台账',
        path: 'book',
        iconStyle: 'icon-usermanage',
        rightKey: 'operation_book',
        children: [
          {
            name: '备品备件',
            path: 'sparePart',
            rightKey: 'operation_book_sparePart',
          }, {
            name: '工器具',
            path: 'instrument',
            rightKey: 'operation_book_instrument',
          }
        ]
      }, {
        name: '电站运行',
        path: 'running',
        iconStyle: 'icon-usermanage',
        rightKey: 'operation_running',
        children: [
          {
            name: '日报',
            path: 'dayReport',
            rightKey: 'operation_running',
          }
        ]
      }, {
        name: '经验库',
        path: 'experience',
        iconStyle: 'icon-usermanage',
        rightKey: 'operation_experience',
      }
    ],
  },
  {
    name: '统计分析',
    path: 'statistical',
    rightKey: 'statistics',
    children: [
      {
        name: '电站分析',
        iconStyle: 'icon-usermanage',
        path: 'stationaccount',
        rightKey: 'statistics_station',
        children: [
          {
            name: '全部电站',
            path: 'allstation',
            defaultPath: true,
            rightKey: 'monitor',
          }, {
            name: '生产分析',
            path: 'production',
            rightKey: 'monitor',
          }, {
            name: '运行分析',
            path: 'operate',
            rightKey: 'monitor',
          }, {
            name: '资源分析',
            path: 'resource',
            rightKey: 'monitor',
          }, {
            name: '电站对比',
            path: 'contrast',
            rightKey: 'monitor',
          }
        ]
      }, {
        name: '设备分析',
        path: 'equipment',
        iconStyle: 'icon-usermanage',
        rightKey: 'statistics_device',
        children: [
          {
            name: '设备性能分析',
            path: 'performance',
            rightKey: 'monitor',
          }, {
            name: '设备厂家对比',
            path: 'manufacturers',
            rightKey: 'monitor',
          }
        ]

      }, {
        name: '统计报表',
        path: 'statement',
        iconStyle: 'icon-usermanage',
        rightKey: 'statistics_report',
        children: [
          {
            name: '日报月报',
            path: 'daily',
            rightKey: 'monitor',
          }, {
            name: '定制报表',
            path: 'customization',
            rightKey: 'monitor',
          }
        ]
      }
    ]
  }, {
    name: '高级分析',
    path: 'analysis',
    rightKey: 'analysis',
    children: [
      {
        name: '光伏发电量评估',
        path: 'assess',
        defaultPath: true,
        iconStyle: 'icon-usermanage',
        rightKey: 'analysis_powerGeneration',
      },
      {
        name: '清洗模型',
        iconStyle: 'icon-usermanage',
        path: 'cleanout',
        rightKey: 'analysis_cleanModel',
        children: [
          {
            name: '灰尘影响',
            path: 'dirt',
            defaultPath: true,
            rightKey: 'monitor',
          }, {
            name: '清洗记录',
            path: 'record',
            rightKey: 'monitor',
          }, {
            name: '预警时事件配置',
            path: 'configuration',
            rightKey: 'monitor',
          }
        ]
      }, {
        name: '组串异常检测',
        path: 'formation',
        iconStyle: 'icon-usermanage',
        rightKey: 'analysis_inefficientDetect',
        children: [
          {
            name: '组串异常分析',
            path: 'abnormal',
            rightKey: 'monitor',
          }, {
            name: '预警事件配置',
            path: 'warning',
            rightKey: 'monitor',
          }
        ]
      }, {
        name: '偏航对风分析',
        path: 'yaw',
        iconStyle: 'icon-usermanage',
        rightKey: 'analysis_yaw',
        children: [
          {
            name: '偏航对风分析',
            path: 'wind',
            defaultPath: true,
            rightKey: 'monitor',
          }, {
            name: '预测事件配置',
            path: 'config',
            rightKey: 'monitor',
          }
        ]
      }

    ]
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
          }
        ]
      },
      {
        name: '电站管理',
        iconStyle: 'icon-elecmanage',
        path: 'station',
        rightKey: 'system_station',
        children: [
          {
            name: '电站',
            path: 'stationManage',
            rightKey: 'system_station',
          }, {
            name: '设备',
            path: 'deviceManage',
            rightKey: 'system_station',
          }, {
            name: '测点',
            path: 'pointManage',
            rightKey: 'system_station',
          }, {
            name: '告警事件',
            path: 'alarmManage',
            rightKey: 'system_station',
          }
        ]
      }, {
        name: '计划配置',
        iconStyle: 'icon-elecmanage',
        path: 'config',
        rightKey: 'system_config',
        children: [{
          name: '生产计划',
          path: 'plan',
          rightKey: 'system_config',
        }]
      }
    ],
  }
]

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let {path} = item;
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
