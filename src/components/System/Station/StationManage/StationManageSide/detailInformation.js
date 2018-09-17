
import moment from 'moment';

export const baseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。
  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0)? `${detailData.longitude}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0)? `${detailData.latitude}°` : '--';
  let baseArray = [  // 基础信息配置 -- > 
    { name: '电站类型', value: detailData.stationType === 0?'风电':(detailData.stationType === 1?'光伏':''), }, // 实际调整
    { name: '电站位置', value: `${longitude} ${latitude}`, }, // 特殊组合
    { name: '覆盖类型', value: detailData.coverType, },
    { name: '所属区域', value: detailData.regionName, },
    { name: '所在省市', value: detailData.provinceName, },
    { name: '所属公司', value: detailData.affiliateCompany, },
    { name: '联系电话', value: detailData.stationContactNumber, },
    { name: '并网容量', value: detailData.stationCapacity, unit:'MWp' },
    { name: '设计容量', value: detailData.designCapacity, unit:'MWp' },
    { name: '占地面积', value: detailData.floorArea, unit:'平方公里' },
    { name: '年利用小时数', value: detailData.designUtilizationHours, unit:'小时' },
    { name: '是否接入', value: detailData.stationStatus?'是':'否', }, // 实际调整
  ];
  if(detailData.stationType === 0){ // 风电场没有覆盖类型
    return baseArray.filter(e=> e.name !== '覆盖类型');
  }
  return baseArray;
}

export const connectionPriceFun = (detailData) => { // 根据并网类型及电价输出指定规则数据。
  const connectionPriceArray = [ // 并网信息及电价
    { name: '通过并网测验', value: detailData.gridConnectionDetection?'是':'否', }, // 实际调整
    { name: '调度机构名称', value: detailData.dispatchingAgency, },
    { name: '调度机构性质', value: detailData.agencyType, },
    { name: '并网点电站名称', value: detailData.gridSubstationName, },
    { name: '首次并网时间', 
      value: detailData.ongridTime?moment(detailData.ongridTime).format('YYYY-MM-DD'):'', 
    }, // 时间格式是否需要转化
    { name: '全部并网时间', 
      value: detailData.fullOngridTime?moment(detailData.fullOngridTime).format('YYYY-MM-DD'):'', 
    }, // 时间格式是否需要转化
    { name: '并网电压等级', value: detailData.gridVoltageLevel, },
    { name: '发电单元个数', value: detailData.stationUnitCount, },
  ];
  return connectionPriceArray;
}

export const otherFun = (detailData) => { // 其他信息配置输出指定规则数据。
  const otherArray = [ // 其他信息
    { name: '自动有功控制能力', value: detailData.automaticActiveControl?'是':'否', }, // 实际调整
    { name: '监控系统厂家', value: detailData.monitoringSystemName, },
    { name: '创建人', value: '字段未定义', }, // 未知
    { name: '自动无功控制能力', value: detailData.automaticAeactiveContro?'是':'否', }, // 实际调整
    { name: '监控系统个数', value: detailData.monitoringSystemCount, },
    { name: '创建时间', value: '字段未定义', }, // 未知
    { name: '低压穿越(LVRT)', value: detailData.lowPressureCrossing, },  
    { name: '电站时区', value: detailData.timeZone, }, // 格式？
  ];
  return otherArray;
}