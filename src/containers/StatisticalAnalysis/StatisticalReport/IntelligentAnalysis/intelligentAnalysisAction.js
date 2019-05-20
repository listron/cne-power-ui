export const intelligentAnalysisAction = {
  changeIntelligentAnalysisStore:Symbol('changeIntelligentAnalysisStore'),
  GET_INTELLIGENTANALYSIS_SUCCESS: Symbol('GET_INTELLIGENTANALYSIS_SUCCESS'), // 获取api数据成功
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getSingleStationAnalysis: Symbol('getSingleStationAnalysis'), // 获取单电站报告信息
  getAreaStation: Symbol('getAreaStation'), // 获取同区域电站报告信息
  getArea: Symbol('getArea'), // 获取区域对比分析报告信息
}