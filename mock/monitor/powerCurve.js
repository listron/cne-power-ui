
let arr1 = Array(300).fill(1);


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
        powerCurveData: [
          {
            deviceName: 'test1',
            deviceFullCode: '设备编码1',
            theoryPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 3,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 5,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 7,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 9,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 11,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 13,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },],
            sctualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 3,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 5,
                "powerAvg": 64.0,
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 7,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 9,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 11,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 13,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: '16',
                windSpeedCenter: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '25'
              },
            ]
          },
          {
            deviceName: 'test2',
            deviceFullCode: '设备编码2',
            theoryPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 1,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 3,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 5,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 7,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 9,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 11,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },],
            sctualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 3,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 5,
                "powerAvg": 64.0,
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 7,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 9,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 11,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 13,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '25'
              },
            ]
          },
          {
            deviceName: 'test3',
            deviceFullCode: '设备编码3',
            theoryPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 3,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 5,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 7,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 9,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 11,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 13,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerTheory": parseFloat(Math.random() * 500).toFixed(2),
              },],
            sctualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedCenter: 3,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedCenter: 5,
                "powerAvg": 64.0,
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedCenter: 7,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedCenter: 9,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedCenter: 11,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedCenter: 13,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedCenter: 15,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedCenter: 17,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                "windSpeedAvg": parseFloat(Math.random() * 25).toFixed(2),
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windSpeedCenter: '25'
              },
            ]
          },
        ]
      },
      serviceCode: '3.0'
    },
    error: {}
  },
  { // 功率曲线图表-风向玫瑰图-单风机
    api: '/mock/wind/powercurve/fan/windrosechart',
    method: 'get',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          windDirection: 'N',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'NNW',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'W',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'S',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'SSE',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'SE',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'ESE',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'ENE',
          windSpeedAvg: '30',
          percent: '10',
        },

      ]
    },
    error: {}
  },
  { //	功率曲线图表-功率&转速-单风机
    api: '',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          deviceName: 'test1',
          deviceFullCode: '设备名称1',
          powerSpeedData: arr1.map((i, index) => {
            return {
              speed: parseFloat(Math.random() * 25+1).toFixed(2),
              power:parseFloat(Math.random() * 1000+1).toFixed(2),
              time:new Date()
            }
          })
        },
        {
          deviceName: 'test2',
          deviceFullCode: '设备名称2',
          powerSpeedData: arr1.map((i, index) => {
            return {
              speed: parseFloat(Math.random() * 25+1).toFixed(2),
              power:parseFloat(Math.random() * 1000+1).toFixed(2),
              time:new Date()
            }
          })
        },
        {
          deviceName: 'test3',
          deviceFullCode: '设备名称3',
          powerSpeedData: arr1.map((i, index) => {
            return {
              speed: parseFloat(Math.random() * 25+1).toFixed(2),
              power:parseFloat(Math.random() * 1000+1).toFixed(2),
              time:new Date()
            }
          })
        },
      ]
      
    }

  }
]
