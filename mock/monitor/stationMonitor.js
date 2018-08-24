
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
          "instantaneous":`${Math.floor(Math.random()*20)}`,
          "dayPower": '4',
          "monthPower": '150',
          "yearPower": '40000',
          "yearPlanPower": '49999',
          "yearPlanRate": `${(40000/49999*100).toFixed(2)}%`,

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
            {"windStationNum" : 600},
            {"lightStationNum":700}

          ]

        },
        "stationDataList": [1,2,3,4,5,6,7,8,9,0,22,33,44,55].map((e,i)=>(
          {
            "stationCode": `${i+1}`,
            "stationName": `圣经山${i+1}`,
            "stationType": `${Math.floor(Math.random()*2)}`,
            "provinceName": `河北${i+1}`,
            "instantaneous": `${i+1}`,
            "dayResources": `${i+1}`,
            "stationPower": `${i+1}9`,
            "stationCapacity": `${i+1}00`,
            "stationUnitCount": `${i+1}2`,
            "longitude": `${i+120.35}`,
            "latitude": `${i+37.35}`,
            "alarmNum":Math.floor(Math.random()*3),
            "dayPower": `${i+5}`,
            "monthPower": `${(i+5)*30}`,
            "yearPower": `${(i+5)*365}`,
            "yearPlanPower": `${(i+5)*(400+i)}`,
            "yearPlanRate": `${365/(400+i)*100}`,
            "stationStatus": {
              "stationStatus": `${i<9?i>4?5:4:9}00`,
              "stationStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`
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

  },
]
