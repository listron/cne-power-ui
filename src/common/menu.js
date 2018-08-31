import { isUrl } from '../utils';

/*
  文件说明： 菜单配置项
  页面显示展示的菜单集中管理，点击后页面跳转至对应路径。设计菜单最多包含三级。
  参数说明： 
  1. name：该级菜单对应名称，
  2. path: 该菜单对应部分路径，一级路径不得重复！！
  3. children: 该菜单下子菜单数组
  4. clickable: 该菜单点击效果==>后期考虑配置，clickable为true时不管是几级菜单均可跳转路径展示。
  5. iconStyle: 菜单附加的icon图标
  6. defaultPath: 每个一级菜单下，必须有且仅有一个true，代表该一级目录(模块)下默认立刻展示的页面
*/

const menuData = [
  {
    name: '主页',
    path: '/',
    defaultPath: true,
  },
  {
    name: '实时监控',
    path: 'monitor',
    children: [
      {
        name: '电站监控',
        iconStyle: 'icon-monitoring',
        path: 'station',
        defaultPath: true,
      }, {
        name: '告警',
        iconStyle: 'icon-alarm1',
        path: 'alarm',
        children: [
          {
            name: '实时告警',
            path: 'realtime',
          }, {
            name: '历史告警',
            path: 'history',
          }, {
            name: '告警统计',
            path: 'statistic',
          }
        ],
      }
    ],
  }, {
    name: '运维管理',
    path: 'operation',
    children: [
      {
        name: '工单',
        iconStyle: 'icon-gd2',
        path: 'ticket',
        children: [
          {
            name: '工单列表',
            path: 'list',
            defaultPath: true,
          }
        ]
      },{
        name:'两票管理',
        path:'tickets',
        iconStyle: 'icon-usermanage',
        children: [
          {
            name: '第一种工作票',
            path: 'typeone',
          }, {
            name: '第二种工作票',
            path: 'typetwo',
          }
        ]
      },{ 
        name:'台账',
        path:'ledger',
        iconStyle: 'icon-usermanage'

      },{
        name:'经验库',
        path:'experience',
        iconStyle: 'icon-usermanage'

      }
    ],
  },
 {
    name: '统计分析',
    path: 'statistical',
    children: [
      {
        name: '电站分析',
        iconStyle: 'icon-usermanage',
        path: 'stationaccount',
        children: [
          {
            name: '全部电站',
            path: 'allstation',
            defaultPath: true,
          }, {
            name: '生产分析',
            path: 'production',
          }, {
            name: '运行分析',
            path: 'operate',
          }, {
            name: '资源分析',
            path: 'resource',
          }, {
            name: '电站对比',
            path: 'contrast'
          }
        ]
      },{
        name:'设备分析',
        path: 'equipment',
        iconStyle: 'icon-usermanage',
        children: [
          {
            name: '设备性能分析',
            path: 'performance',          
          }, {
            name: '设备厂家对比',
            path: 'manufacturers',
          }
        ]

      },{
        name:'统计报表',
        path: 'statement',
        iconStyle: 'icon-usermanage',
        children: [
          {
            name: '日报月报',
            path: 'daily',          
          }, {
            name: '定制报表',
            path: 'customization',
          }
        ]

      }
    ]

  }, {
    name: '高级分析',
    path: 'analysis',
    children: [
      {
        name:'光伏发电量评估',
        path:'assess',
        defaultPath: true,
        iconStyle: 'icon-usermanage',
      },
      {
        name: '清洗模型',
        iconStyle: 'icon-usermanage',
        path: 'cleanout',
        children: [
          {
            name: '灰尘影响',
            path: 'dirt',
            defaultPath: true,
          }, {
            name: '清洗记录',
            path: 'record',
          }, {
            name: '预警时事件配置',
            path: 'configuration',
          }
        ]

      },{
        name:'组串异常检测',
        path:'formation',
        iconStyle: 'icon-usermanage',
        children: [
          {
            name: '组串异常分析',
            path: 'abnormal',          
          }, {
            name: '预警事件配置',
            path: 'warning',
          }
        ]
      },{
        name:'偏航对风分析',
        path:'yaw',
        iconStyle: 'icon-usermanage',
        children: [
          {
            name: '偏航对风分析',
            path: 'wind',
            defaultPath: true,
          }, {
            name: '预测事件配置',
            path: 'config',
          }
        ]
      }

    ]
  },  {
    name: '系统管理',
    path: 'system',
    children: [
      {
        name: '账户管理',
        iconStyle: 'icon-usermanage',
        path: 'account',
        children: [
          {
            name: '企业',
            path: 'enterprise',
            defaultPath: true,
          }, {
            name: '部门',
            path: 'department',
          }, {
            name: '用户',
            path: 'user',
          }, {
            name: '角色',
            path: 'role',
          }
        ]
      },
    ],
  },
]

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

