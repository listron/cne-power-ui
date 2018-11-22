


export const powerCurveAction = {
  powerCurveFetch: Symbol('powerCurveFetch'), // loading
  changePowerCurve:Symbol('changePowerCurve'),
  changePowerCurveStoreSaga:Symbol('changePowerCurveSaga'),// 改变reducer参数
  changePowerCurveStore:Symbol('changePowerCurveStore'),// 替换reducer参数
  powerCurveFetchSuccess:Symbol('powerCurveFetchSuccess'),
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getPowerList: Symbol('getPowerList'), //功率曲线列表
  downloadCurveExcel: Symbol('downloadCurveExcel'), //导出功率曲线列表
  getPowercurveDetail: Symbol('getPowercurveDetail'), //功率曲线示意图
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





