

export const unhandleAction = {
  unhadleFetch: Symbol('unhadleFetch'), // loading
  getUnhandleFetchSuccess: Symbol('getUnhandleFetchSuccess'),
  changeUnhandleStoreSage: Symbol('changeUnhandleStoreSage'), // 改变reducer参数
  changeUnhandleStore: Symbol('changeUnhandleStore'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





