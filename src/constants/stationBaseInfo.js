

export const PVStationTypes = [
  {
    deviceTypeCode: '206',
    deviceTypeName: '组串式逆变器',
    deviceConfig: 'seriesinverter',
    icon: 'iconfont icon-nb'
  },{
    deviceTypeCode: '201',
    deviceTypeName: '集中式逆变器',
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

