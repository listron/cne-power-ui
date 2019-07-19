let stationList = [];
for (let i = 0; i < 400; i++) {
  stationList.push({
    "stationCode": i,
    "anomalousBranchNum": "10",
    "loadRate": "30.171421293937852776",
    "regionName": "山东",
    "latitude": "37.090833000000",
    "alarmNum": i,
    "yearPower": "69866871",
    "dayResources": "25.884174",
    "instantaneous": "397.8",
    "sort": "10301",
    "lowEfficiencyInverterNum": "9",
    "dayPower": Math.random() * 1000,
    "yearPlanPower": "53000000.0000",
    "stationPower": Math.random() * 1000,
    "equivalentHours": 400 - i,
    "stationUnitCount": "74",
    "stationStatus": 500,
    "stationName": "山东平原" + i,
    "provinceName": "山东省",
    "monthPower": Math.random() * 10000,
    "yearPlanRate": "131.824284905660377358",
    "lowEffType": 1,
    "stationCapacity": "39.26",
    "longitude": "116.326000000000"
  })
}

let capStationList = [];
for (let i = 0; i < 400; i++) {
  capStationList.push({
    stationCode: i,
    chartData: [{
      "utc": "2019-07-11T16:00:00Z",
      "stationPower": "4",
      "instantaneous": "676"
    },
    {
      "utc": "2019-07-11T16:10:00Z",
      "stationPower": "4",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T16:20:00Z",
      "stationPower": "4",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T16:30:00Z",
      "stationPower": "10",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T16:40:00Z",
      "stationPower": "345",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T16:50:00Z",
      "stationPower": "789",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:00:00Z",
      "stationPower": "45",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:30:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:40:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T17:50:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:00:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:30:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:40:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T18:50:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:00:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:30:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:40:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T19:50:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:00:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:30:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:40:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T20:50:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:00:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:30:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:40:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T21:50:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T22:00:00Z",
      "stationPower": "33.32495291902074",
      "instantaneous": "2.943013182674197"
    },
    {
      "utc": "2019-07-11T22:10:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T22:20:00Z",
      "stationPower": "0.0",
      "instantaneous": "0.0"
    },
    {
      "utc": "2019-07-11T22:30:00Z",
      "stationPower": "0.1572687224669604",
      "instantaneous": "1.548414096916301"
    },
    {
      "utc": "2019-07-11T22:40:00Z",
      "stationPower": "20.38541666666668",
      "instantaneous": "5.031510416666661"
    },
    {
      "utc": "2019-07-11T22:50:00Z",
      "stationPower": "167.24148936170238",
      "instantaneous": "9.616702127659586"
    },
    {
      "utc": "2019-07-11T23:00:00Z",
      "stationPower": "1735.8551724137915",
      "instantaneous": "46.246279069767425"
    },
    {
      "utc": "2019-07-11T23:10:00Z",
      "stationPower": "384.8740740740742",
      "instantaneous": "16.05703703703704"
    },
    {
      "utc": "2019-07-11T23:20:00Z",
      "stationPower": "1174.4801020408154",
      "instantaneous": "34.998622448979546"
    },
    {
      "utc": "2019-07-11T23:30:00Z",
      "stationPower": "1861.8586666666658",
      "instantaneous": "49.087155555555576"
    },
    {
      "utc": "2019-07-11T23:40:00Z",
      "stationPower": "2756.9424390243917",
      "instantaneous": "68.72556097560988"
    },
    {
      "utc": "2019-07-11T23:50:00Z",
      "stationPower": "3549.5648648648767",
      "instantaneous": "86.34234234234232"
    },
    {
      "utc": "2019-07-12T00:00:00Z",
      "stationPower": "6563.248142164797",
      "instantaneous": "153.99806138933764"
    },
    {
      "utc": "2019-07-12T00:10:00Z",
      "stationPower": "4327.262500000001",
      "instantaneous": "103.05000000000007"
    },
    {
      "utc": "2019-07-12T00:20:00Z",
      "stationPower": "5553.863636363638",
      "instantaneous": "132.91161616161622"
    },
    {
      "utc": "2019-07-12T00:30:00Z",
      "stationPower": "6456.382653061216",
      "instantaneous": "152.48265306122445"
    },
    {
      "utc": "2019-07-12T00:40:00Z",
      "stationPower": "7747.158937198068",
      "instantaneous": "178.09951690821288"
    },
    {
      "utc": "2019-07-12T00:50:00Z",
      "stationPower": "11007.557476635511",
      "instantaneous": "254.34485981308393"
    },
    {
      "utc": "2019-07-12T01:00:00Z",
      "stationPower": "13528.825872873816",
      "instantaneous": "302.8564010743065"
    },
    {
      "utc": "2019-07-12T01:10:00Z",
      "stationPower": "12484.841999999993",
      "instantaneous": "288.75399999999985"
    },
    {
      "utc": "2019-07-12T01:20:00Z",
      "stationPower": "15655.016101694906",
      "instantaneous": "358.9860169491521"
    },
    {
      "utc": "2019-07-12T01:30:00Z",
      "stationPower": "12838.46830357145",
      "instantaneous": "295.98571428571444"
    },
    {
      "utc": "2019-07-12T01:40:00Z",
      "stationPower": "12984.193396226421",
      "instantaneous": "251.30283018867948"
    },
    {
      "utc": "2019-07-12T01:50:00Z",
      "stationPower": "15907.499126637542",
      "instantaneous": "372.56419213973766"
    },
    {
      "utc": "2019-07-12T02:00:00Z",
      "stationPower": "17484.94393939395",
      "instantaneous": "420.962121212121"
    },
    {
      "utc": "2019-07-12T02:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T02:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T02:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T02:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T02:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T03:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T04:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T05:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T06:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T07:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T08:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:30:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:40:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T09:50:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T10:00:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T10:10:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T10:20:00Z",
      "stationPower": null,
      "instantaneous": null
    },
    {
      "utc": "2019-07-12T10:30:00Z",
      "stationPower": null,
      "instantaneous": null
    }]
  })
}

