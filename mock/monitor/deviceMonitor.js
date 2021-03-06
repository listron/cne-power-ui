
module.exports = [
  {//组串式逆变器详情
    api:'/mock/monitor/seriesinverter',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        deviceId: "1122334545", 
        deviceCode: "123M121M213",
        deviceName: "NB01-12",
        deviceStatus: 10,
        alarmNum: 21,
        devicePower: '113',
        deviceCapacity: '541',
        powerDay: '114',
        powerMonth: '2410',
        powerYear: '70000',
        parentDevice: {
          deviceCode: '12111',
          deviceName: 'HL110',
          deviceTypeCode: '112',
          deviceTypeName: '汇流箱'
        },
        sonDevice: {
          deviceCode: '12111',
          deviceName: 'HL110',
          deviceTypeCode: '112',
          deviceTypeName: '组串'
        },
        
      },
      "serviceCode": "3.0"
    },
    error:{}
  },{//组串式逆变器10min时序
    api:'/mock/monitor/seriesinverterTenMin',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({
        utc: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        localTime: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        stationPower: e*1012,
        instantaneous: e*1246,
      })),
      "serviceCode": "3.0"
    },
    error:{}
  },{ //汇流箱详情
    api:'/mock/monitor/confluenceboxDetail',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        deviceId: "1122334545", 
        deviceCode: "123M121M213",
        deviceName: "HL01-1112",
        deviceStatus: 100,
        devicePower: '113',
        deviceCapacity: '541',
        dispersionRatio: '45',
        parentDevice: {
          deviceCode: '12111',
          deviceName: 'XB12',
          deviceTypeCode: '112',
          deviceTypeName: '箱变'
        },
        sonDevice: {
          deviceCode: '12111',
          deviceName: 'NB110',
          deviceTypeCode: '112',
          deviceTypeName: '逆变器'
        },
        
      },
      "serviceCode": "3.0"
    },
    error:{}
  },{//汇流箱10min时序
    api:'/mock/monitor/confluenceboxTenMin',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({
        utc: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        localTime: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        dispersionRatio: e*2,
        HL001: e,
        HL002: e*2,
        HL003: e*1.2,
        HL004: e*1.5,
        HL005: e*1.7,
      })),
      "serviceCode": "3.0"
    },
    error:{}
  },{ //箱变详情
    api:'/mock/monitor/boxtransformerDetail',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        deviceId: "1122334545", 
        deviceCode: "123M121M213",
        deviceName: "XB11",
        deviceStatus: 100,
        devicePower: '113',
        deviceCapacity: '541',
        parentDevice: {
          deviceCode: '12111',
          deviceName: 'JD12',
          deviceTypeCode: '112',
          deviceTypeName: '集电线路'
        },
        sonDevice: {
          deviceCode: '12111',
          deviceName: 'HL110',
          deviceTypeCode: '112',
          deviceTypeName: '汇流箱'
        },
        
      },
      "serviceCode": "3.0"
    },
    error:{}
  },{ //箱变10min时序
    api:'/mock/monitor/boxtransformerTenMin',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({
        utc: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        localTime: `2018-${e}-${e*2} ${e}:${e*3}:${e*4}`,
        HL001: e,
        HL002: e*2,
        HL003: e*1.2,
        HL004: e*1.5,
        HL005: e*1.7,
        instantaneous: e*1024
      })),
      "serviceCode": "3.0"
    },
    error:{}
  },{ // 气象站详情
    api:'/mock/monitor/weatherstationDetail',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        deviceId: "1122334545", 
        deviceCode: "123M121M213",
        deviceName: "气象站-12",
        deviceStatus: 100,
        windSpeed: '5.45',
        temp: '27',
        humidity: '87',
        batteryTemp: '34',
        instantaneous: 114,
        sunshine: 1141,
        windDirect: '南风',
      },
      "serviceCode": "3.0"
    },
    error:{}
  },{//测点数据
    api:'/mock/monitor/monitorPointData',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [{
        devicePointCode: '112',
        devicePointName: '温度',
        devicePointIECGroup: '11',
        devicePointValue: '12',
        devicePointDataType: 'hh',
        devicePointUnit: '摄氏度',
        collectTime: '2018-08-04 05:11:12'
      },{
        devicePointCode: '113',
        devicePointName: '湿度',
        devicePointIECGroup: '12',
        devicePointValue: '213',
        devicePointDataType: 'h11h',
        devicePointUnit: '%',
        collectTime: '2018-08-04 05:11:12'
      },{
        devicePointCode: '11121',
        devicePointName: '杀气',
        devicePointIECGroup: '34',
        devicePointValue: '内功',
        devicePointDataType: '11',
        devicePointUnit: '123',
        collectTime: '2018-08-04 05:11:12'
      },{
        devicePointCode: '1120',
        devicePointName: '技能',
        devicePointIECGroup: '11',
        devicePointValue: '4',
        devicePointDataType: 'hh',
        devicePointUnit: '级',
        collectTime: '2018-08-04 05:11:12'
      },...([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,22,12,34,45,57,55,56,76,12].map((e,i) => ({
        devicePointCode: `${e}${i}`,
        devicePointName: `测试测点名${i}`,
        devicePointIECGroup: `测试测点组${i}`,
        devicePointValue: `${e}*${i}/3`,
        devicePointDataType: 'hh',
        devicePointUnit: 'xx',
        collectTime: `20${e}-${e}-${e} ${i} ${e}${i} ${i}${e}`
      })))],
      "serviceCode": "3.0"
    },
    error:{}
  }, { // 单设备告警信息
    api:'/mock/monitor/deviceAlarm',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8].map(e => ({
        rediskey: `${e}a${e*2}b${e*4}`,
        warningLevel: e%4,
        warningConfigName: ['状态告警','极值告警','数据告警','外星人来袭告警'][e%4],
        warningCheckDesc: '告警描述： 外星人来袭，无法发电',
        timeOn: `201${e}年${e}月${e*3}日 ${e*2}:${e*5}:${e*6}`,
        durationTime: `${e*124}分钟`
      })),
      "serviceCode": "3.0"
    },
    error:{}
  }, {// 单电站个设备；列表
    api:'/mock/monitor/deviceList',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,1,2,3,4,5,65,7,8,8,1,1,1,1,1,1,1,1,1].map((e,i) => ({
        deviceId: `${i}a${e*2}b${e*4}`,
        deviceCode: `${i}a${e*2}b${e*4}`,
        deviceName: `HL${e}NB${i}_test`,
        isConnected: e%2,
        deviceStatus: e%15,
      })),
      "serviceCode": "3.0"
    },
    error:{}
  }
]