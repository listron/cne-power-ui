module.exports = [
  {
    api: '/mock/statisticalAnalysis/intelligence/analysis/station',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "generatinCapacity": {
          "month": '1',
          "genValid": '2',
          "genValidCompared": '3',
          "resourceValueCompared": '4',
          "lostPowerCompared": '5',
          "limitPowerRate": '6',
          "limitPowerRateCompared": '7'
        },
        "systematicStatistics": {
          "prs": '1',
          "month": '2',
          "pr": '3',
          "lostPower": '4',
        },
        "completionRate": {
          "planComplateRate": '1',
          "month":'2',
          "monthPlanComplateRate": '3',
          "resourceValueCompared": '3',
          "lostPowerCompared": '4',
          "limitPowerRate": '5',
          "limitPowerCompared": '6'
        },
        "lossOfElectricity": {
          "month": '1',
          "lostPowerCompared": '3',
          "lowVoltageDCFaultLostPower": '2',
          "lowVoltageDCFaultProportion": '3',
          "lowVoltageDCFaultCompared": '5',
          "substationSystemFaultLostPower": '5',
          "substationSystemFaultProportion": '5',
          "substationSystemFaultCompared": '5',
          "transmissionSystemFaultLostPower": '5',
          "transmissionSystemFaultProportion": '5',
          "transmissionSystemFaultCompared": '5',
          "secondaryAndHaveNotPowerFaultLostPower": '5',
          "secondaryAndHaveNotPowerFaultProportion": '5',
          "secondaryAndHaveNotPowerFaultCompared": '5',
          "otherFaultLostPower": '5',
          "otherFaultProportion": '5',
          "otherFaultCompared": '5',
          "externalFaultLostPower": '5',
          "externalFaultProportion": '5',
          "externalFaultCompared": '5'
        }
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {
    api: '/mock/statisticalAnalysis/intelligence/analysis/area',
    method: 'post',
    response: {
      code: "10000",
      message: "请求成功",
      "data": {
        "areaPartABean": {
          "avgEquiventHours": '1',
          "avgLostPowerEquiventHours": '2',
          "hightStationInfoList": [{
            "stationName": "电站1",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站2",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站3",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          }],
          "lowStationInfoList": [{
            "stationName": "电站1",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站2",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站3",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          }]
        },
        "areaPartBBean": {
          "avgPlanComplateRate": '1',
          "hightStationInfoList": [{
            "stationName": "电站1",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站2",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站3",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          }],
          "lowStationInfoList": [{
            "stationName": "电站1",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站2",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          },{
            "stationName": "电站3",
            "lostValue": "2",
            "sunnyDays": "3",
            "per": "4"
          }]
        },
        "areaPartCBean": {
          "lostPowers": "1",
          "faultName": "2",
          "faultLostPowerList": [{
            "faultType": "1",
            "lostPower": "2",
            "lostPowerYearOnYear": "3",
          }]
        },
        "areaPartDBean": {
          "avgScore": "1",
          "lowScoreStationList": [{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          },{
            "stationName": "电站名称n",
            "scoreValue": "2",
            "stationScoreDetailList":[{
              "indexCode": "1",
              "indexName": "2",
              "scoreValuePer": "3"
            }]
          }]
        }
      }
    }
  }
]