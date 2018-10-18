
const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];



module.exports = [
  { // 日报列表
    api: '/mock/operation/dayReport/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "total": 12,
        "list":  [1,2,3,4,5,6].map((e,i)=>({
          stationCode: e,
          stationName: `${i}号电站`,
          userId: `${e}${e+2}${e+5}${e+9}${e*2}${e}${e*7}`,
          dateList: arr.map((e,i)=>({
            reportDate: `${e}`,
            isUpload: !!(e%2),
            status: !!e%2 && !!e%3,
          }))
        }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{ // 选中电站+时间后基础电站报表数据
    api: '/mock/operation/dayReport/baseInfo',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6].map((e,i)=>({
        stationCode: e,
        id: i,
        stationName: `${i}号电站`,
        reportDate: '2018-01-12',
        stationCapacity: e*12-3,
        modelInverterCapacity: e*7,
        modelInverterPowerGen: e*3,
        defectId: `${e}`,
        warning: !!e%2,
        dailyDetailList: [1,2,3].map(e=>({
          id: e,
          dailyReportId: e,
          deviceName: `${e}损失设备123`,
          faultId: e,
          faultName: `${e}就是不发点了`,
          reason: `${e}娃娃设备`,
          startTime: `${e}2017-01-12`,
          endTime: `${e}2017-11-12`,
          process: `${e}啊！蒸菜处理`,
          lostPower: e*17+e*e
        }))
      })),
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
    
  },{ // 日报配置
    api: '/mock/operation/dayReport/config',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        radiation: 'MJ/㎡',
        power: 'kWh',
        speed: 'm/s',
      },{
        internetPowe: '1',
        inverterPower: '1',
        radiation: '1',
        inverterCapacity: '1',
        buyPower: '1',
      },{
        stander: '1'
      }],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{ // 详情
    api: '/mock/operation/dayReport/detail',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        reportDate: '2018-01-12',
        reportId: '112',
        weather: '好天气',
        temperature: '121',
        stationCode: '121',
        stationName: 'zhel',
        stationType: 'fwejl',
        machineCount: 'fewjlfew',
        realCapacity: 'fjewlk',
        resourceValue: 'fewjl',
        genIntegrated: 'sjdkf',
        genInternet: 'sfa',
        genInverter: 'saf',
        equivalentHours: 'saf',
        modelInverterCapacity: 'af',
        modelInverterPowerGen: 'afsa',
        buyPower: 'saf',
        errorInfo: 'afds',
        userName: 'saf',
        userFullName: 'sdfa',
        createTimer: 'sdaf',
        updateTimer: 'sdf',
        faultList: [1,2].map(e=>({
          deviceName: `${e}${e*2}${e*3}`,
          defectId: `${e*3}${e*5}${e*7}`,
          startTime: '2018-01-12',
          endTime: '2018-02-12',
          lostPower: e*1213,
          resean: 'esfjlekw',
          process: 'fjewlkfjeklw',
          faultId: 'sflewkf',
          faultType: 'sjflwejfew',
        })),
        limitList: [1].map(e=>({
          deviceName: `${e}${e*2}${e*3}`,
          startTime: '2018-01-12',
          endTime: '2018-02-12',
          lostPower: e*1213,
          resean: 'esfjlekw',
          limitPower: '0.12',
          faultId: 'sflewkf',
        })),
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{ // 更新日报
    api: '/mock/operation/dayReport/update',
    method: 'put',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{ // 验证设备是否存在
    api: '/mock/operation/dayReport/findDeviceExist',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": ['hhh','112','223'],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{
    api: '/mock/operation/dayReport/getReportUploadedStation',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [380,56,360,54],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
    
  },{
    api: '/mock/operation/dayReport/uploadDayReport',
    method: 'post',
    response: {
      "code": "10000",
      "message": "日报上传成功",
      "data": 'success',
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }
]

