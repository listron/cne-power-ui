const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

module.exports = [
  {
    api:'/mock/cleanWarning/list',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        total: 121,
        detailData: arr.map(e => ({
          stationCode: e,
          stationName: `mock电站${e}`,
          influencePercent: e / 100,
          futurePower: e * e * 10,
          cleanDays: e,
          warningTime: e,
        }))
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/cleanWarning/detail',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        stationCode: 56,
        stationName: 'mock电站',
        influencePower: '2266',
        cleanDays: 12,
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/cleanWarning/totalEffect',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": arr.map(e => ({
        date: e,
        actualPower: e * e,
        influencePower: e * 4,
        influencePercent: e / 100,
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/cleanWarning/matrixEffect',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": arr.map(e => ({
        matrix: `方阵${e}`,
        actualPower: e * e,
        influencePower: e * 4,
        influencePercent: e / 100,
      })),
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }
]