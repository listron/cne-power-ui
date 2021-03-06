const moment = require('moment');
module.exports = [
  {
    api: '/mock/api/v3/monitor/station/360',//单电站实时数据
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
    api: '/mock/api/v3/monitor/capabilitydiagram/360/24',//获取出力图数据
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
    api: '/mock/api/v3/monitor/power/360/0',//获取理论发电量 实际发电量数据
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
  },{
    api: '/mock/api/v3/monitor/power/360/1',//获取理论发电量 实际发电量数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10].map(e=>({
        time: e,
        actualPower: e*10+'',
        theoryPower: e*100+'',
        instantaneous: e*1000+'',
      })),
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/monitor/power/360/2',//获取理论发电量 实际发电量数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10].map(e=>({
        time: e,
        actualPower: e*100+'',
        theoryPower: e*1000+'',
        instantaneous: e*10000+'',
      })),
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/station/user/360',//获取单电站运维人员列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10].map(e=>({
        userId: e,
        userName: '王小'+e,
        userFullName: '王大'+e,
        phoneNum: '188000000'+e,
        roleId: '5678',
        roleName: '运维管理员',
        userStatus: Math.floor(Math.random()*7+1),
      })),
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/monitor/weather/360',//获取单电站未来天气
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7].map(e=>({
        dateDay: moment().format('YYYY-MM-DD'),
        weather: '晴转阴',
        tempHigh: '26',
        tempLow: '17',
        windDirect: '西北风',
      })),
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/alarm/station/alarmNum/360',//获取单电站活动告警数统计
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        oneWarningNum: 10,
        twoWarningNum: 20,
        threeWarningNum: 30,
        fourWarningNum: 40,
      },
      "serviceCode": "3.0"
    },
  },{
    api: '/mock/api/v3/monitor/worklist/360',//获取单电站工单数统计
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        worklistNewNum: 1,
        worklistHandleNum: 2,
        worklistCompleteNum: 3,
      },
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/station/devicetypeflow/360',//获取单电站设备类型流程图(设备示意图)
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [0,1,2,3,4].map(e=>({
        deviceTypeCode: '1000'+e,
        deviceTypeName: '汇流箱'+e,
        sort: e,
      })),
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/monitor/pvmodule/datalist/360',//获取单电站光伏组件列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [0,1,2,3,4,5,6,7,8,9,10].map(e=>({
        deviceId: '1000'+e,
        deviceCode: '00000'+e,
        electricityList: [0,1,2,3,4,5,6,7,8,9,10].map(e=>({
          NB039: '4.0'+e,
          pointStatus: 0,
        })),
      })),
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/monitor/seriesinverter/datalist/360',//获取单电站组串式逆变器列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [0,1,2,3,4,5,6,7,8,9,10].map(e=>({
        deviceId: '1000'+e,
        deviceCode: '00000'+e,
        electricityList: [0,1,2,3,4,5,6,7,8,9,10].map(e=>({
          NB039: '4.0'+e,
          pointStatus: 0,
        })),
      })),
      "serviceCode": "3.0"
    },
  }, {
    api: '/mock/api/v3/monitor/collectorline/datalist',//获取电站集电线路列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [0,1,2,3,4,5,6,7,8,9,10].map(e=>({
        deviceId: `1000${e}`,
        deviceCode: `000000${e}`,
        deviceName: `集电线路${e}`,
        deviceTypeCode: 302,
        deviceTypeName: '集电线路',
        griW: `${parseInt(Math.random()*100)}`,
        griVar: `${parseInt(Math.random()*100)}`,
        griPF: `${parseInt(Math.random()*100)}`,
        griPPhVUab: `${parseInt(Math.random()*100)}`,
        warningStatus: !!e % 2
      })),
      "serviceCode": "3.0"
    },
  }, {
    api: '/mock/api/v3/monitor/boosterstation/datalist',//获取电站升压站列表
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6].map(e => ({
        deviceTypeName: `设备名称${e}`,
        deviceTypeCode: `设备类型编号${e * e}`,
        total: `${e}`,
        warningStatus: !!e % 2
      })),
      "serviceCode": "3.0"
    },
  }, {
    api: '/mock/api/v3/monitor/powercollection/datalist',//获取电网列表数据
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6].map(e => ({
        deviceId: `2000${e}`,
        deviceCode: `100000${e}`,
        deviceName: `电能采集${e}/关口表`,
        deviceTypeCode: 0,
        deviceTypeName: '电网',
        forwardActivePower: `${parseInt(Math.random()*100)}`,
        backwardActivePower: `${parseInt(Math.random()*100)}`,
        forwardReactivePower: `${parseInt(Math.random()*100)}`,
        backwardReactivePower: `${parseInt(Math.random()*100)}`,
        warningStatus: !!e % 2
      })),
      "serviceCode": "3.0"
    },
  },
]
