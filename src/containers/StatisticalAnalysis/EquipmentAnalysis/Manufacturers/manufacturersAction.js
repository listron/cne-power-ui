export const manufacturersAction = {
    changeManufacturersStoreSaga: Symbol('changeManufacturersStoreSaga'), // 改变reducer参数
    changeManufacturersStore: Symbol('changeManufacturersStore'), // 替换reducer参数
    getManufacturer: Symbol('getManufacturer'), // 获取电站下的所有的生产厂商
    getDevicemode: Symbol('getDevicemode'), // 获取所有的设备型号
    getDevicecontrast: Symbol('getDevicecontrast'), //  根据筛选条件获取所有的设备型号
  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
    RESET_STORE: Symbol('RESET_STORE'), // 重置数据
  }
  