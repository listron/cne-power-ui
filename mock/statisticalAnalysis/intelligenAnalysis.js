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
          "stationName": "电站1",
          "score": "12",
          "lowPlanFinishRate": "12",
          "lowPrFinishRate": "12",
          "highLostPpwerEquivalentHours": "12",
          "highComPlantPowerRate": "12",
          "lowDefectFinishRate": "12",
          "ALevelDefectFinishRate": "12",
          "BLevelDefectFinishRate": "12",
          "CLevelDefectFinishRate": "12"
        },{
          "stationName": "电站2",
          "score": "12",
          "lowPlanFinishRate": "12",
          "lowPrFinishRate": "12",
          "highLostPpwerEquivalentHours": "12",
          "highComPlantPowerRate": "12",
          "lowDefectFinishRate": "12",
          "ALevelDefectFinishRate": "12",
          "BLevelDefectFinishRate": "12",
          "CLevelDefectFinishRate": "12"
        },{
          "stationName": "电站3",
          "score": "12",
          "lowPlanFinishRate": "12",
          "lowPrFinishRate": "12",
          "highLostPpwerEquivalentHours": "12",
          "highComPlantPowerRate": "12",
          "lowDefectFinishRate": "12",
          "ALevelDefectFinishRate": "12",
          "BLevelDefectFinishRate": "12",
          "CLevelDefectFinishRate": "12"
        },{
          "stationName": "电站4",
          "score": "12",
          "lowPlanFinishRate": "12",
          "lowPrFinishRate": "12",
          "highLostPpwerEquivalentHours": "12",
          "highComPlantPowerRate": "12",
          "lowDefectFinishRate": "12",
          "ALevelDefectFinishRate": "12",
          "BLevelDefectFinishRate": "12",
          "CLevelDefectFinishRate": "12"
        }]
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
        "enterpriseGenData": [{
          "rate": "123",
          "regionNameList":["123","789","456"],
          "regionDataList":[{
            "regionName": "区域一",
            "faultList":[{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            }]
          },{
            "regionName": "区域二",
            "faultList":[{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            }]
          },{
            "regionName": "区域三",
            "faultList":[{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            },{
              "stationName":"电站1",
              "faultGen":"123",
              "faultLostRate":"123",
              "sunnyDays":"123",
              "sunnyDayRate":"123",
            }]
          },
          ],
        }],
        "enterpriseHoursData": [{
          "value": "123",
          "regionNameList":["123","789","456"],
          "regionDataList":[{
            "regionName": "区域一",
            "faultData":[{
              "courtLostHours":"123",
              "courtLostHoursRate":"123",
              "maxFaultName":"123",
              "maxLostHoursRate":"123",
              "lowVoltageLostHoursRate":"123",
              "lowVoltageLostHours":"123",
              "substationLostHours" :"123",
              "substationLostHoursRate":"123",
              "outPutLostHours":"123",
              "outPutLostHoursRate":"123",
              "twiceLostHours":"123",
              "twiceLostHoursRate":"123",
              "otherLostHours":"123",
              "otherLostHoursRate":"123", 
            }]
          },{
            "regionName": "区域二",
            "faultData":[{
              "courtLostHours":"123",
              "courtLostHoursRate":"123",
              "maxFaultName":"123",
              "maxLostHoursRate":"123",
              "lowVoltageLostHoursRate":"123",
              "lowVoltageLostHours":"123",
              "substationLostHours" :"123",
              "substationLostHoursRate":"123",
              "outPutLostHours":"123",
              "outPutLostHoursRate":"123",
              "twiceLostHours":"123",
              "twiceLostHoursRate":"123",
              "otherLostHours":"123",
              "otherLostHoursRate":"123", 
            }]
          },{
            "regionName": "区域三",
            "faultData":[{
              "courtLostHours":"123",
              "courtLostHoursRate":"123",
              "maxFaultName":"123",
              "maxLostHoursRate":"123",
              "lowVoltageLostHoursRate":"123",
              "lowVoltageLostHours":"123",
              "substationLostHours" :"123",
              "substationLostHoursRate":"123",
              "outPutLostHours":"123",
              "outPutLostHoursRate":"123",
              "twiceLostHours":"123",
              "twiceLostHoursRate":"123",
              "otherLostHours":"123",
              "otherLostHoursRate":"123", 
            }]
          }]
        }]
      }
    }
  }
]