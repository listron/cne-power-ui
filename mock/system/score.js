module.exports = [
  {//电站评分
    api: '/mock/system/performance/score/conf',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "reportType": 1,
        "basicScore": 85,
        "indexList": [1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => (
          {
            "indexTypeCode": 12,
            "indexTypeName":"电站水平",
            "indexCode":e,
            "indexName":`第${e}指标`,
            "indexContent":`第${e}指标`,
            "indexPercent":parseFloat(Math.random()*100).toFixed(2),
            "indexLowerLimit":parseFloat(Math.random()*10).toFixed(2),
            "indexUpperLimit":parseFloat(Math.random()*100).toFixed(2),
            "indexIncrDecrStandard":parseFloat(Math.random()*10).toFixed(2),
            "indexIncrDecrValue":parseFloat(Math.random()*10).toFixed(2),
          }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {//编辑
    api: '/mock/system/performance/score/conf',
    method: 'put',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '编辑成功！'
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  { // 恢复默认
    api: '/mock/system/performance/score/defaultConf',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "reportType": 1,
        "basicScore": 85,
        "indexList": [1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => (
          {
            "indexTypeCode": 12,
            "indexTypeName":"电站水平",
            "indexCode":e,
            "indexName":`第${e}指标`,
            "indexContent":`第${e}指标`,
            "indexPercent":parseFloat(Math.random()*100).toFixed(2),
            "indexLowerLimit":parseFloat(Math.random()*10).toFixed(2),
            "indexUpperLimit":parseFloat(Math.random()*100).toFixed(2),
            "indexIncrDecrStandard":parseFloat(Math.random()*10).toFixed(2),
            "indexIncrDecrValue":parseFloat(Math.random()*10).toFixed(2),
          }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
]
