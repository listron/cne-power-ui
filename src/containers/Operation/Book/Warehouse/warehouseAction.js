export const warehouseAction = {
  warehouseFetchSuccess: Symbol('warehouseFetchSuccess'), // loading
  changeWarehouseStore: Symbol('changeWarehouseStore'), // 替换reducer参数

  getWarehouseList: Symbol('getWarehouseList'), // 仓库列表分页查询 || 模糊搜索
  getWarehouseAddList: Symbol('getWarehouseAddList'), // 仓库添加
  getWarehouseDelList: Symbol('getWarehouseDelList'), // 仓库删除

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
};





