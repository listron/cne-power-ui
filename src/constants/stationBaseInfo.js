

export const PVStationTypes = [
  {
    deviceTypeCode: '206',
    deviceTypeName: '逆变器（组串）',
    deviceConfig: 'seriesinverter',
    icon: 'iconfont icon-nb'
  },{
    deviceTypeCode: '201',
    deviceTypeName: '逆变器（集中）',
    deviceConfig: 'seriesinverter',
    icon: 'iconfont icon-nb'
  },{
    deviceTypeCode: '202',
    deviceTypeName: '汇流箱',
    deviceConfig: 'confluencebox',
    icon: 'iconfont icon-hl'
  },{
    deviceTypeCode: '207',
    deviceTypeName: '交流汇流箱',
    deviceConfig: 'confluencebox',
    icon: 'iconfont icon-hl'
  },{
    deviceTypeCode: '304',
    deviceTypeName: '箱变',
    deviceConfig: 'boxtransformer',
    icon: 'iconfont icon-xb'
  },{
    deviceTypeCode: '203',
    deviceTypeName: '气象站',
    deviceConfig: 'weatherstation',
    icon: 'iconfont icon-weather'
  },{
    deviceTypeCode: '302',
    deviceTypeName: '集电线路',
    deviceConfig: 'integrateLine',
    icon: 'iconfont icon-jidian'
  },{
    deviceTypeCode: '301',
    deviceTypeName: '升压站',
    deviceConfig: 'boosterStation',
    icon: 'iconfont icon-syz'
  }
];

export const deviceStatusArray = [
  {
    statusCode: '100',
    statusName: '正常',
    icon: 'iconfont icon-examine'
  },{
    statusCode: '200',
    statusName: '停机',
    icon: 'iconfont icon-alarm'
  },{
    statusCode: '300',
    statusName: '故障',
    icon: 'iconfont icon-alarm'
  },{
    statusCode: '900',
    statusName: '未接入',
    icon: 'iconfont icon-alarm'
  }
];

export const stationStatusArray =[
  {
    statusCode: '400',
    statusName: '通讯正常',
    icon: 'iconfont icon-alarm'
  },{
    statusCode: '500',
    statusName: '信息中断',
    icon: 'iconfont icon-alarm'
  },{
    statusCode: '900',
    statusName: '未接入',
    icon: 'iconfont icon-alarm'
  }
]

// 各设备类型状态码：
export const branchStatus = { // 支路状态
  '801': '偏低',
  '802': '偏高',
  '803': '异常',
  '400': '正常',
  '500': '无通讯',
  '900': '未接入',
};

export const interverStatus = { // 逆变器状态
  '401': '限电',
  '201': '正常停机',
  '202': '计划停机',
  '203': '故障停机',
  '400': '正常',
  '500': '无通讯',
  '900': '未接入',
};

export const confluenceStatus = { // 汇流箱状态
  '400': '正常',
  '500': '无通讯',
  '900': '未接入',
  '801': '离散率>=10%',
  '802': '离散率>=20%',
};

export const boxtransformerStatus = { // 箱变状态
  '400': '正常',
  '500': '无通讯',
  '900': '未接入',
};
