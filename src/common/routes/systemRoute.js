import { lazy } from 'react';

const account = [
  { // 系统管理-账户管理-企业
    path: '/system/account/enterprise',
    component: lazy(() => import('../../containers/System/Account/Enterprise/Enterprise')),
  }, { // 系统管理-账户管理-部门
    path: '/system/account/department',
    component: lazy(() => import('../../containers/System/Account/Department/Department')),
  }, { // 系统管理-账户管理-用户
    path: '/system/account/user',
    component: lazy(() => import('../../containers/System/Account/User/User')),
  }, { // 系统管理-账户管理-角色
    path: '/system/account/role',
    component: lazy(() => import('../../containers/System/Account/Role/Role')),
  }
];

const station = [
  { // 系统管理-电站管理-电站;
    path: '/system/station/stationManage',
    component: lazy(() => import('../../containers/System/Station/StationManage/StationManage')),
  }, { // 系统管理-电站管理-设备
    path: '/system/station/deviceManage',
    component: lazy(() => import('../../containers/System/Station/DeviceManage/DeviceManage')),
  }, { // 系统管理-电站管理-测点
    path: '/system/station/pointManage',
    component: lazy(() => import('../../containers/System/Station/PointManage/PointManage')),
  }, { // 系统管理-电站管理-告警事件
    path: '/system/station/alarmManage',
    component: lazy(() => import('../../containers/System/Station/AlarmManage/AlarmManage')),
  }, { // 系统管理-电站管理-功率曲线
    path: '/system/station/powerCurve',
    component: lazy(() => import('../../containers/System/Station/PowerCurve/PowerCurve')),
  }, { // 系统管理-电站管理-气象站配置
    path: '/system/station/weatherStation',
    component: lazy(() => import('../../containers/System/Station/WeatherStationConf/WeatherStationConf')),
  }
];

const config = [
  { // 系统管理-计划配置
    path: '/system/config/plan',
    component: lazy(() => import('../../containers/System/Production/Plan/Plan')),
  }, { // 系统管理-预警配置
    path: '/system/config/warning',
    component: lazy(() => import('../../containers/System/Production/Warning/Warning')),
  }, { // 系统管理-预警配置
    path: '/system/config/performanceScore',
    component: lazy(() => import('../../containers/System/Production/Score/Score')),
  }
];

export const systemRoute = [
  ...account,
  ...station,
  ...config,
];

