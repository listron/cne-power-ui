export const stationContrastBaseName =[
  { 
    baseClassifyName: '基本信息',
    rowName: [
      '电站名称',
      '并网时间',
      '装机容量（MW）',
      '区域',
      '装机台数',
    ],
  },
  {
    baseClassifyName: '资源情况',
    rowName: [
      '斜面辐射总量（MJ/㎡）',
      '日照时数（h）',
      '平均气温（℃）',
    ]
  },
  {
    baseClassifyName: '发电情况',
    rowName: [
      '计划发电量（万kWh）',
      '实际发电量（万kWh）',
      '计划完成率（%）',
      '上网电量（万kWh）',
      '购网电量（万kWh）',
    ]
  },
  {
    baseClassifyName: '运行情况',
    rowName: [
      'PR（%）',
      'CPR（%）',
      '理论发电量（万kWh）',
      '等效利用小时数（h）',
      '损失电量等效时（h）',
      '发电系统可利用率（%）',
      '电站可利用率（%）',
      '限电损失等效时（h）',
      '变电故障损失等效时（h）',
      '计划停机损失等效时（h）',
      '发电系统故障损失等效时（h）',
      // '技改大修损失等效时（h）',
      '场外因素损失等效时（h）',
      '限电率（%）',
      '厂用电率（%）',
      '综合厂用电率（%）',
      '厂损率（%）',
      '送出线损率（%）',
    ],
  },
];


export const stationContrastBaseInfo = {
  resourceValue: '斜面辐射总量（MJ/㎡）',
  sunshineHours: '日照时数（h）',
  tempAvg: '平均气温（℃）',
  planGen: '计划发电量（万kWh）',
  genValid: '实际发电量（万kWh）',
  planFinshRatio: '计划完成率（%）',
  genInternet: '上网电量（万kWh）',
  buyPower: '购网电量（万kWh）',
  pr: 'PR（%）',
  cpr: 'CPR（%）',
  theoryPower: '理论发电量（万kWh）',
  equivalentHours: '等效利用小时数（h）',
  lostPowerHours: '损失电量等效时（h）',
  deviceAvailability: '发电系统可利用率（%）',
  stationAvailability: '电站可利用率（%）',
  limitPowerHours: '限电损失等效时（h）',
  subStationHours: '变电故障损失等效时（h）',
  planShutdownHours: '计划停机损失等效时（h）',
  faultPowerHours: '发电系统故障损失等效时（h）',
  // technicalHours: '技改大修损失等效时（h）',
  courtHours: '场外因素损失等效时（h）',
  limitPowerRate: '限电率（%）',
  plantPowerRate: '厂用电率（%）',
  comPlantPowerRate: '综合厂用电率（%）',
  plantLossRate: '厂损率（%）',
  sendLineRate: '送出线损率（%）',
}

export const stationContrastDataInfo = {
  resourceValue: 'resourceValue',
  sunshineHours: 'sunshineHours',
  tempAvg: 'tempAvg',
  planGen: 'planGen',
  genValid: 'genValid',
  planFinshRatio: 'planFinshRatio',
  genInternet: 'genInternet',
  buyPower: 'buyPower',
  pr: 'pr',
  cpr: 'cpr',
  theoryPower: 'theoryPower',
  equivalentHours: 'equivalentHours',
  lostPowerHours: 'lostPowerHours',
  deviceAvailability: 'deviceAvailability',
  stationAvailability: 'stationAvailability',
  limitPowerHours: 'limitPowerHours',
  subStationHours: 'subStationHours',
  planShutdownHours: 'planShutdownHours',
  faultPowerHours: 'faultPowerHours',
  // technicalHours: 'technicalHours',
  courtHours: 'courtHours',
  limitPowerRate: 'limitPowerRate',
  plantPowerRate: 'plantPowerRate',
  comPlantPowerRate: 'comPlantPowerRate',
  plantLossRate: 'plantLossRate',
  sendLineRate: 'sendLineRate',
}

