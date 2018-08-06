
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
        deviceStatus: {
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
        deviceStatus: {
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
        deviceStatus: {
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
      }],
      "serviceCode": "3.0"
    },
    error:{}
  }
]