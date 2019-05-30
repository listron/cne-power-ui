export const stockRecordsAction = {
  stockRecordsStore: Symbol('stockRecordsStore'), // 改变reducer参数
  GET_STOCKRECORDS_SUCCESS: Symbol('GET_STOCKRECORDS_SUCCESS'), // api请求成功
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getWarehouseName: Symbol('getWarehouseName'), // 仓库名称下拉列表
  getInRecordList: Symbol('getInRecordList'), // 入库记录分页查询列表
  getOutRecordList: Symbol('getOutRecordList'), // 出库库记录分页查询列表
}