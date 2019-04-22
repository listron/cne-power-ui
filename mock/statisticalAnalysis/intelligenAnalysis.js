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
          "limitPowerRate": '0',
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
        "aveEquUsehours": "123",
        "highEquUsehourStations": [{
            "stationName": "电站1",
            "hours": "12",
            "sunnyDays": "3",
          },{
            "stationName": "电站1",
            "hours": "12",
            "sunnyDays": "3",
          },{
            "stationName": "电站1",
            "hours": "12",
            "sunnyDays": "3",
          }],
        "lowEquUsehourStations": [{
          "stationName": "电站1",
          "hours": "12",
          "sunnyDays": "3",
        },{
          "stationName": "电站1",
          "hours": "12",
          "sunnyDays": "3",
        },{
          "stationName": "电站1",
          "hours": "12",
          "sunnyDays": "3",
        }],
        "aveEquLossPowerhours":"111",
        "aveComplateRate": "123",
        "highComplateRateStations": [{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        },{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        },{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        }],
        "lowComplateRateStations": [{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        },{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        },{
          "stationName": "电站2",
          "lossRate": "2",
          "sunnyDays": "3",
          "proportion": "4"
        }],
        "totalLossPower":"123",
        "totalLossPowerDesc": [{
          "externalFaultLostPower":"123",
          "externalFaultProportion":"123",
          "highExternalFaultName":"占比最高",
          "highPxternalFaultProportion":"R体分类",
          "lowVoltageDCFaultLostPower": "12",
          "lowVoltageDCFaultProportion":"12",
          "substationSystemFaultLostPower":"12",
          "substationSystemFaultProportion":"12",
          "transmissionSystemFaultLostPower":"12",
          "transmissionSystemFaultProportion" :"12",
          "secondaryAndHaveNotPowerFaultLostPower":"12",
          "secondaryAndHaveNotPowerFaultProportion":"12",
          "otherFaultLostPower":"12",
          "otherFaultProportion":"12",
        }],
        "maxFaultName":"123",
        "aveScore":"123",
        "scoreStations":[{

        }],


        "areaPartABean": {
          "avgEquiventHours": '1',
          "avgLostPowerEquiventHours": '2',
          "hightStationInfoList": [{
            "stationName": "电站1",
            "lostValue": "2",
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
  },
  {
  api: '/mock/statisticalAnalysis/intelligence/analysis/areacompare',
  method: 'post',
  response: {
    code: "10000",
    message: "请求成功",
    "data": {
      "avgComplateRate":"123",
      "areaPartABeanList": {
          "areaName":"区域一" ,
          "hightStationInfoList":[{
            "stationName": "电站1",
            "lostValue": "123",
            "sunnyDays": "456",
            "per":"789"
          },{
            "stationName": "电站2",
            "lostValue": "123",
            "sunnyDays": "456",
            "per":"789"
          },{
            "stationName": "电站3",
            "lostValue": "123",
            "sunnyDays": "456",
            "per":"789"
          },
        ]
      },
      "lostEquientHours": "123",
      "areaPartBBeanList": [{
        "areaName": "区域1",
        "areaFaultLostPowerList": [{
          "faultType": "1",
          "lostPower": "2",
          "lostPowerYearOnYear":"3"
        }]
      }]
    }
  }
}
]