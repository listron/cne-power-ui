
export const reportBasefun = (stationType = 0, powerUnit='kWh') => { // 电站日报基础配置信息填写
  // pointLength: 允许填写的小数点位数，根据电量单位判定，kWh为2位，万kWh为4位
  return [
    {
      configText: stationType>0?'日斜面辐射总量':'日平均风速',
      configName: 'resourceValue',
      pointLength: 2,
    },{
      configText: '逆变器年发电量',
      configName: 'yearGenInverter',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '集电线路年发电量',
      configName: 'yearGenIntegrated',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '年上网发电量',
      configName: 'yearGenInternet',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '年购网电量',
      configName: 'buyPower',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '样板逆变器容量',
      configName: 'modelInverterCapacity',
      pointLength: 2,
    },{
      configText: '样板逆变器发电量',
      configName: 'modelInverterPowerGen',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '逆变器日发电量',
      configName: 'genInverter',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '集电线路日发电量',
      configName: 'genIntegrated',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '日上网发电量',
      configName: 'genInternet',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '日购网电量',
      configName: 'dailyBuyPower',
      pointLength: powerUnit==='kWh'?2:4
    }
  ]
}

export const reportEditFun = (stationType = 0, powerUnit='kWh') => { // 电站编辑数据信息填写
  // pointLength: 允许填写的小数点位数，根据电量单位判定，kWh为2位，万kWh为4位
  return [
    {
      configText: stationType>0?'日斜面辐射总量':'日平均风速',
      configName: 'resourceValue',
      pointLength: 2,
    },{
      configText: '日购网电量',
      configName: 'dailyBuyPower',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '样板逆变器容量',
      configName: 'modelInverterCapacity'
    },{
      configText: '样板逆变器发电量',
      configName: 'modelInverterPowerGen',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '日发电量(逆变器)',
      configName: 'genInverter',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '日发电量(集电线路)',
      configName: 'genIntegrated',
      pointLength: powerUnit==='kWh'?2:4
    },{
      configText: '日发电量(上网)',
      configName: 'genInternet',
      pointLength: powerUnit==='kWh'?2:4
    }
  ]
}

