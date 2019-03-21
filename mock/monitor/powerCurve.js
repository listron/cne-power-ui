
let arr1 = Array(100).fill(1);


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
            actualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedAvg: 3,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedAvg: 5,
                "powerAvg": 64.0,
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedAvg: 7,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedAvg: 9,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedAvg: 11,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedAvg: 13,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedAvg: 15,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedAvg: 17,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: '16',
                windDirection: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '25'
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
            actualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 3,
              },
              {
                windSpeedInterval: '12.25-14.25',
                "powerAvg": 64.0,
                  windSpeedAvg: 5,
              },
              {
                windSpeedInterval: '14.25-16.15',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 7,
              },
              {
                windSpeedInterval: '16.25-18.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 9,
              },
              {
                windSpeedInterval: '18.25-10.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 11,
              },
              {
                windSpeedInterval: '20.25-22.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 13,
              },
              {
                windSpeedInterval: '22.25-24.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 15,
              },
              {
                windSpeedInterval: '24.25-25.25',
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
                  windSpeedAvg: 17,
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '25'
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
            actualPowerData: [
              {
                windSpeedInterval: '5.25-12.25',
                windSpeedAvg: 3,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '12.25-14.25',
                windSpeedAvg: 5,
                "powerAvg": 64.0,
               
              },
              {
                windSpeedInterval: '14.25-16.15',
                windSpeedAvg: 7,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '16.25-18.25',
                windSpeedAvg: 9,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '18.25-10.25',
                windSpeedAvg: 11,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '20.25-22.25',
                windSpeedAvg: 13,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '22.25-24.25',
                windSpeedAvg: 15,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },
              {
                windSpeedInterval: '24.25-25.25',
                windSpeedAvg: 17,
                "powerAvg": parseFloat(Math.random() * 500).toFixed(2),
               
              },],
            scatterPointData: [
              {
                time: new Date(),
                windSpeedAvg: '2',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '5'
              },
              {
                time: new Date(),
                windSpeedAvg: '5',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '10'
              },
              {
                time: new Date(),
                windSpeedAvg: '10',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '12'
              },
              {
                time: new Date(),
                windSpeedAvg: '12',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '15'
              },
              {
                time: new Date(),
                windSpeedAvg: '14',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '17'
              },
              {
                time: new Date(),
                windSpeedAvg: '16',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '18'
              },
              {
                time: new Date(),
                windSpeedAvg: '18',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '20'
              },
              {
                time: new Date(),
                windSpeedAvg: '20',
                powerActual: parseFloat(Math.random() * 500).toFixed(2),
                windDirection: '25'
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
          windDirection: 'NW',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'WNW',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'W',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'WSW',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'SW',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'SSW',
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
          windDirection: 'E',
          windSpeedAvg: '30',
          percent: '10',
        }, {
          windDirection: 'ENE',
          windSpeedAvg: '30',
          percent: '10',
        }, {
          windDirection: 'NE',
          windSpeedAvg: '30',
          percent: '10',
        },
        {
          windDirection: 'NNE',
          windSpeedAvg: '30',
          percent: '10',
        },
      ]
    },
    error: {}
  },
  { //	功率曲线图表-功率&转速-单风机
    api: '/mock//wind/powercurve/fan/powerspeedchart',
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
              speed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              power: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
        {
          deviceName: 'test2',
          deviceFullCode: '设备名称2',
          powerSpeedData: arr1.map((i, index) => {
            return {
              speed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              power: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
        {
          deviceName: 'test3',
          deviceFullCode: '设备名称3',
          powerSpeedData: arr1.map((i, index) => {
            return {
              speed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              power: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
      ]

    }

  },
  { // 功率曲线图表-桨距角&风速-单风机
    api: '/mock/wind/powercurve/fan/pitchanglespeedchart',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          deviceName: 'test1',
          deviceFullCode: '设备名称1',
          pitChangleSpeedData: arr1.map((i, index) => {
            return {
              windSpeed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              pitchangle: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
        {
          deviceName: 'test2',
          deviceFullCode: '设备名称2',
          pitChangleSpeedData: arr1.map((i, index) => {
            return {
              windSpeed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              pitchangle: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
        {
          deviceName: 'test3',
          deviceFullCode: '设备名称3',
          pitChangleSpeedData: arr1.map((i, index) => {
            return {
              windSpeed: parseFloat(Math.random() * 25 + 1).toFixed(2),
              pitchangle: parseFloat(Math.random() * 1000 + 1).toFixed(2),
              time: new Date()
            }
          })
        },
      ]

    }

  },
  { // 功率曲线图表-风频分布-单风机
    api: '/mock/wind/powercurve/fan/winddistributionchart',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: Array(10).fill(1).map(e => {
        return {
          windSpeedCenter: parseFloat(Math.random() * 25 + 1).toFixed(2),
          percent: parseFloat(Math.random() * 100 + 1).toFixed(2),
        }
      })
    }
  },
  { // 	功率曲线图表-时序图-单风机
    api: '/mock/wind/powercurve/fan/sequencechart',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data:[
        {
          deviceName: 'test1',
          deviceFullCode: ' 设备编码1',
          sequenceChartData: [
            {
              "time": "2019-03-13T06:10:00Z",
              "windSpeed": "6.38"
            }, {
              "time": "2019-03-13T06:20:00Z",
              "windSpeed": "6.6"
            }, {
              "time": "2019-03-13T06:30:00Z",
              "windSpeed": "6.29"
            }, {
              "time": "2019-03-13T06:40:00Z",
              "windSpeed": "5.83"
            }, {
              "time": "2019-03-13T06:50:00Z",
              "windSpeed": "5.86"
            }, {
              "time": "2019-03-13T07:00:00Z",
              "windSpeed": "5.82"
            }, {
              "time": "2019-03-13T07:10:00Z",
              "windSpeed": "4.61"
            }, {
              "time": "2019-03-13T07:20:00Z",
              "windSpeed": "5.27"
            }, {
              "time": "2019-03-13T07:30:00Z",
              "windSpeed": "3.92"
            }, {
              "time": "2019-03-13T07:40:00Z",
              "windSpeed": "3.57"
            }, {
              "time": "2019-03-13T07:50:00Z",
              "windSpeed": "3.95"
            }, {
              "time": "2019-03-13T08:00:00Z",
              "windSpeed": "3.68"
            }, {
              "time": "2019-03-13T08:10:00Z",
              "windSpeed": "2.69"
            }, {
              "time": "2019-03-13T08:20:00Z",
              "windSpeed": "2.18"
            }, {
              "time": "2019-03-13T08:30:00Z",
              "windSpeed": "2.12"
            }, {
              "time": "2019-03-13T08:40:00Z",
              "windSpeed": "1.51"
            }, {
              "time": "2019-03-13T08:50:00Z",
              "windSpeed": "1.14"
            }, {
              "time": "2019-03-13T09:00:00Z",
              "windSpeed": "6.25"
            }, {
              "time": "2019-03-13T09:10:00Z",
              "windSpeed": "3.54"
            }, {
              "time": "2019-03-13T09:20:00Z",
              "windSpeed": "5.39"
            }, {
              "time": "2019-03-13T09:30:00Z",
              "windSpeed": "5.14"
            }, {
              "time": "2019-03-13T09:40:00Z",
              "windSpeed": "6.25"
            }, {
              "time": "2019-03-13T09:50:00Z",
              "windSpeed": "5.17"
            }, {
              "time": "2019-03-13T10:00:00Z",
              "windSpeed": "7.46"
            }, {
              "time": "2019-03-13T10:10:00Z",
              "windSpeed": "5.04"
            }, {
              "time": "2019-03-13T10:20:00Z",
              "windSpeed": "5.08"
            }, {
              "time": "2019-03-13T10:30:00Z",
              "windSpeed": "5.36"
            }, {
              "time": "2019-03-13T10:40:00Z",
              "windSpeed": "6.75"
            }, {
              "time": "2019-03-13T10:50:00Z",
              "windSpeed": "7.46"
            }, {
              "time": "2019-03-13T11:00:00Z",
              "windSpeed": "9.57"
            }, {
              "time": "2019-03-13T11:10:00Z",
              "windSpeed": "8.42"
            }, {
              "time": "2019-03-13T11:20:00Z",
              "windSpeed": "9.57"
            }, {
              "time": "2019-03-13T11:30:00Z",
              "windSpeed": "9.03"
            }, {
              "time": "2019-03-13T11:40:00Z",
              "windSpeed": "8.05"
            }, {
              "time": "2019-03-13T11:50:00Z",
              "windSpeed": "7.83"
            }, {
              "time": "2019-03-13T12:00:00Z",
              "windSpeed": "9.6"
            }, {
              "time": "2019-03-13T12:10:00Z",
              "windSpeed": "9.6"
            }, {
              "time": "2019-03-13T12:20:00Z",
              "windSpeed": "7.29"
            }, {
              "time": "2019-03-13T12:30:00Z",
              "windSpeed": "7.18"
            }, {
              "time": "2019-03-13T12:40:00Z",
              "windSpeed": "8.53"
            }, {
              "time": "2019-03-13T12:50:00Z",
              "windSpeed": "9.33"
            }, {
              "time": "2019-03-13T13:00:00Z",
              "windSpeed": "10.38"
            },]
        },
        
        { deviceName: 'test3',
          deviceFullCode: ' 设备编码3',
          sequenceChartData: [
            {
              "time": "2019-03-13T20:40:00Z",
              "windSpeed": "2.83"
            }, {
              "time": "2019-03-13T20:50:00Z",
              "windSpeed": "2.53"
            }, {
              "time": "2019-03-13T21:00:00Z",
              "windSpeed": "3.14"
            }, {
              "time": "2019-03-13T21:10:00Z",
              "windSpeed": "2.73"
            }, {
              "time": "2019-03-13T21:20:00Z",
              "windSpeed": "2.6"
            }, {
              "time": "2019-03-13T21:30:00Z",
              "windSpeed": "2.15"
            }, {
              "time": "2019-03-13T21:40:00Z",
              "windSpeed": "3.14"
            }, {
              "time": "2019-03-13T21:50:00Z",
              "windSpeed": "3.03"
            }, {
              "time": "2019-03-13T22:00:00Z",
              "windSpeed": "4.43"
            }, {
              "time": "2019-03-13T22:10:00Z",
              "windSpeed": "2.66"
            }, {
              "time": "2019-03-13T22:20:00Z",
              "windSpeed": "4.2"
            }, {
              "time": "2019-03-13T22:30:00Z",
              "windSpeed": "3.99"
            }, {
              "time": "2019-03-13T22:40:00Z",
              "windSpeed": "3.3"
            }, {
              "time": "2019-03-13T22:50:00Z",
              "windSpeed": "4.43"
            }, {
              "time": "2019-03-13T23:00:00Z",
              "windSpeed": "6.68"
            }, {
              "time": "2019-03-13T23:10:00Z",
              "windSpeed": "4.72"
            }, {
              "time": "2019-03-13T23:20:00Z",
              "windSpeed": "5.08"
            }, {
              "time": "2019-03-13T23:30:00Z",
              "windSpeed": "6.68"
            }, {
              "time": "2019-03-13T23:40:00Z",
              "windSpeed": "6.64"
            }, {
              "time": "2019-03-13T23:50:00Z",
              "windSpeed": "5.78"
            }, {
              "time": "2019-03-14T00:00:00Z",
              "windSpeed": "6.34"
            }, {
              "time": "2019-03-14T00:10:00Z",
              "windSpeed": "5.65"
            }, {
              "time": "2019-03-14T00:20:00Z",
              "windSpeed": "5.59"
            }, {
              "time": "2019-03-14T00:30:00Z",
              "windSpeed": "5.33"
            }, {
              "time": "2019-03-14T00:40:00Z",
              "windSpeed": "3.76"
            }, {
              "time": "2019-03-14T00:50:00Z",
              "windSpeed": "3.29"
            }, {
              "time": "2019-03-14T01:00:00Z",
              "windSpeed": "4.44"
            }, {
              "time": "2019-03-14T01:10:00Z",
              "windSpeed": "4.03"
            }, {
              "time": "2019-03-14T01:20:00Z",
              "windSpeed": "4.44"
            }, {
              "time": "2019-03-14T01:30:00Z",
              "windSpeed": "3.28"
            }, {
              "time": "2019-03-14T01:40:00Z",
              "windSpeed": "3.07"
            }, {
              "time": "2019-03-14T01:50:00Z",
              "windSpeed": "2.85"
            }, {
              "time": "2019-03-14T02:00:00Z",
              "windSpeed": "3.51"
            }, {
              "time": "2019-03-14T02:10:00Z",
              "windSpeed": "2.61"
            }, {
              "time": "2019-03-14T02:20:00Z",
              "windSpeed": "2.8"
            }, {
              "time": "2019-03-14T02:30:00Z",
              "windSpeed": "3.48"
            }, {
              "time": "2019-03-14T02:40:00Z",
              "windSpeed": "2.95"
            }, {
              "time": "2019-03-14T02:50:00Z",
              "windSpeed": "3.51"
            }, {
              "time": "2019-03-14T03:00:00Z",
              "windSpeed": "4.72"
            }, {
              "time": "2019-03-14T03:10:00Z",
              "windSpeed": "3.73"
            }, {
              "time": "2019-03-14T03:20:00Z",
              "windSpeed": "3.55"
            }, {
              "time": "2019-03-14T03:30:00Z",
              "windSpeed": "4.44"
            }, {
              "time": "2019-03-14T03:40:00Z",
              "windSpeed": "4.72"
            }, {
              "time": "2019-03-14T03:50:00Z",
              "windSpeed": "4.53"
            }, {
              "time": "2019-03-14T04:00:00Z",
              "windSpeed": "6.37"
            }, {
              "time": "2019-03-14T04:10:00Z",
              "windSpeed": "4.66"
            }, {
              "time": "2019-03-14T04:20:00Z",
              "windSpeed": "4.47"
            }, {
              "time": "2019-03-14T04:30:00Z",
              "windSpeed": "5.53"
            }, {
              "time": "2019-03-14T04:40:00Z",
              "windSpeed": "5.68"
            }, {
              "time": "2019-03-14T04:50:00Z",
              "windSpeed": "6.37"
            }, {
              "time": "2019-03-14T05:00:00Z",
              "windSpeed": "6.95"
            }, {
              "time": "2019-03-14T05:10:00Z",
              "windSpeed": "5.65"
            }, {
              "time": "2019-03-14T05:20:00Z",
              "windSpeed": "6.95"
            }, {
              "time": "2019-03-14T05:30:00Z",
              "windSpeed": "5.46"
            }, {
              "time": "2019-03-14T05:40:00Z",
              "windSpeed": "5.8"
            }, {
              "time": "2019-03-14T05:50:00Z",
              "windSpeed": null
            }]
        }
      ]
    }
  }
]
