

export const workOrderAction = {
  workOrderFetch: Symbol('workOrderFetch'), // loading
  getworkOrderFetchSuccess: Symbol('getworkOrderFetchSuccess'),
  changeWorkOrderStoreSaga: Symbol('changeWorkOrderStoreSaga'), // 改变reducer参数
  changeWorkOrderStore: Symbol('changeWorkOrderStore'), // 替换reducer参数

  getDefectDetail: Symbol('getDefectDetail'), // 获取缺陷详情
  getDefectIdList: Symbol('getDefectIdList'),// 获取缺陷ID
  getDefectCommonList: Symbol('getDefectCommonList'),// 获取公共列表
  getDefectTypes: Symbol('getDefectTypes'),// 获取缺陷类型

  sendDefect: Symbol('sendDefect'),// 下发
  rejectDefect: Symbol('rejectDefect'),// 驳回
  closeDefect: Symbol('closeDefect'),// 关闭
  handleDefect: Symbol('handleDefect'),// 执行
  checkDefect: Symbol('checkDefect'),// 验收

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  getKnowledgebase: Symbol('getKnowledgebase'), // 专家库列表
  likeKnowledgebase: Symbol('likeKnowledgebase'), // 点赞专家库
}





