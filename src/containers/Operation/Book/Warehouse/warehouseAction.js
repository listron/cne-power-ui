export const warehouseAction = {
  warehouseFetchSuccess: Symbol('warehouseFetchSuccess'), // loading
  changeWarehouseStore: Symbol('changeWarehouseStore'), // 替换reducer参数

  getWarehouseList: Symbol('getWarehouseList'), // 仓库列表分页查询 || 模糊搜索
  getWarehouseAddList: Symbol('getWarehouseAddList'), // 仓库添加
  getWarehouseDelList: Symbol('getWarehouseDelList'), // 仓库删除
  getWarehouseUpdateList: Symbol('getWarehouseUpdateList'), // 仓库更新
  getGoodsList: Symbol('getGoodsList'), // 物品（物资）清单分页列表

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};





