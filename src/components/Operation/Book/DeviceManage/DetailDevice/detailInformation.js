import moment from 'moment';
export const baseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。
  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0) ? `${parseFloat(detailData.longitude).toFixed(6)}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0) ? `${parseFloat(detailData.latitude).toFixed(6)}°` : '--';
  const deviceTypeCode = detailData.deviceTypeCode ? detailData.deviceTypeCode : '';

  const isShowData = ['202', '101', '207', '203', '501', '206', '304', '201',].includes(deviceTypeCode);//显示是否显示以及接入时间
  if (!isShowData) {
    let baseArray = [  // 基础信息配置 -- > 
      { name: '电站名称', value: detailData.stationName || '--' },
      { name: '设备类型', value: detailData.deviceTypeName, },
      { name: '设备名称', value: detailData.deviceName, },
      { name: '设备型号', value: detailData.deviceModeName, },
      { name: '生产厂家', value: detailData.manufacturer, },
      { name: '批次号', value: detailData.lotNumber, },
      { name: '资产类型', value: detailData.manufactorName },
      { name: '制造商', value: detailData.manufactorName },
      { name: '供货商', value: detailData.supplierName },
      { name: '是否显示', value: ['否', '是'][detailData.enableDisplay] },
      { name: '创建时间', value: detailData.connectTime },
    ];
    return baseArray;
  }

  let baseArray = [  // 基础信息配置 -- > 
    { name: '电站名称', value: detailData.stationName || '--' },
    { name: '设备类型', value: detailData.deviceTypeName, },
    { name: '设备名称', value: detailData.deviceName, },
    { name: '设备型号', value: detailData.deviceModeName, },
    { name: '生产厂家', value: detailData.manufacturer, },
    { name: '批次号', value: detailData.lotNumber, },
  ];
  return baseArray;
}
export const selcetbaseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。

  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0) ? `${parseFloat(detailData.longitude).toFixed(6)}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0) ? `${parseFloat(detailData.latitude).toFixed(6)}°` : '--';
  const deviceTypeCode = detailData.deviceTypeCode ? detailData.deviceTypeCode : '';

  const isShow = ['202', '101', '207',].includes(deviceTypeCode);//特殊设备通用的，看产品文档备注，关联设备，额定，装机，经纬度

  const isMeteorology = ['203', '501',].includes(deviceTypeCode);//测风塔和气象站呈现经纬度

  const isTemplateMachine = ['206', '304', '201',].includes(deviceTypeCode);//样板机


  if (isShow) {
    let selcetbaseArray = [  // 基础信息配置 -- > 
      { name: '关联设备', value: detailData.pareneDeviceName, },
      { name: '额定容量', value: detailData.ratedPower, },
      { name: '装机容量', value: detailData.deviceCapacity, },
      { name: '经度', value: `${longitude}`, },
      { name: '纬度', value: ` ${latitude}`, },
      { name: '设备编号', value: detailData.deviceFullCode, },
      { name: '资产类型', value: detailData.manufactorName },
      { name: '制造商', value: detailData.manufactorName },
      { name: '供货商', value: detailData.supplierName },
      { name: '是否显示', value: ['否', '是'][detailData.enableDisplay] },
      { name: '创建时间', value: detailData.connectTime },
    ];
    return selcetbaseArray;
  }
  if (isMeteorology) {
    let selcetbaseArray = [  // 基础信息配置 -- > 
      { name: '经度', value: `${longitude}`, },
      { name: '纬度', value: ` ${latitude}`, },
      { name: '设备编号', value: detailData.deviceFullCode, },
      { name: '资产类型', value: detailData.manufactorName },
      { name: '制造商', value: detailData.manufactorName },
      { name: '供货商', value: detailData.supplierName },
      { name: '是否显示', value: ['否', '是'][detailData.enableDisplay] },
      { name: '创建时间', value: detailData.connectTime },
    ];
    return selcetbaseArray;
  }
  if (isTemplateMachine) {
    let selcetbaseArray = [  // 基础信息配置 -- > 
      { name: '关联设备', value: detailData.pareneDeviceName, },
      { name: '是否为样板机', value: ['否', '是'][detailData.templateMachine], },
      { name: '额定容量', value: detailData.ratedPower, },
      { name: '装机容量', value: detailData.deviceCapacity, },
      { name: '经度', value: `${longitude}`, },
      { name: '纬度', value: ` ${latitude}`, },
      { name: '设备编号', value: detailData.deviceFullCode, },
      { name: '资产类型', value: detailData.manufactorName },
      { name: '制造商', value: detailData.manufactorName },
      { name: '供货商', value: detailData.supplierName },
      { name: '是否显示', value: ['否', '是'][detailData.enableDisplay] },
      { name: '创建时间', value: detailData.connectTime },
    ];
    return selcetbaseArray;
  }
  return []

}
export const windTimeFun = (detailData) => {
  const isMap = detailData.map;
  const windTimeArray = [
    { name: '安装日期', value: (isMap && detailData.map.assemblyTime) ? moment(detailData.map.assemblyTime).format('YYYY-MM-DD') : '', },
    { name: '并网日期', value: (isMap && detailData.map.ongridTime) ? moment(detailData.map.ongridTime).format('YYYY-MM-DD') : '', },
    { name: '进入质保时间', value: (isMap && detailData.map.warrantyBegintime) ? moment(detailData.map.warrantyBegintime).format('YYYY-MM-DD') : '', },
    { name: '出质保时间', value: (isMap && detailData.map.warrantyEndtime) ? moment(detailData.map.warrantyEndtime).format('YYYY-MM-DD') : '', },
    { name: '报废时间', value: (isMap && detailData.map.scrapTime) ? moment(detailData.map.scrapTime).format('YYYY-MM-DD') : '', },
    { name: '轮毂高度', value: (isMap && detailData.map.hubHeight) ? detailData.map.hubHeight : '', unit: 'm' },
    { name: '海拔', value: (isMap && detailData.map.altitude) ? detailData.map.altitude : '', unit: 'm' },
  ];
  return windTimeArray;
}
export const windTowerFun = (detailData) => {
  const isMap = detailData.map;
  const windTowerArray = [
    { name: '海拔高度', value: (isMap && detailData.map.altitude) ? detailData.map.altitude : '', unit: 'm' },
    { name: '立塔时间', value: (isMap && detailData.map.towerAssemblyTime) ? moment(detailData.map.towerAssemblyTime).format('YYYY-MM-DD') : '', },
    { name: '塔高', value: (isMap && detailData.map.towerHeight) ? detailData.map.towerHeight : '', unit: 'm' },
    { name: '测风设备', value: (isMap && detailData.map.windMeasurementEquipment) ? detailData.map.windMeasurementEquipment : '' },
  ];
  return windTowerArray;
}