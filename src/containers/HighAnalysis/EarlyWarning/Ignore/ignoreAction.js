

export const ignoreAction = {
  ignoreFetch: Symbol('ignoreFetch'), // loading
  getIgnoreFetchSuccess: Symbol('getIgnoreFetchSuccess'),
  changeIgnoreStoreSaga: Symbol('changeIgnoreStoreSaga'), // 改变reducer参数
  changeIgnoreStore: Symbol('changeIgnoreStore'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





