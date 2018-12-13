

export const ignoreAction = {
  ignoreFetch: Symbol('ignoreFetch'), // loading
  getIgnoreFetchSuccess: Symbol('getIgnoreFetchSuccess'),
  changeIgnoreStoreSaga: Symbol('changeIgnoreStoreSaga'), // 改变reducer参数
  changeIgnoreStore: Symbol('changeIgnoreStore'), // 替换reducer参数
  getIgnoreList: Symbol('getIgnoreList'), // 获取ignore列表
  getMatrixlist: Symbol('getMatrixlist'), // 获取方阵列表
  getUnignore: Symbol('getUnignore'), // 提交取消忽略
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





