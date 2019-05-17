export const intelligentExpertAction = {
  GET_INTELLIGENTEXPERT_SUCCESS: Symbol('GET_INTELLIGENTEXPERT_SUCCESS'), // api请求成功
  getIntelligentExpertStore: Symbol('getIntelligentExpertStore'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据

  getDefectType: Symbol('getDefectType'), // 获取缺陷类型
  getIntelligentTable: Symbol('getIntelligentTable'), // 获取列表数据
  getImportIntelligent: Symbol('getImportIntelligent'), // 导入文件
  deleteIntelligent: Symbol('getImportIntelligent'), // 删除
  getUserName: Symbol('getUserName'), // 获取录入人
  addIntelligent: Symbol('addIntelligent'), // 添加列表数据
}