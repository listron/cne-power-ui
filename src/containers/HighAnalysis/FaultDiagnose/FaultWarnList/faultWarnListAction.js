export const faultWarnListAction = {
  changeWarnListStore: Symbol('changeWarnListStore'), // 替换reducer参数
  fetchWarnListSuccess: Symbol('fetchWarnListSuccess'), // 请求成功

  getAlgoModel: Symbol('getAlgoModel'), // 获取单风场故障预警汇总-按模型
  getList: Symbol('getList'), // 获取单风场故障预警汇总-按列表
  getFanList: Symbol('getFanList'), // 获取单风场故障预警汇总-按风机

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
