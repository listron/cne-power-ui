export const intelligentAnalysisAction = {
  changeIntelligentAnalysisStore:Symbol('changeIntelligentAnalysisStore'),
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getSingleStationAnalysis: Symbol('getSingleStationAnalysis'), // 获取单电站报告信息
  getAreaStation: Symbol('getAreaStation'), // 获取同区域电站报告信息
}