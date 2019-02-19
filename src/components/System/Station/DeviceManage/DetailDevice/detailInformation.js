import moment from 'moment';
export const baseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。

  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0)? `${parseFloat(detailData.longitude).toFixed(2)}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0)? `${parseFloat(detailData.latitude).toFixed(2)}°` : '--';
  let baseArray = [  // 基础信息配置 -- > 
    { name: '电站名称', value: detailData.stationName || '--'}, 
    { name: '设备类型', value: detailData.deviceTypeCode, },
    { name: '设备名称', value: detailData.deviceName, },
    { name: '设备型号', value: detailData.deviceModeName, },
    { name: '生产厂家', value: detailData.manufacturer, },
    { name: '批次号', value: detailData.lotNumbe,  },
    { name: '关联设备', value: detailData.pareneDeviceName,  },
    { name: '是否为样板机', value: detailData.templateMachine,  },
    { name: '额定容量', value: detailData.ratedPower, },
    { name: '装机容量', value: detailData.deviceCapacity, },
    { name: '经度', value: `${longitude}`, },
    { name: '纬度', value: ` ${latitude}`, },
    { name: '设备编号', value: detailData.deviceFullCode,  },
    { name: '是否显示', value: ['否','是'][detailData.enableDisplay] },
    { name: '接入日期', value: detailData.connectTime },
  ];
  // if(isWind){ // 没有的指标去掉
  //   return baseArray.filter(e=> {
  //     const windRemoveConf = ['一级区域', '覆盖类型', '组装角度'];
  //     return !windRemoveConf.includes(e.name);
  //   });
  // }
  return baseArray;
}
export const windTimeFun = (detailData) => {
  const windTimeArray = [  
    { name: '安装日期', value: detailData.assemblyTime?moment(detailData.assemblyTime).format('YYYY-MM-DD'):'', },
    { name: '并网日期', value:  detailData.ongridTime?moment(detailData.ongridTime).format('YYYY-MM-DD'):'',},
    { name: '进入质保时间', value: detailData.warrantyBegintime?moment(detailData.warrantyBegintime).format('YYYY-MM-DD'):'',},
    { name: '出质保时间', value: detailData.warrantyEndtime?moment(detailData.warrantyEndtime).format('YYYY-MM-DD'):'',},
    { name: '报废时间', value: detailData.scrapTime?moment(detailData.scrapTime).format('YYYY-MM-DD'):'',},
    { name: '轮毂高度', value: detailData.hubHeight?moment(detailData.hubHeight).format('YYYY-MM-DD'):'',},
  ];
  return windTimeArray;
}
export const windTowerFun = (detailData) => {
  const windTowerArray = [ 
    { name: '海拔高度', value: detailData.altitude },
    { name: '立塔时间', value: detailData.towerAssemblyTime ?moment(detailData.towerAssemblyTime).format('YYYY-MM-DD'):'',},
    { name: '塔高', value: detailData.towerHeight },
    { name: '测风设备', value: detailData.windMeasurementEquipment },
   
  ];
  return windTowerArray;
}