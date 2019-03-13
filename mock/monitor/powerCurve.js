

module.exports = [
  { // 功率曲线图表-多风机
    api: '/mock/wind/powercurve/fans/chart',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((e, i) => {
        return {
          deviceName: `testName${i}`,
          deviceFullCode: `testCode${i}`,
          dataList: [1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => (
            {
              windSpeedCenter: parseFloat(Math.random() * 20).toFixed(2),
              windSpeedInterval: parseFloat(Math.random() * 20).toFixed(2),
              windSpeedAvg: parseFloat(Math.random() * 20).toFixed(2),
              powerAvg: parseFloat(Math.random() * 2000).toFixed(2),
            }))
        }
      })
    },
    error: {}
  },
  { // 功率曲线列表-单风机
    api: '/mock/wind/powercurve/fan/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        pageCount: 9,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => ({
          deviceName: `测试设备${e}`,
          stationName: `电站${e * e}`,
          deviceModeName: `型号${e * 9}`,
          windSpeedCenter: parseFloat(Math.random() * 20).toFixed(2),
          windSpeedAvg: parseFloat(Math.random() * 20).toFixed(2),
          powerAvg: parseFloat(Math.random() * 20).toFixed(2),
          powerTheory: parseFloat(Math.random() * 100).toFixed(2),
          frequency: parseFloat(Math.random() * 100).toFixed(2),
        }))
      },
      "serviceCode": "3.0"
    },
    error: {}
  },
  { // 功率曲线图表-功率曲线-单风机
    api: '/mock/wind/powercurve/fan/powercurvechart',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        airDensity: 9,
        powerCurveData: {
          theoryPowerData: [
            {
              windSpeedInterval: '5.25-12.25',
              windSpeedCenter: 3,
              "powerTheory": 32.0,
            },
            {
              windSpeedInterval: '12.25-14.25',
              windSpeedCenter: 5,
              "powerTheory": 64.0,
            },
            {
              windSpeedInterval: '14.25-16.15',
              windSpeedCenter: 7,
              "powerTheory": 106.0,
            },
            {
              windSpeedInterval: '16.25-18.25',
              windSpeedCenter: 9,
              "powerTheory": 161.0,
            },
            {
              windSpeedInterval: '18.25-10.25',
              windSpeedCenter: 11,
              "powerTheory": 232.0,
            },
            {
              windSpeedInterval: '20.25-22.25',
              windSpeedCenter: 13,
              "powerTheory": 322.0,
            },
            {
              windSpeedInterval: '22.25-24.25',
              windSpeedCenter: 15,
              "powerTheory": 431.0,
            },
            {
              windSpeedInterval: '24.25-25.25',
              windSpeedCenter: 17,
              "powerTheory": 562.0,
            },],
          deviceData: [1,2,3,4,5,6,7,8,9].map((e)=>{
             return {
              deviceName:'test'+e,
              deviceFullCode:'设备编码'+e,
              sctualPowerData: [
                {
                  windSpeedInterval: '5.25-12.25',
                  windSpeedCenter: 3,
                  "powerAvg": 32.0,
                  "windSpeedAvg": 2.5,
                },
                {
                  windSpeedInterval: '12.25-14.25',
                  windSpeedCenter: 5,
                  "powerAvg": 64.0,
                  "windSpeedAvg": 3.0,
                },
                {
                  windSpeedInterval: '14.25-16.15',
                  windSpeedCenter: 7,
                  "powerAvg": 106.0,
                  "windSpeedAvg": 3.5
                },
                {
                  windSpeedInterval: '16.25-18.25',
                  windSpeedCenter: 9,
                  "powerAvg": 161.0,
                  "windSpeedAvg": 4.0
                },
                {
                  windSpeedInterval: '18.25-10.25',
                  windSpeedCenter: 11,
                  "powerAvg": 232.0,
                  "windSpeedAvg": 4.5
                },
                {
                  windSpeedInterval: '20.25-22.25',
                  windSpeedCenter: 13,
                  "powerAvg": 322.0,
                  "windSpeedAvg": 5.0
                },
                {
                  windSpeedInterval: '22.25-24.25',
                  windSpeedCenter: 15,
                  "powerAvg": 431.0,
                  "windSpeedAvg": 5.5
                },
                {
                  windSpeedInterval: '24.25-25.25',
                  windSpeedCenter: 17,
                  "powerAvg": 562.0,
                  "windSpeedAvg": 6.0
                },],
              scatterPointData: [
                {
                  time:new Date(),
                  windSpeedAvg:'2',
                  powerActual:'3',
                  windSpeedCenter:'5'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'5',
                  powerActual:'10',
                  windSpeedCenter:'10'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'10',
                  powerActual:'16',
                  windSpeedCenter:'12'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'12',
                  powerActual:'18',
                  windSpeedCenter:'15'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'14',
                  powerActual:'20',
                  windSpeedCenter:'17'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'16',
                  powerActual:'22',
                  windSpeedCenter:'18'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'18',
                  powerActual:'24',
                  windSpeedCenter:'20'
                },
                {
                  time:new Date(),
                  windSpeedAvg:'20',
                  powerActual:'25',
                  windSpeedCenter:'25'
                },
    
              ]    
             }
          }),
        }
      },
      serviceCode: '3.0'
    },
    error: {}
  }, { // 功率曲线图表-风向玫瑰图-单风机
    api: '/mock/wind/powercurve/fan/windrosechart',
    method: 'get',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          windDirection:'N',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'NNW',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'W',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'S',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'SSE',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'SE',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'ESE',
          windSpeedAvg:'30',
          percent:'10',
        },
        {
          windDirection:'ENE',
          windSpeedAvg:'30',
          percent:'10',
        },

      ]
    },
    error: {}
  },
]
