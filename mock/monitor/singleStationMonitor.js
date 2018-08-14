const moment = require('moment');
module.exports = [
  {
    api: '/mock/api/v3/monitor/station/76',//单电站实时数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "stationPower": "25.30",
        "stationCapacity": "25.30",
        "stationUnitCount": 50,
        "instantaneous": "500",
        "dayResources": "50",
        "dayPower": "678",
        "monthPower": "6780",
        "yearPower": "67890",
        "yearPlanPower": "89076",
        "yearPlanRate": "67%",
        "stationStatus": {
          "stationStatus": "400",
          "stationStatusName": "通讯正常",
          "stationStatusTime": "5",
        },
        "deviceStatus": {
          "deviceStatus": "400",
          "deviceStatusName": "正常",
          "deviceStatusNum": 500,
          "deviceStatusList": {
            "deviceStatus": "400",
            "deviceStatusName": "通讯正常",
            "deviceStatusNum": 400,
          },
        },
        "eqpWorkedHour": "8"

      },
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/station/datalist/',//获取电站列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        "stationId": "123450",
        "stationCode": "4098",
        "stationName": "海兴光伏",
        "stationType": 0,
        "enterpriseCode": "5678",
        "stationCapacity": "678",
        "stationUnitCount": 679,
        "provinceCode": "67890",
        "provinceName": "安徽省",
        "isConnected": 0,
        "longitude": "116.09",
        "latitude": "65.90",
        "countyCode": 67890,
        "countyName": "凤阳县",
      },{
        "stationId": "123450",
        "stationCode": "4098",
        "stationName": "海兴光伏",
        "stationType": 0,
        "enterpriseCode": "5678",
        "stationCapacity": "678",
        "stationUnitCount": 679,
        "provinceCode": "67890",
        "provinceName": "安徽省",
        "isConnected": 0,
        "longitude": "116.09",
        "latitude": "65.90",
        "countyCode": 67890,
        "countyName": "凤阳县",
      },{
        "stationId": "123450",
        "stationCode": "4098",
        "stationName": "海兴光伏",
        "stationType": 0,
        "enterpriseCode": "5678",
        "stationCapacity": "678",
        "stationUnitCount": 679,
        "provinceCode": "67890",
        "provinceName": "安徽省",
        "isConnected": 0,
        "longitude": "116.09",
        "latitude": "65.90",
        "countyCode": 67890,
        "countyName": "凤阳县",
      },{
        "stationId": "123450",
        "stationCode": "4098",
        "stationName": "海兴光伏",
        "stationType": 0,
        "enterpriseCode": "5678",
        "stationCapacity": "678",
        "stationUnitCount": 679,
        "provinceCode": "67890",
        "provinceName": "安徽省",
        "isConnected": 0,
        "longitude": "116.09",
        "latitude": "65.90",
        "countyCode": 67890,
        "countyName": "凤阳县",
      },{
        "stationId": "123450",
        "stationCode": "4098",
        "stationName": "海兴光伏",
        "stationType": 0,
        "enterpriseCode": "5678",
        "stationCapacity": "678",
        "stationUnitCount": 679,
        "provinceCode": "67890",
        "provinceName": "安徽省",
        "isConnected": 0,
        "longitude": "116.09",
        "latitude": "65.90",
        "countyCode": 67890,
        "countyName": "凤阳县",
      }],
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/monitor/capabilitydiagram/76/24',//获取出力图数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(e=>({
        utc: moment().utc().set('hour', e ).format('YYYY-MM-DD HH:mm'),
        localTime: moment().set('hour', e ).format('YYYY-MM-DD HH:mm'),
        stationPower: e*10+'',
        instantaneous: e*100+'',
      })),
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/monitor/power/76/24',//获取理论发电量 实际发电量数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10].map(e=>({
        time: e,
        actualPower: e*5+'',
        theoryPower: e*10+'',
        instantaneous: e*100+'',
      })),
      "serviceCode": "3.0"
    },
  },
]
