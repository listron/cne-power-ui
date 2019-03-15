export const scatterDiagramAction = {
  GET_SCATTERDIAGRAM_SUCCESS: Symbol('GET_SCATTERDIAGRAM_SUCCESS'), // 获取api数据成功
  CHANGE_SCATTERDIAGRAM_STORE: Symbol('CHANGE_SCATTERDIAGRAM_STORE'), // 获取散点图数据
  RESET_SCATTERDIAGRAM:Symbol('RESET_SCATTERDIAGRAM'), // 数据重置
  getSecendInterval:Symbol('getSecendInterval'),// 获取是否有秒级数据。
  getPointInfo:Symbol('getPointInfo'), // 获取测点数据
  getChartScatterDiagram:Symbol('getChartScatterDiagram'), // 获取chart数据
  getListScatterDiagram:Symbol('getListScatterDiagram'), // 获取list数据
}