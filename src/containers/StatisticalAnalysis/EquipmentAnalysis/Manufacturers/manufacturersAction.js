export const manufacturersAction = {
    changeManufacturersStore: Symbol('changeManufacturersStore'), // 替换reducer参数
    getManufacturer: Symbol('getManufacturer'), // 获取电站下的所有的生产厂商
    getDevicemode: Symbol('getDevicemode'), // 获取所有的设备型号
    getDevicecontrast: Symbol('getDevicecontrast'), //  根据筛选条件获取所有的设备型号
    getChartsData: Symbol('getChartsData'), // 图表数据
  
    resetStore: Symbol('resetStore'), // 发起重置数据请求
  }
  