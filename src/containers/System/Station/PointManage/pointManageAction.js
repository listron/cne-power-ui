

export const pointManageAction = {
  POINT_MANAGE_FETCH: Symbol('POINT_MANAGE_FETCH'), // loading
  CHANGE_POINT_MANAGE_STORE_SAGA: Symbol('CHANGE_POINT_MANAGE_STORE_SAGA'), //改变reducer参数
  CHANGE_POINT_MANAGE_STORE: Symbol('CHANGE_POINT_MANAGE_STORE'), // 替换reducer参数

  GET_POINT_MANAGE_FETCH_SUCCESS: Symbol('GET_POINT_MANAGE_FETCH_SUCCESS'), // 测点管理普通api请求成功

  GET_POINT_MANAGE_LIST: Symbol('GET_POINT_MANAGE_LIST'), // 获取测点列表
  GET_POINT_MANAGE_ALL_STATION: Symbol('GET_POINT_MANAGE_ALL_STATION'), // 获取所有电站信息=>验证测点是否可以清除。
  DELETE_POINT_MANAGE_LIST: Symbol('DELETE_POINT_MANAGE_LIST'), // 清空电站测点
  getfactorsDeviceMode: Symbol('getfactorsDeviceMode'), // 获取厂家

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};





