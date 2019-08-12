module.exports = [{
  api: '/mock/api/v3/performance/report/index',
  method: 'get',
  response: {
    'code': '10000',
    'message': '请求成功',
    'data':
      {
        'code': 1001,
        'name': '指标名称',
        'desc': '指标描述',
        'unit': '指标单位',
        'list': {
          'code': 10011,
          'name': '指标名称1',
          'desc': '指标描述1',
          'unit': '指标单位1',
        },
      },
    'serviceCode': '3.0',
  },
  delay: 1000,
  error: {},
}];
