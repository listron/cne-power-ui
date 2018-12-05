

export const transferAction = {
  transferFetch: Symbol('transferFetch'), // loading
  getTransferFetchSuccess: Symbol('getTransferFetchSuccess'),
  changeTransferStoreSaga: Symbol('changeTransferStoreSaga'), // 改变reducer参数
  changeTransferStore: Symbol('changeTransferStore'), // 替换reducer参数

  resetStore: Symbol('resetStore'), // 发起重置数据请求
  RESET_STORE: Symbol('RESET_STORE'), // 重置数据
}





