


module.exports = [{
  api: '/mock/api/v3/performance/comprehensive/dataavaliba',
  method: 'post',
  response: {
    "code": "10000",
    "message": "请求成功",
    "data": 
      [
        {"year":'2014',isTrue:'0'},      
        {"year":'2015',isTrue:'1'},
        {"year":'2016',isTrue:'0'},
        {"year":'2017',isTrue:'1'},
        {"year":'2018',isTrue:'1'},
        {"year":'10',isTrue:'1'},
      ],
   
    "serviceCode": "3.0"
  },
  delay: 1000,
  error: {}
},
  {
    api: '/mock/api/v3/performance/comprehensive/plans',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "planSummary": [{
          year: 2018,
          actualPower: '1',
          planPower: '2', 
          rayRadiation: '3', 
          stationAvailability: '4', 
          equivalentHours: '5', 
          lostPower: '6', 
          realCapacity: '7', 
          faultDeviceNum: '8', 
          pr: '2', 
          lostPowerRate: '3', 
          completeRate: '4'
        }],
       
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/statistics',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        statisticsList: [1,2,3,4,5,6,7,8,9,10,11].map((e,i)=>({
          
            yearOrMonth:`${e}`,
            stationCode:`${e}`,
            stationName:`洱源${e}`,
            region:`${e}`,
            planGen:`${e}`,
            genValid:`${e}`,
            planGenRate:`${e}`,
            powerRate:`${e}`,
            resourceValue:`${e}`,
            resourceRate:`${e}`,
            equivalentHours:`${e}`,
            pr:`${e}`,
            lostPower:`${e}`,
            limitPowerHours:`${e}`,
  
  
        
        })),
        pageCount: 11
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/chart/monthOrYear',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,2,3,4,5,6,7,8,9,10,11,12].map((e,i)=>({
        
          thatYearData: `${e+1}00`,
          lastYearData: `${e}00`,
          yearOnYear: `${e}%`,
          month: `${e}月`,
        
      })),

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/piecharts/month/userId/year',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        monthPowerData: [1,2,3,4,5,6,7,8,9,10,11,12].map((e,i)=>({      
          monthPower: `${e}0`,
          monthPalnRate: `${e}%`,       
          month: `${e}月`,       
      })),
        planRate: '20',

      },

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/chart/year',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        thatYearData: '新能源崛起！',
        ringRatio: '2',
        year: 15214449995,
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/plan',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        year: 2017,
        actualPower: '2',
        planPower: '2',
        rayRadiation: '2',
        stationAvailability: '2',
        equivalentHours: '2',
        lostPower: '2',
        realCapacity: '2',
        faultDeviceNum: 6,
        pr: '2',
        lostPowerRate: '5',
        completeRate: '5'
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/chart/year',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        thatYearData: '新能源崛起！',
        lastYearData: '2',
        yearOnYear: '5',
        monthOrDay: 15214449995,
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/piechart/month/{stationCode}/{year}',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        monthPower: '新能源崛起！',
        monthPalnRate: '2',
        month: 15214449995,
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/power/year',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        thatYearData: '新能源崛起！',
        ringRatio: '2',
        year: 15214449995,
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, {
    api: '/mock/api/v3/performance/comprehensive/planrate/years',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [{
        planPower: '新能源崛起！',
        actualPower: '2',
        planRate: '2',
        resourceValue: '2',
        date: 15214449995,
      }],

      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },

]