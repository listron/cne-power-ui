

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
          devicePointName: '展示测试测点1',
          devicePointIecCode: '1',
          devicePointIecName: '分组1测点'
        }, {
          devicePointId: 'sadf1sdf',
          devicePointCode: '1组测点b',
          devicePointName: '展示测试测点2',
          devicePointIecCode: '1',
          devicePointIecName: '分组1测点'
        }, {
          devicePointId: 'zcv321a',
          devicePointCode: '2组测点1',
          devicePointName: '展示测试测点3',
          devicePointIecCode: '2',
          devicePointIecName: '分组2测点'
        }, {
          devicePointId: '123zsxgd',
          devicePointCode: '2组点2',
          devicePointName: '展示测试测点4',
          devicePointIecCode: '2',
          devicePointIecName: '分组2测点'
        }, {
          devicePointId: 'sxzv32dfs',
          devicePointCode: '3测点',
          devicePointName: '展示测试测点5',
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
            pointInfo: {
              '350M21M01M1': [21, 22, 123, 54],
              '350M21M01M1': [121, 202, 23, 4],
              '350M31M11M3': [11, 89, 45, 15],
              '350M41M101M4': [271, 202, 17, 74]
            }
          }, {
            pointCode: '测点2code',
            pointName: '测点2',
            pointUnit: '℃',
            pointInfo: {
              '350M21M01M1': [21, 22, 123, 54],
              '350M21M01M1': [121, 202, 23, 4],
              '350M31M11M3': [11, 89, 45, 15],
              '350M41M101M4': [271, 202, 17, 74]
            }
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
        time: '2019-01-20 16:30:20',
        list: [1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => ({
          deviceName: `${e}设备`,
          stationName: `电站${e*e}`,
          deviceTypeName: `类型${e * (e + 2 )}`,
          deviceModeName: `型号${e * e + e}`,
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
  }, { // 数据分析 - 散点图 - 所有chart数据
    api: '/mock/monitor/dataAnalysis/allScatterDiagram',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        pointTime: ['2018-01-02 12:01:10', '2018-01-02 12:11:10', '2018-01-02 12:21:10', '2018-01-02 12:31:10' ],
        pointData: [
          {
            xData: [1.13],
            yData: [13],
          }, {
            xData: [2.13],
            yData: [2443],
          }, {
            xData: [3.13],
            yData: [3522],
          }, {
            xData: [4.13],
            yData: [4122],
          }
        ],
      },
      "serviceCode": "3.0"
    },
    error: {}
  }, { // 数据分析 - 散点图 - 分页数据
    api: '/mock/monitor/dataAnalysis/listScatterDiagram',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        pageCount: 10,
        dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(e => ({
          deviceName: `测试设备${e}`,
          stationName: `电站${e * e}`,
          deviceTypeName: `类型${e * 10}`,
          deviceModeName: `型号${e * 9}`,
          time: `${e ** e}`,
          power: `${e ** e / 8}`,
          speed: `${e * 2}`,
        }))
      },
      serviceCode: '3.0'
    },
    error: {}
  },{ // 数据分析 - 散点图 - x/y轴测点数据
    api: '/mock/monitor/dataAnalysis/dataAnalysisPoints',
    method: 'get',
    response: {
      code: '10000',
      message: '请求成功',
      data: {
        xPoint: [1, 2, 3, 4].map(e => ({
          devicePointCode: `${e}`,
          devicePointName: `测点${e * 2}`,
          devicePointUnit:  `m/s`
        })),
        yPoint: [1, 2, 3, 4].map(e =>({
          devicePointCode: `${e}`,
          devicePointName: `测点${e * 2}`,
          devicePointUnit:  `m/s`
        })),
      }
      }
    }, { // 诊断中心-线型图-列表
      api: '/mock/monitor/diagnoseCenter/linkageList',
      method: 'post',
      response: {
        code: '10000',
        message: '请求成功',
        data: [
          {
            relevantType: 1,
            count: 9,
            list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map(e => ({
              eventType: `${e}`,
              pointValueDesc: `事件描述${e}`,
              deviceTypeName: `类型${e * 1}`,
              beginTime: `2020-04-20 14:0${e}`,
              statusName: `状态${e}`,
            })),
          }, {
            relevantType: 2,
            count: 5,
            list: [1, 2, 3, 4, 5].map(e => ({
              eventType: `${e}`,
              pointValueDesc: `事件描述${e}`,
              deviceTypeName: `类型${e * 1}`,
              beginTime: `2020-04-20 14:0${e}`,
              statusName: `状态${e}`,
            })),
          }, {
            relevantType: 3,
            count: 4,
            list: [1, 2, 3, 4].map(e => ({
              eventType: `${e}`,
              pointValueDesc: `事件描述${e}`,
              deviceTypeName: `类型${e * 1}`,
              beginTime: `2020-04-20 14:0${e}`,
              statusName: `状态${e}`,
            })),
          }
        ],
        serviceCode: '3.0',
      },
      },
];
