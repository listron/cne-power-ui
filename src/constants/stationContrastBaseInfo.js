export const stationContrastBaseName = [
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
  resourceValue: { name: '斜面辐射总量', unit: 'MJ/㎡', id: 'resourceValue' },
  sunshineHours: { name: '日照时数', unit: 'h', id: 'sunshineHours' },
  tempAvg: { name: '平均气温', unit: '℃', id: 'tempAvg' },
  planGen: { name: '计划发电量', unit: '万kWh', id: 'planGen' },
  genValid: { name: '实际发电量', unit: '万kWh', id: 'genValid' },
  planFinshRatio: { name: '计划完成率', unit: '%', id: 'planFinshRatio' },
  genInternet: { name: '上网电量', unit: '万kWh', id: 'genInternet' },
  buyPower: { name: '购网电量', unit: '万kWh', id: 'buyPower' },
  pr: { name: 'PR', unit: '%', id: 'pr' },
  cpr: { name: 'CPR', unit: '%', id: 'cpr' },
  theoryPower: { name: '理论发电量', unit: '万kWh', id: 'theoryPower' },
  equivalentHours: { name: '等效利用小时数', unit: 'h', id: 'equivalentHours' },
  lostPowerHours: { name: '损失电量等效时', unit: 'h', id: 'lostPowerHours' },
  limitPowerHours: { name: '限电损失等效时', unit: 'h', id: 'limitPowerHours' },
  subStationHours: { name: '变电故障损失等效时', unit: 'h', id: 'subStationHours' },
  planShutdownHours: { name: '计划停机损失等效时', unit: 'h', id: 'planShutdownHours' },
  faultPowerHours: { name: '发电系统故障损失等效时', unit: 'h', id: 'faultPowerHours' },
  courtHours: { name: '场外因素损失等效时', unit: 'h', id: 'courtHours' },

  deviceAvailability: { name: '发电系统可利用率', unit: '%', id: 'deviceAvailability' },
  stationAvailability: { name: '电站可利用率', unit: '%', id: 'stationAvailability' },
  limitPowerRate: { name: '限电率', unit: '%', id: 'limitPowerRate' },
  plantPowerRate: { name: '厂用电率', unit: '%', id: 'plantPowerRate' },
  comPlantPowerRate: { name: '综合厂用电率', unit: '%', id: 'comPlantPowerRate' },
  plantLossRate: { name: '厂损率', unit: '%', id: 'plantLossRate' },
  sendLineRate: { name: '送出线损率', unit: '%', id: 'sendLineRate' },
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

