
export const reportBasefun = (stationType) => { // 电站日报基础配置信息填写
  return [
    {
      configText: stationType>0?'日斜面辐射总量':'日平均风速',
      configName: 'resourceValue'
    },{
      configText: '逆变器累计发电量',
      configName: 'yearGenInverter'
    },{
      configText: '集电线路累计发电量',
      configName: 'yearGenIntegrated'
    },{
      configText: '上网电量累计发电量',
      configName: 'yearGenInternet'
    },{
      configText: '购网电量',
      configName: 'buyPower'
    },{
      configText: '样板逆变器容量',
      configName: 'modelInverterCapacity'
    },{
      configText: '样板逆变器发电量',
      configName: 'modelInverterPowerGen'
    }
  ]
}