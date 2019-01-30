
module.exports = [
  {
    api: '/mock/statisticalAnalysis/MockStationContrast',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [
        {
          'stationName': '洱源',
          'ongridTime': 2018,
          'capacity': 2018,
          'regionName': 2018,
          'unitCount': 2018,
          'resourceValue': 2018,
          'sunshineHours': 2018,
          'tempAvg': 2018,
          'planGen': 2018,
          'genValid': 2018,
          'planFinshRatio': 2018,
          'genInternet': 2018,
          'buyPower': 2018,
          'pr': 2018,
          'cpr': 2018,
          'theoryPower': 2018,
          'equivalentHours': 2018,
          'lostPowerHours': 2018,
          'deviceAvailability': 2018,
          'stationAvailability': 2018,
          'limitPowerHours': 2018,
          'subStationHours': 2018,
          'planShutdownHours': 2018,
          'faultPowerHours': 2018,
          'technicalHours': 2018,
          'courtHours': 2018,
          'limitPowerRate': 2018,
          'plantPowerRate': 2018,
          'comPlantPowerRate': 2018,
          'plantLossRate': 2018,
          'sendLineRate': 2018,
        },
        {
          'stationName': '燕园下大沟',
          'ongridTime': 2018,
          'capacity': 2018,
          'regionName': 2018,
          'unitCount': 2018,
          'resourceValue': 2018,
          'sunshineHours': 2018,
          'tempAvg': 2018,
          'planGen': 2018,
          'genValid': 2018,
          'planFinshRatio': 2018,
          'genInternet': 2018,
          'buyPower': 2018,
          'pr': 2018,
          'cpr': 2018,
          'theoryPower': 2018,
          'equivalentHours': 2018,
          'lostPowerHours': 2018,
          'deviceAvailability': 2018,
          'stationAvailability': 2018,
          'limitPowerHours': 2018,
          'subStationHours': 2018,
          'planShutdownHours': 2018,
          'faultPowerHours': 2018,
          'technicalHours': 2018,
          'courtHours': 2018,
          'limitPowerRate': 2018,
          'plantPowerRate': 2018,
          'comPlantPowerRate': 2018,
          'plantLossRate': 2018,
          'sendLineRate': 2018,
        },

      ],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {
    api: '/mock/statisticalAnalysis/MockStationContrast/detail',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [
        {
          stationName: '洱源',
          year: [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009],
          value: [3009, 2005, 902, 3049, 2055, 962, 379, 285, 9902, 3109],
        },
        {
          stationName: '燕园下大沟',
          year: [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009],
          value: [3009, 2005, 902, 3049, 2055, 962, 379, 285, 9902, 3109],
        },

      ],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {
    api: '/mock/performance/deviceanalysis/conversioneff',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        conversionAvgRate: '50',
        conversionRateData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((e, i) => (
          {
            deviceName: `NB${e}`,
            conversionRate:`${i+30}`
          }

        ))
      },
      "serviceCode": "转化效率"
    }
  }
]
