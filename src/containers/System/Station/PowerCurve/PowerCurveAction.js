


export const powerCurveAction = {
  powerCurveFetch: Symbol('powerCurveFetch'), // loading
  changePowerCurve:Symbol('changePowerCurve'),
  changePowerCurveStoreSaga:Symbol('changePowerCurveSaga'),// 改变reducer参数
  changePowerCurveStore:Symbol('changePowerCurveStore'),// 替换reducer参数
  powerCurveFetchSuccess:Symbol('powerCurveFetchSuccess'),
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  powerCurveAction: Symbol('powerCurveAction'), //功率曲线列表
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





