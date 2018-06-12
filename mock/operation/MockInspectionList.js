
module.exports = [
  {
    api:'/mock/operation/inspectionList',
    method:'post',
    response:{
      data:
        [1,2,3,4,5].map((e, i)=>({
          inspectId: i,
          inspectName: 'inspection半年检',
          stationName: 'inspection山东平原',
          deviceTypeName: '风机机组,逆变器',
          startTime: '2018-03-12',
          deadLine: '2018-04-12',
          inspectStatus: Math.floor(2+Math.random()*3),
        })),
      success: true,
    },
    delay:1000,
    error:{}
  }
]
