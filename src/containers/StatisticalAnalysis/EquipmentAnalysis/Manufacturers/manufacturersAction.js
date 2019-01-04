export const manufacturersAction = {
    manufacturersFetch: Symbol('manufacturersFetch'), 
    getManufacturersFetchSuccess: Symbol('getManufacturersFetchSuccess'),
    changeManufacturersStoreSaga: Symbol('changeManufacturersStoreSaga'), // 改变reducer参数
    changeManufacturersStore: Symbol('changeManufacturersStore'), // 替换reducer参数
  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  }
  