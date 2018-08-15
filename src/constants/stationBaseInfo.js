

export const PVStationTypes = [
  {
    deviceTypeCode: '206',
    deviceTypeName: '组串式逆变器',
    deviceConfig: 'seriesinverter'
  },{
    deviceTypeCode: '202',
    deviceTypeName: '汇流箱',
    deviceConfig: 'confluencebox'
  },{
    deviceTypeCode: '304',
    deviceTypeName: '箱变',
    deviceConfig: 'boxtransformer'
  },{
    deviceTypeCode: '203',
    deviceTypeName: '气象站',
    deviceConfig: 'weatherstation'
  }
];

export const deviceStatusArray = [
  {
    statusCode: 100,
    statusName: '正常',
  },{
    statusCode: 200,
    statusName: '停机',
  },{
    statusCode: 300,
    statusName: '故障',
  },{
    statusCode: 900,
    statusName: '未接入',
  }
];

