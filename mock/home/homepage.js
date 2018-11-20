


module.exports = [
  {
    api:'/mock/homepage/total',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        enterpriseName: '协合新能源',
        windReourse: '4.78',
        pvResource: '448',
        windStationPower: '145',
        pvStationPower: '78',
        allStationPower: '223',
        windSummary: {
          stationUnitCount: 12, // 装机台数
          stationCapacity: '1410',
          stationCount: 87,
          dayPower: '112',
          monthPower: '850',
          yearPower: '9400',
        },
        pvSummary:{
          stationUnitCount: 88, // 装机台数
          stationCapacity: '110',
          stationCount: 97,
          dayPower: '87',
          monthPower: '1010',
          yearPower: '14400',
        },
        allSummary:{
          stationUnitCount: 111, // 装机台数
          stationCapacity: '971',
          stationCount: 201,
          dayPower: '870',
          monthPower: '9100',
          yearPower: '117841',
        },
        deviceStatus:{
          windDeviceStatus:[
            {deviceStatus: '100', deviceStatusName: '正常', deviceStatusNum: 87},
            {deviceStatus: '200', deviceStatusName: '停机', deviceStatusNum: 4},
            {deviceStatus: '300', deviceStatusName: '故障', deviceStatusNum: 1},
            {deviceStatus: '900', deviceStatusName: '中断', deviceStatusNum: 10},
          ],
          pvDeviceStatus: [
            {deviceStatus: '100', deviceStatusName: '正常', deviceStatusNum: 37},
            {deviceStatus: '200', deviceStatusName: '停机', deviceStatusNum: 12},
            {deviceStatus: '300', deviceStatusName: '故障', deviceStatusNum: 2},
            {deviceStatus: '900', deviceStatusName: '中断', deviceStatusNum: 0},
          ],
          allDeviceStatus: [
            {deviceStatus: '100', deviceStatusName: '正常', deviceStatusNum: 117},
            {deviceStatus: '200', deviceStatusName: '停机', deviceStatusNum: 11},
            {deviceStatus: '300', deviceStatusName: '故障', deviceStatusNum: 0},
            {deviceStatus: '900', deviceStatusName: '中断', deviceStatusNum: 7},
          ],
        },
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/complete',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        windYearRate: '81.25',
        windMonthRate: '71.55',
        PVYearRate: '92.17',
        PVMonthRate: '90.1',
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/monthGen',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
        month: e,
        power: `${parseInt(Math.random()*100)}`,
        rate: `${e/2}`
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/eqpHour',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        average: '7.98',
        hourList: [
          { stationName: '富川', average: 4.57 },
          { stationName: '朝东', average: 8.57 },
          { stationName: '刚写', average: 14.57 },
          { stationName: '接口', average: 4.57 },
          { stationName: '大半', average: 4.57 },
        ]
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/faultNumber',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [
        {stationName: '富川', number: 4.57, monthList: [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
          month: e, number: e*Math.random()*10,
        }))},
        {stationName: '朝东', number: 8.57, monthList: [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
          month: e, number: e*Math.random()*10,
        }))},
        {stationName: '刚写', number: 14.57, monthList: [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
          month: e, number: e*Math.random()*10,
        }))},
        {stationName: '接口', number: 4.57, monthList: [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
          month: e, number: e*Math.random()*10,
        }))},
        {stationName: '大半', number: 4.57, monthList: [1,2,3,4,5,6,7,8,10,11,12].map(e=>({
          month: e, number: e*Math.random()*10,
        }))},
      ],
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/alarm',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5].map(e=>({
        stationName: `随机电站${e}`,
        level: e,
        description: `随机内容${e*e}`,
        duration: e**e,
        count: e*12
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/saving',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        dioxide: '1142',
        coal: '1212',
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/operation',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        doing: '1142',
        done: '1212',
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/map',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,3,4,5,6,8,12,1,21,123,10].map(e=>({
        stationCode: e,
        stationName: `随机电站${e}`,
        stationType: e%2,
        longitude: Math.random()*100,
        latitude: Math.random()*100,
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/output',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11].map(e=>({
        utc: e,
        stationPower: e*10,
        instantaneous: e*e,
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/homepage/singleStation',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        stationName: '电站1',
        stationType: 0,
        stationPower: '1234',
        stationCapacity: '1122',
        dayPower: '1231',
        monthPower: '12113',
        yearPower: '4535654',
        stationStatus: {
          statusCode: 200,
          statusName: '正常啊！'
        }
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }

]