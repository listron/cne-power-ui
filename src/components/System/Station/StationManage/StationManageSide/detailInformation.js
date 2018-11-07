
import moment from 'moment';

export const baseFun = (detailData) => { // 根据基础信息配置输出指定规则数据。
  const { stationType } = detailData;
  const isPv = stationType === 1; // true光伏 false风电。
  const isWind = stationType === 0;
  const longitude = (detailData.longitude || parseFloat(detailData.longitude) === 0)? `${parseFloat(detailData.longitude).toFixed(2)}°` : '--';
  const latitude = (detailData.latitude || parseFloat(detailData.latitude) === 0)? `${parseFloat(detailData.latitude).toFixed(2)}°` : '--';
  let baseArray = [  // 基础信息配置 -- > 
    { name: '电站名称', value: detailData.stationName || '--'}, 
    { name: '电站类型', value: isPv?'光伏':'风电' }, // 实际调整
    { name: '经纬度', value: `${longitude}, ${latitude}`, }, // 特殊组合
    { name: '覆盖类型', value: detailData.coverType, },
    { name: '一级区域', value: detailData.level1RegionName, },
    { name: isWind?'区域':'二级区域', value: detailData.regionName },
    { name: '所在省市', value: `${detailData.provinceName||'--'} ${detailData.cityName||'--'} ${detailData.countyName||'--'}` },
    { name: '所属项目公司', value: detailData.affiliateProjectCompany, },
    { name: '所属发电集团公司', value: detailData.affiliateCompany, },
    { name: '集团占比', value: detailData.ratio, },
    { name: '合作单位', value: detailData.cooperationCom, },
    { name: '机组型号', value: detailData.unitModel, },
    { name: '联系电话', value: detailData.stationContactNumber, },
    { name: '装机容量', value: detailData.stationCapacity, unit:'MW' },
    { name: '设计容量', value: detailData.designCapacity, unit:'MW' },
    { name: '占地面积', value: detailData.floorArea, unit:'k㎡' },
    { name: '年利用小时数', value: detailData.designUtilizationHours, unit:'小时' },
    { name: '是否接入', value: ['否','是'][detailData.stationStatus] },
    { name: '组装角度', value: detailData.componentAngle },
    { name: '是否启用', value: ['否','是'][detailData.stationEnabled] },
    { name: '排序号', value: detailData.sort },
  ];
  if(isWind){ // 风电场没有的指标去掉
    return baseArray.filter(e=> {
      const windRemoveConf = ['一级区域', '覆盖类型', '组装角度'];
      return !windRemoveConf.includes(e.name);
    });
  }
  return baseArray;
}

export const stationBelongFun = (detailData) => {
  const stationBelongArray = [ 
    { name: '所属类型', value: detailData.belongType },
    { name: '项目类型', value: detailData.dispatchingAgency },
    { name: '安装方式', value: detailData.assemblyType },
    { name: '新的分类', value: detailData.buildType },
    { name: '消纳方式', value: detailData.consumptionType }
  ];
  return stationBelongArray;
}

export const connectionPriceFun = (detailData) => { // 根据并网类型及电价输出指定规则数据。
  const connectionPriceArray = [ // 并网信息及电价
    { name: '通过并网测验', value: ['否','是'][detailData.gridConnectionDetection] }, 
    { name: '调度机构名称', value: detailData.dispatchingAgency, },
    { name: '调度机构性质', value: detailData.agencyType, },
    { name: '并网点电站名称', value: detailData.gridSubstationName, },
    { name: '首次并网时间', 
      value: detailData.ongridTime?moment(detailData.ongridTime).format('YYYY-MM-DD'):'', 
    },
    { name: '全部并网时间', 
      value: detailData.fullOngridTime?moment(detailData.fullOngridTime).format('YYYY-MM-DD'):'', 
    },
    { name: '并网电压等级', value: detailData.gridVoltageLevel, },
    { name: '发电单元个数', value: detailData.stationUnitCount, },
  ];
  return connectionPriceArray;
}

export const otherFun = (detailData) => { // 其他信息配置输出指定规则数据。
  const { timeZone } = detailData;
  let timeZoneText = '';
  if(timeZone){
    let initTime = `${Math.abs(timeZone)}`.padStart(2,'0');
    timeZone > 0 && (timeZoneText = `UTC+${initTime}:00`);
    timeZone < 0 && (timeZoneText = `UTC-${initTime}:00`);
  }else if(timeZone === 0){
    timeZoneText = 'UTC';
  }
  const otherArray = [ // 其他信息
    { name: '有功控制能力', value: ['否','是'][detailData.automaticActiveControl] }, 
    { name: '监控系统厂家', value: detailData.monitoringSystemName, },
    { name: '创建人', value: detailData.createUser, },
    { name: '无功控制能力', value: ['否','是'][detailData.automaticAeactiveContro], }, 
    { name: '监控系统个数', value: detailData.monitoringSystemCount, },
    { name: '创建时间', value: detailData.createTime?moment((detailData.createTime)).format('YYYY-MM-DD HH:mm'):'--' }, 
    { name: '低压穿越(LVRT)', value: ['否','是'][detailData.lowPressureCrossing], },  
    { name: '电站时区', value: timeZoneText },
  ];
  return otherArray;
}