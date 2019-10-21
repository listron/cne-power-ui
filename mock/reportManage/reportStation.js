const arr = Array(10).fill(2);
module.exports = [
  { // 电站报表列表
    api: '/mock/v3/sun/report/station/list',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        'pageCount': 12,
        'dataList': arr.map((e, i) => {
          return {
            'stationName': `电站${i}`,
            'date': '2019年2月1日',
            'resourceValue': '14800.75',
            'slopeAccRadiationSum': '14800.75',
            'topSunshineHours': '1480.75',
            'theoryPower': '364996.35',
            'genInverter': '364996.35',
            'genIntegrated': '364996.35',
            'genInternet': '364996.35',
            'buyPower': '364996.35',
            'equivalentHours': '8975.35',
            'comPlantPower': '364996.35',
            'complantPowerRate': '12.61',
            'dayPlantUsePower': '364996.35',
            'plantPowerRate': '126.61',
            'genPlantConsume': '364996.35',
            'plantLossRate': '12.61',
            'pvMatrixLossHours': '8975.35',
            'inverterLostEH': '8975.35',
            'integratedLostEH': '8975.35',
            'internetLostEH': '8975.35',
            'outputPowerMax': '36496.35',
            'dayPowerMaxTime': '2019-10-10 12:00:00',
            'comPR': '12.61',
            'stationAvailability': '12.61',
            'markCoal': '36500.00',
            'carbonDioxide': '36500.00',
          };
        }),
      },
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: '电站报表获取失败',
  },
  {//气象站列表-分日分月
    api: '/mock/v3/sun/report/weather/list/day',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        'pageCount': 12,
        'dataList': arr.map((e, i) => {
          return {
            deviceName: '电站电站电站电站电站电站电站电站电站电站电站电站电站' + i,
            date: '2019-10-21',
            temperatureAvg: (Math.random() + 1) * 10000,
            temperatureMax: (Math.random() + 1) * 10000,
            temperatureMin: (Math.random() + 1) * 10000,
            humidityAvg: (Math.random() + 1) * 10000,
            slopeRadiationMax: (Math.random() + 1) * 10000,
            accRadiationMax: (Math.random() + 1) * 10000,
            slopeAccRadiationSum: (Math.random() + 1) * 10000,
            sunshineHours: (Math.random() + 1) * 10000,
            windSpeedMax: (Math.random() + 1) * 10000,
            pressureAvg: (Math.random() + 1) * 10000,
          };
        }),
      },
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: '气象站分月报表获取失败',

  },
  {//气象站列表-分时
    api: '/mock/v3/sun/report/weather/list/min',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        'pageCount': 12,
        'dataList': arr.map((e, i) => {
          return {
            deviceName: '电站电站电站电站电站电站电站电站电站电站电站电站电站' + i,
            date: '2019-10-21',
            temperature: (Math.random() + 1) * 10000,
            humidity: (Math.random() + 1) * 10000,
            part1Temperature: (Math.random() + 1) * 10000,
            part2Temperature: (Math.random() + 1) * 100,
            accRadiationMax: (Math.random() + 1) * 10000,
            slopeRadiationMax: (Math.random() + 1) * 10000,
            accRadiation: (Math.random() + 1) * 10000,
            slopeRadiation: (Math.random() + 1) * 10000,
            windSpeed: (Math.random() + 1) * 10000,
            windDirector: (Math.random() + 1) * 10000,
            pressure: (Math.random() + 1) * 10000,
          };
        }),
      },
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: '气象站分时报表获取失败',

  },



];

