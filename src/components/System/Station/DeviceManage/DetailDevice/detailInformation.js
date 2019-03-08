import moment from 'moment';
export const baseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。
  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0)? `${parseFloat(detailData.longitude).toFixed(6)}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0)? `${parseFloat(detailData.latitude).toFixed(6)}°` : '--';
  let baseArray = [  // 基础信息配置 -- > 
    { name: '电站名称', value: detailData.stationName || '--'}, 
    { name: '设备类型', value: detailData.deviceTypeCode, },
    { name: '设备名称', value: detailData.deviceName, },
    { name: '设备型号', value: detailData.deviceModeName, },
    { name: '生产厂家', value: detailData.manufacturer, },
    { name: '批次号', value: detailData.lotNumber,  },
    { name: '关联设备', value: detailData.pareneDeviceName,  },
    { name: '是否为样板机', value: ['否','是'][detailData.templateMachine], },
    { name: '额定容量', value: detailData.ratedPower, },
    { name: '装机容量', value: detailData.deviceCapacity, },
    { name: '经度', value: `${longitude}`, },
    { name: '纬度', value: ` ${latitude}`, },
    { name: '设备编号', value: detailData.deviceFullCode,  },
    { name: '是否显示', value: ['否','是'][detailData.enableDisplay] },
    { name: '接入日期', value: detailData.connectTime },
  ];
  return baseArray;
}
export const windTimeFun = (detailData) => {
  const windTimeArray = [  
    { name: '安装日期', value: detailData.map.assemblyTime?moment(detailData.assemblyTime).format('YYYY-MM-DD'):'', },
    { name: '并网日期', value:  detailData.map.ongridTime?moment(detailData.ongridTime).format('YYYY-MM-DD'):'',},
    { name: '进入质保时间', value: detailData.map.warrantyBegintime?moment(detailData.warrantyBegintime).format('YYYY-MM-DD'):'',},
    { name: '出质保时间', value: detailData.map.warrantyEndtime?moment(detailData.warrantyEndtime).format('YYYY-MM-DD'):'',},
    { name: '报废时间', value: detailData.map.scrapTime?moment(detailData.scrapTime).format('YYYY-MM-DD'):'',},
    { name: '轮毂高度', value: detailData.map.hubHeight},
  ];
  return windTimeArray;
}
export const windTowerFun = (detailData) => {
  const windTowerArray = [ 
    { name: '海拔高度', value: detailData.map.altitude },
    { name: '立塔时间', value: detailData.map.towerAssemblyTime ?moment(detailData.towerAssemblyTime).format('YYYY-MM-DD'):'',},
    { name: '塔高', value: detailData.map.towerHeight },
    { name: '测风设备', value: detailData.map.windMeasurementEquipment },
  ];
  return windTowerArray;
}