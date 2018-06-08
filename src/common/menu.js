import { isUrl } from '../utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: '/',
  },{
    name: '电站运维',
    icon: 'operation',
    path: 'operation',
    children: [
      {
        name: '工单',
        path: 'worklist',
        children: [
          {
            name: '缺陷',
            path: 'defect',
          },{
            name: '巡检',
            path: 'inspection',
          },
        ],
      },{
        name: '缺陷管理',
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
    icon: 'systemManage',
    path: 'systemManage',
    children: [
      {
        name: '用户管理',
        path: 'user',
      },{
        name: '角色管理',
        path: 'role',
      }
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

export const topMenu = formatter(menuData);

