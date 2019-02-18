

module.exports = [
  { // 设备类型下对应可展示测点
    api: '/mock/monitor/dataAnalysisPoints',
    method: 'post',
    response: [
      {
        devicePointId: '12345',
        devicePointCode: '1213131',
        devicePointName: '展示测试测点',
        devicePointIecCode: 'fewljl123',
        devicePointIecName: '分组测点'
      }
    ],
    error: {}
  }, { // 数据分析 - 历史趋势 - 所有chart数据
    api: '/mock/monitor/dataAnalysis/allHistory',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        pointTime: [1, 2, 3, 4].map(e => `${e}`),
        pointData: [1, 2, 3, 4].map(e => ({
          devicePoint: 'sdlfj',
          devicePointName: `点${e}`,
          devicePoint: [1, 2, 3, 4].map((e, i) => ({
            deviceName: `设备${e}`,
            deviceCode: `${Math.random()}`,
            deviceData: [e * (i + 1), e * (i + 1), e * e, e * 3 ]
          }))
        }))
      },
      "serviceCode": "3.0"
    },
    error: {}
  }, { // 数据分析 - 历史趋势 - 分页数据
    api: '/mock/monitor/dataAnalysis/partHistory',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [],
      "serviceCode": "3.0"
    },
    error: {}
  }
]

// 返回echart数据结构形如： 
const historyResponse =  {
  pointTime: ['2018-01-02 12:01:10', '2018-01-02 12:11:10', '2018-01-02 12:21:10', '2018-01-02 12:31:10' ],
  deviceInfo: [
    {
      deviceCode: '350M21M01M1',
      deviceName: 'HL201',
    }, {
      deviceCode: '350M22M02M2',
      deviceName: 'JD01',
    }, {
      deviceCode: '350M31M11M3',
      deviceName: 'NB20-1',
    }, {
      deviceCode: '350M41M101M4',
      deviceName: 'XB001',
    }
  ],
  pointData: [
    {
      pointCode: '测点1code',
      pointName: '测点1',
      pointInfo: [
        [21, 22, 123, 54],
        [121, 202, 23, 4],
        [11, 89, 45, 15],
        [271, 202, 17, 74]
        // {
        //   deviceCode: '350M21M01M1',
        //   deviceName: 'HL201',
        //   data: [21, 22, 123, 54]
        // }, {
        //   deviceCode: '350M22M02M2',
        //   deviceName: 'JD01',
        //   data: [121, 202, 23, 4]
        // }, {
        //   deviceCode: '350M31M11M3',
        //   deviceName: 'NB20-1',
        //   data: [11, 89, 45, 15]
        // }, {
        //   deviceCode: '350M41M101M4',
        //   deviceName: 'XB001',
        //   data: [271, 202, 17, 74]
        // },
      ]
    }, {
      pointCode: '测点2code',
      pointName: '测点2',
      pointInfo: [
        [21, 22, 123, 54],
        [121, 202, 23, 4],
        [11, 89, 45, 15],
        [271, 202, 17, 74]
        // {
        //   deviceCode: '350M21M01M1',
        //   deviceName: 'HL201',
        //   data: [21, 22, 123, 54]
        // }, {
        //   deviceCode: '350M22M02M2',
        //   deviceName: 'JD01',
        //   data: [121, 202, 23, 4]
        // }, {
        //   deviceCode: '350M31M11M3',
        //   deviceName: 'NB20-1',
        //   data: [11, 89, 45, 15]
        // }, {
        //   deviceCode: '350M41M101M4',
        //   deviceName: 'XB001',
        //   data: [271, 202, 17, 74]
        // },
      ]
    },
  ]
}