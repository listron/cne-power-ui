

module.exports = [
  { // 设备类型下对应可展示测点
    api: '/mock/monitor/dataAnalysisPoints',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          devicePointId: 'sadfsd',
          devicePointCode: '1组测点a',
          devicePointName: '展示测试测点',
          devicePointIecCode: '1',
          devicePointIecName: '分组1测点'
        }, {
          devicePointId: 'sadf1sdf',
          devicePointCode: '1组测点b',
          devicePointName: '展示测试测点',
          devicePointIecCode: '1',
          devicePointIecName: '分组1测点'
        }, {
          devicePointId: 'zcv321a',
          devicePointCode: '2组测点1',
          devicePointName: '展示测试测点',
          devicePointIecCode: '2',
          devicePointIecName: '分组2测点'
        }, {
          devicePointId: '123zsxgd',
          devicePointCode: '2组点2',
          devicePointName: '展示测试测点',
          devicePointIecCode: '2',
          devicePointIecName: '分组2测点'
        }, {
          devicePointId: 'sxzv32dfs',
          devicePointCode: '3测点',
          devicePointName: '展示测试测点',
          devicePointIecCode: '3',
          devicePointIecName: '分组3测点'
        }
      ],
    },
    error: {}
  }, { // 数据分析 - 历史趋势 - 所有chart数据
    api: '/mock/monitor/dataAnalysis/allHistory',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
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
            pointUnit: 'kWh',
            pointInfo: [
              [21, 22, 123, 54],
              [121, 202, 23, 4],
              [11, 89, 45, 15],
              [271, 202, 17, 74]
            ]
          }, {
            pointCode: '测点2code',
            pointName: '测点2',
            pointUnit: '℃',
            pointInfo: [
              [21, 22, 123, 54],
              [121, 202, 23, 4],
              [11, 89, 45, 15],
              [271, 202, 17, 74]
            ]
          },
        ]
      },
      "serviceCode": "3.0"
    },
    error: {}
  }, { // 数据分析 - 历史趋势 - 分页数据
    api: '/mock/monitor/dataAnalysis/listHistory',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        total: 9,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => ({
          deviceName: `测试设备${e}`,
          stationName: `电站${e * e}`,
          deviceTypeName: `类型${e * 10}`,
          deviceModeName: `型号${e * 9}`,
          time: `${e ** e}`,
          speed: `类型${e * 10}`,
          power: `${e ** e / 8}`,
          pointData: [9, 5, 2].map(m => ({
            devicePointCode: `编码${m}`,
            devicePointName: `编码${m}`,
            pointValue: `${m * e / 10}`,
            pointUnit: 'kWh',
          }))
        }))
      },
      serviceCode: '3.0'
    },
    error: {}
  }
]
