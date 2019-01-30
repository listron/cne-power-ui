export const customizeAction = {
    customizeFetch: Symbol('manufacturersFetch'), 
    changeCustomizeStoreSaga: Symbol('changeCustomizeStoreSaga'), // 改变reducer参数
    changeCustomizeStore: Symbol('changeCustomizeStore'), // 替换reducer参数
    getManufacturer: Symbol('getManufacturer'), // 获取电站下的生产厂家
    getDevicemode: Symbol('getDevicemode'), // 获取电站下的生产厂家下的设备型号
    getDetailData: Symbol('getDetailData'), // 获取电站对比的数据
    
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  }
  