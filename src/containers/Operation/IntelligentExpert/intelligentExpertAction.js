export const intelligentExpertAction = {
  changeIntelligentExpertStore: Symbol('changeIntelligentExpertStore'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据

  getDefectType: Symbol('getDefectType'), // 获取缺陷类型
  getIntelligentTable: Symbol('getIntelligentTable'), // 获取列表数据
  getImportIntelligent: Symbol('getImportIntelligent'), // 导入文件
  deleteIntelligent: Symbol('getImportIntelligent'), // 删除
  getUserName: Symbol('getUserName'), // 获取录入人
  addIntelligent: Symbol('addIntelligent'), // 添加列表数据
  getKnowledgebase: Symbol('getKnowledgebase'), // 查看详情
  getLike: Symbol('getLike'), // 点赞
  editIntelligent: Symbol('editIntelligent'), // 编辑
  getDevicemodes: Symbol('getDevicemodes'), // 获取设备列表
  getFaultCodeList: Symbol('getFaultCodeList'), // 获取设备列表
  uploadFile: Symbol('uploadFile'), // 上传文件
  deleteFile: Symbol('deleteFile'), // 删除附件
  // downloadFile: Symbol('downloadFile'), // 删除附件
};
