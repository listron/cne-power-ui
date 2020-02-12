export const meterReadSetAction = {
  changeMeterReadSetStore: Symbol('changeMeterReadSetStore'), // store变化
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  getMeterList: Symbol('getMeterList'), // 获取抄表设置列表
};
