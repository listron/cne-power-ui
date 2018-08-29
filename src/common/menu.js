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
  // {
  //   name: '首页',
  //   path: '/',
  //   defaultPath: true,
  // },
  {
    name: '实时监控',
    path: 'monitor',
    children: [
      {
        name: '电站监控',
        iconStyle: 'home',
        path: 'station',
        defaultPath: true,
      },{
        name: '告警',
        iconStyle: 'exclamation-circle',
        path: 'alarm',
        children: [
          {
            name: '实时告警',
            path: 'realtime',
          },{
            name: '历史告警',
            path: 'history',
          },{
            name: '告警统计',
            path: 'statistic',
          }
        ],
      }
    ],
  },{
    name: '运维管理',
    path: 'operation',
    children: [
      {
        name: '工单',
        iconStyle: 'calendar',
        path: 'ticket',
        defaultPath: true,
      },{
        name: '缺陷管理',
        iconStyle: 'paper-clip',
        path: 'faultManage',
        children: [
          {
            name: '新建缺陷',
            path: 'create',
          },{
            name: '待办缺陷',
            path: 'faultTodo',
          },{
            name: '缺陷历史',
            path: 'faultHistory',
          }
        ],
      }
    ],
  },
  {
    name: '系统管理',
    path: 'system',
    children: [
      {
        name: '账户管理',
        iconStyle: 'home',
        path: 'account',
        children: [
          {
            name: '企业',
            iconStyle: 'home',
            path: 'enterprise',
            defaultPath: true,
          },{
            name: '部门',
            iconStyle: 'usergroup-add',
            path: 'department',
          },{
            name: '用户',
            iconStyle: 'user-add',
            path: 'user',
          },{
            name: '角色',
            iconStyle: 'skin',
            path: 'role',
          }
        ]
      },    
    ],
  },
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path) && path !== '/' ) {
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

