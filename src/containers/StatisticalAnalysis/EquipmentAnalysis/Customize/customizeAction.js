export const customizeAction = {
    customizeFetch: Symbol('manufacturersFetch'), 
    getCustomizeFetchSuccess: Symbol('getCustomizeFetchSuccess'),
    changeCustomizeStoreSaga: Symbol('changeCustomizeStoreSaga'), // 改变reducer参数
    changeCustomizeStore: Symbol('changeCustomizeStore'), // 替换reducer参数
  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  }
  