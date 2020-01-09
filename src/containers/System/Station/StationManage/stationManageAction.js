

export const stationManageAction = {
  STATION_MANAGE_FETCH: Symbol('STATION_MANAGE_FETCH'), // loading

  GET_STATION_MANAGE_LIST: Symbol('GET_STATION_MANAGE_LIST'), // 获取电站列表
  GET_STATION_MANAGE_DETAIL: Symbol('GET_STATION_MANAGE_DETAIL'), // 获取电站详情
  EDIT_STATION_MANAGE_DETAIL: Symbol('EDIT_STATION_MANAGE_DETAIL'), // 编辑电站详情
  DELET_STATION_MANAGE: Symbol('DELET_STATION_MANAGE'), // 删除电站(及以下设备))所有信息
  SET_STATION_MANAGE_DEPARTMENT: Symbol('SET_STATION_MANAGE_DEPARTMENT'), // 为指定电站分配部门
  GET_OTHER_PAGE_STATION_MANAGE_DETAIL: Symbol('GET_OTHER_PAGE_STATION_MANAGE_DETAIL'), // 详情翻页请求下一页/前一页详情

  GET_STATION_MANAGE_FETCH_SUCCESS: Symbol('GET_STATION_MANAGE_FETCH_SUCCESS'), // 电站管理普通api请求成功
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  changeStationManageStore: Symbol('changeStationManageStore'), // 发起重置数据请求
  getDiagconfigYx: Symbol('getDiagconfigYx'), // 电站遥信数据
  setDiagconfigYx: Symbol('setDiagconfigYx'), // 更改电站遥信数据
  getDiagconfigYc: Symbol('getDiagconfigYc'), // 电站遥测或者数据质量配置
  setDiagconfigYc: Symbol('setDiagconfigYc'), // 更改遥测或者数据质量配置
}





