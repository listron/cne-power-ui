export const algorithmControlAction = {
  changeAlgorithmControlStore: Symbol('changeAlgorithmControlStore'), // 替换reducer参数
  fetchAlgorithmControlSuccess: Symbol('fetchAlgorithmControlSuccess'), // 请求成功

  getAlgoList: Symbol('getAlgoList'), // 获取预警任务列表-算法模型视图
  getAlgoOptionList: Symbol('getAlgoOptionList'), // 获取算法列表
  getAddWarnTask: Symbol('getAddWarnTask'), // 新增预警任务
  getListView: Symbol('getListView'), // 获取预警任务列表-算法列表视图

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};
