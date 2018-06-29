import { isUrl } from '../utils';

const menuData = [
  {
    name: '首页',
    path: '/',
    clickable: true,
  },{
    name: '电站运维',
    clickable: false,
    path: 'operation',
    children: [
      {
        name: '工单',
        clickable: true,
        path: 'ticket'
      },{
        name: '缺陷管理',
        clickable: false,
        path: 'faultManage',
        children: [
          {
            name: '新建缺陷',
            clickable: true,
            path: 'create',
          },{
            name: '待办缺陷',
            clickable: true,
            path: 'faultTodo',
          },{
            name: '缺陷历史',
            clickable: true,
            path: 'faultHistory',
          }
        ],
      }
    ],
  },
  {
    name: '用户管理',
    clickable: false,
    path: 'userManage',
    children: [
      {
        name: '人员管理',
        clickable: true,
        path: 'user',
      },{
        name: '角色管理',
        clickable: true,
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

export const menu = formatter(menuData);

