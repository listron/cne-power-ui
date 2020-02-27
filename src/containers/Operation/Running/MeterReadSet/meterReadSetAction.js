export const meterReadSetAction = {
  changeMeterReadSetStore: Symbol('changeMeterReadSetStore'), // store变化
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  getMeterList: Symbol('getMeterList'), // 获取抄表设置列表
  getUpDateMeterList: Symbol('getMeterList'), // 列表修改
  getDeleteMeterList: Symbol('getDeleteMeterList'), // 列表删除
  getChangeMeterList: Symbol('getChangeMeterList'), // 换表
  getBaseDevice: Symbol('getBaseDevice'), // 获取电站指定类型的设备简单信息列表
  getPriceDetail: Symbol('getPriceDetail'), // 查看电价详情
  getAddMeterList: Symbol('getAddMeterList'), // 新增列表行
  getMeterPrice: Symbol('getMeterPrice'), // 编辑电价
};
