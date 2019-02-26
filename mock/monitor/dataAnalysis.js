

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
  }, { // 数据分析 -- 企业的时间间隔
    api: '/mock/monitor/dataAnalysisSecendInteral',
    method: 'get',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        hasSecond: 1
      }
    },
    error: {}
  }, { // 数据分析 - 实时chart
    api: '/mock/monitor/dataAnalysisChartRealtime',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        pointTime: ['2018-01-11 18:20:30', '2018-01-11 18:20:35', '2018-01-11 18:20:40', '2018-01-11 18:20:45', '2018-01-11 18:20:50'], 
        pointInfo: [
          {
            pointName: '背板温度',
            pointCode: 'temp',
            deviceInfo: [ // 每个测点下，各个设备的5组数据。
              {
                deviceCode: 'M350M206M2M1',
                deviceName: '汇流箱2#1',
                pointValue: ['12.12', '15.44', '0.74', null, '22.11']
              },{
                deviceCode: 'M350M206M2M2',
                deviceName: '汇流箱2#2',
                pointValue: ['52.12', '11.44', null, null, '0.11']
              },{
                deviceCode: 'M350M206M2M3',
                deviceName: '汇流箱2#3',
                pointValue: [null, null, null, null, null]
              }
            ]
          }, {
            pointName: '组件节温',
            pointCode: 'xb01',
            deviceInfo: [
              {
                deviceCode: 'M350M206M2M1',
                deviceName: '汇流箱2#1',
                pointValue: ['22', '18', '0', '2.47', '9.57']
              },{
                deviceCode: 'M350M206M2M2',
                deviceName: '汇流箱2#2',
                pointValue: ['52.12', '11.44', '10.14', '9.77', '9.11']
              },{
                deviceCode: 'M350M206M2M3',
                deviceName: '汇流箱2#3',
                pointValue: ['12.11', '23.14', '11.11', '8.10', '2.11']
              }
            ]
          },
        ]
      }
    },
    error: {}
  }, { // 数据分析 - 实时list
    api: '/mock/monitor/dataAnalysisListRealtime',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        total: 124,
        list: [1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => ({
          deviceName: '',
          stationName: '',
          deviceTypeName: '',
          deviceModeName: '',
          pointData: ['first', 'secend', 'third'].map((point, index) => ({
            devicePointCode: point,
            pointName: point,
            pointValue: e * e * index,
            pointUnit: ['kW', 'h', '台'][index]
          }))
        })),
      }
    },
    error: {}
  }
]
