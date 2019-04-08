module.exports = [
  {
    api: '/mock/statisticalAnalysis/intelligence/analysis/station',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [
        {
          genValid:123,
        }

      ],
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }
]