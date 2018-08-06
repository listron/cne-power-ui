
module.exports = [
  {//多电站数据列表
    api: '/mock/v3/monitor/stations/stationType',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "stationDataSummary": {
          "stationPower": '333',
          "stationCapacity": '4444',
          "stationUnitCount": 3,
          "dayPower": '4',
          "monthPower": '150',
          "yearPower": '50000',
          "yearPlanPower": '49999',
          "yearPlanRate": '90',

          "stationStatusSummary": [
              {
              "stationStatus": 400,
              "stationStatusName": '通讯正常',
              "stationNum": 35,
              }, {
              "stationStatus": 500,
              "stationStatusName": '信息中断',
              "stationNum": 35,
              }, {
              "stationStatus": 900,
              "stationStatusName": '未接入',
              "stationNum": 35,
              }
          ],
          "stationProvinceSummary": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((e, i) => (
              {
              "provinceCode": `${i * 3 + 4}`,
              "provinceName": `我是${i * 3 + 4}省`,
              "windStationNum": i * 3 + 4,
              "lightStationNum": i * 2
              }
          ))
        },
        "stationDataList": [1,2,3,4,5,6,7,8,9,0].map((e,i)=>(
          {
            "stationCode": `${i+1}`,
            "stationName": `圣经山${i+1}`,
            "stationType": `${i+1}`,
            "provinceName": `河北`,
            "instantaneous": `${i+1}m/s`,
            "dayResources": `${i+1}`,
            "stationPower": `${i+1}0`,
            "stationCapacity": `${i+1}00`,
            "stationUnitCount": `${i+1}2`,
            "longitude": `经度`,
            "latitude": `维度`,
            "dayPower": `${i+5}`,
            "monthPower": `${i+5}*30`,
            "yearPower": `${i+5}*365`,
            "yearPlanPower": `${i+5}*${400+i}`,
            "yearPlanRate": `365/${400+i}`,
            "stationStatus": {
              "stationStatus": `${i<9?i>4?5:4:9}00`,
              "stationStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`
              },
            "deviceStatus": [
              {
                "deviceStatus": `${i<9?i>4?2:1:3}00`,
                "deviceStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`,
                "deviceStatusNum": i+5,
                "deviceStatusList": [
                  {
                    "deviceStatus": `${i<9?i>4?2:1:3}`,
                    "deviceStatusName": `${i<9?i>4?'中断':'正常':'未接入'}`,
                    "deviceStatusNum": i+5
                  }
                ]
              }
            ]
          }

        ))

      },
      "serviceCode": "3.0"
    },

  },
]
