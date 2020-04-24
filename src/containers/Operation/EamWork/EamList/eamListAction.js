export const eamListAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),

  getEamStationList: Symbol('getEamStationList'), // 获取EAM列表数据
  getEamList: Symbol('getEamList'), // 获取电站列表
};