module.exports = [
  {//多电站数据列表
    api: '/mock/v3/monitor/stations/stationType',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "stationDataSummary": {
          "stationPower": '333',
          "stationCapacity": '4444',
          "stationUnitCount": 3,
          "instantaneous": `${Math.floor(Math.random() * 20)}`,
          "dayPower": '4',
          "monthPower": '150',
          "yearPower": '40000',
          "yearPlanPower": '49999',
          "yearPlanRate": `${(40000 / 49999 * 100).toFixed(2)}%`,

          "stationStatusSummary": [
            {
              "stationStatus": 400,
              "stationStatusName": '通讯正常',
              "stationNum": 800,
            }, {
              "stationStatus": 500,
              "stationStatusName": '信息中断',
              "stationNum": 500,
            }, {
              "stationStatus": 900,
              "stationStatusName": '未接入',
              "stationNum": 300,
            }
          ],
          "stationProvinceSummary": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((e, i) => (
            {
              "provinceCode": `${i * 3 + 4}`,
              "provinceName": `我是${i * 3 + 4}省`,
              "windStationNum": i * 3 + 4,
              "lightStationNum": i * 2
            }
          )),
          "stationTypeSummary": [
            { "windStationNum": 600 },
            { "lightStationNum": 700 }

          ]

        },
        "stationDataList": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 22, 33, 44, 55].map((e, i) => (
          {
            "stationCode": `${i + 1}`,
            "stationName": `圣经山${i + 1}`,
            "stationType": `${Math.floor(Math.random() * 2)}`,
            "provinceName": `河北${i + 1}`,
            "instantaneous": `${i + 1}`,
            "dayResources": `${i + 1}`,
            "stationPower": `${i + 1}9`,
            "stationCapacity": `${i + 1}00`,
            "stationUnitCount": `${i + 1}2`,
            "longitude": `${i + 120.35}`,
            "latitude": `${i + 37.35}`,
            "alarmNum": Math.floor(Math.random() * 3),
            "dayPower": `${i + 5}`,
            "monthPower": `${(i + 5) * 30}`,
            "yearPower": `${(i + 5) * 365}`,
            "yearPlanPower": `${(i + 5) * (400 + i)}`,
            "yearPlanRate": `${365 / (400 + i) * 100}`,
            "stationStatus": {
              "stationStatus": `${i < 9 ? i > 4 ? 5 : 4 : 9}00`,
              "stationStatusName": `${i < 9 ? i > 4 ? '中断' : '正常' : '未接入'}`
            },
            // "deviceStatus": [
            //   {
            //     "deviceStatus": `${i<9?i>4?2:1:3}00`,
            //     "deviceStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`,
            //     "deviceStatusNum": i+5,
            //     "deviceStatusList": [
            //       {
            //         "deviceStatus": `${i<9?i>4?2:1:3}`,
            //         "deviceStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`,
            //         "deviceStatusNum": i+5
            //       }
            //     ]
            //   }
            // ]
          }

        ))

      },
      "serviceCode": "3.0"
    },

  }, {
    api: '/mock/v3/station/monitor/conf',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        realTimePower: ['kW', '2'],
        realCapacity: ['kW', '2'],
        power: ['kWh', '4'],
      }
    }
  },
  {
    api: '/mock/api/v3/monitor/dayPower',//	多电站日发电量与等效时图
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30].map(e => ({
        date: e,
        dayPower: parseFloat(Math.random() * 2000),
        equipmentHours: parseFloat(Math.random() * 1000),
        instantaneous: parseFloat(Math.random() * 200),
      })),
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/monitor/monthPower', //	多电站月发电量与等效时图
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => ({
        date: e,
        monthPower: parseFloat(Math.random() * 2000),
        monthPlanPower: parseFloat(Math.random() * 2000),
        completeRate: parseFloat(Math.random() * 100),
        equipmentHours: parseFloat(Math.random() * 200),
        instantaneous: parseFloat(Math.random() * 200),
      })),
      "serviceCode": "3.0"
    },
  },
  {
    api: '/mock/api/v3/monitor/monthPlanpower', //	多电站月发电量与等效时图
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => ({
        date: e,
        monthPower: parseFloat(Math.random() * 2000),
        monthPlanPower: parseFloat(Math.random() * 1000),
        instantaneous: parseFloat(Math.random() * 200),
      })),
      "serviceCode": "3.0"
    },
  },
  {//多电站数据列表
    api: '/mock/v3/monitor/stations/station',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "stationDataSummary": {
          "stationStatusSummary": [
            {
              "stationNum": 300,
              "stationStatus": 400,
              "stationStatusName": "通讯正常"
            },
            {
              "stationNum": 100,
              "stationStatus": 500,
              "stationStatusName": "通讯中断"
            }
          ],
          "stationProvinceSummary": [
            {
              "stationNum": 1,
              "provinceCode": "370000",
              "provinceName": "山东省"
            },
            {
              "stationNum": 1,
              "provinceCode": "620000",
              "provinceName": "甘肃省"
            },
            {
              "stationNum": 1,
              "provinceCode": "130000",
              "provinceName": "河北省"
            },
            {
              "stationNum": 1,
              "provinceCode": "740000",
              "provinceName": "俄亥俄"
            },
            {
              "stationNum": 1,
              "provinceCode": "320000",
              "provinceName": "江苏省"
            },
            {
              "stationNum": 3,
              "provinceCode": "730000",
              "provinceName": "印第安纳"
            },
            {
              "stationNum": 1,
              "provinceCode": "750000",
              "provinceName": "夏威夷"
            },
            {
              "stationNum": 1,
              "provinceCode": "510000",
              "provinceName": "四川省"
            },
            {
              "stationNum": 1,
              "provinceCode": "530000",
              "provinceName": "云南省"
            },
            {
              "stationNum": 2,
              "provinceCode": "720000",
              "provinceName": "罗德岛"
            },
            {
              "stationNum": 1,
              "provinceCode": "150000",
              "provinceName": "内蒙古自治区"
            }
          ],
          "anomalousBranchNum": "5157",
          "monthRate": "6.91399426555187612",
          "yearPower": "214719866.15259999988",
          "alarmNum": "233",
          "instantaneous": "189.5",
          "yearRate": "60.309893941339609098",
          "lowEfficiencyInverterNum": "113",
          "dayPower": "916279.61999999988",
          "stationPower": "50085.3700000000095",
          "equivalentHours": "3.68190798039058056739",
          "stationUnitCount": "891",
          "monthPower": "1982186.35999999988",
          "stationCapacity": "248.86"
        },
        "stationDataList": stationList
      },
      "serviceCode": "3.0"
    },

  },
  {//多电站数据列表
    api: '/mock/v3/monitor/stations/getPvCapabilitydiagrams',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": capStationList,
      "serviceCode": "3.0"
    },

  }
]
