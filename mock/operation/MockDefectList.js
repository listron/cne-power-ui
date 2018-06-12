
module.exports = [
  {
    api:'/mock/operation/MockDefectList',
    method:'post',
    response:{
      data:
        [1,2,3,4,5].map((e, i)=>({
          defectId: i,
          defectLevel: i,
          deviceName: '甘巴拉',
          defectDescribe: '电流持续偏低',
          stationName: '山东平原',
          startTime: '2018-03-12',
          deadLine: '2018-04-12',
          defectStatus: Math.floor(Math.random()*5),
        })),
      success: true,
    },
    delay:1000,
    error:{}
  }
]
