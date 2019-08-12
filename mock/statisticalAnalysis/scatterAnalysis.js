module.exports = [
  {
    api: '/mock/api/v3/wind/analysis/scatterplot/names',
    method: 'get',
    response: {
      'code': '10000',
      'message': '散点图测点名称列表请求成功',
      'data': [1, 2, 3, 4].map((e, i) => ({
        pointNameList: [1, 2, 3, 4].map((e, i) => (
          {
            pointCodeNameX: `x测点名称${e}`,
            pointCodeX: `X测点编码${e}`,
            pointCodeNameY: `y测点名称${e}`,
            pointCodeY: `y测点编码${e}`,
            pointsUnionName: `测点联合名称${e}`,
          }
        )),
        pointType: e,
      })),
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: {},
  },
  {
    api: '/mock/api/v3/wind/analysis/scatterplot/xylist',
    method: 'get',
    response: {
      'code': '10000',
      'message': '散点图自定义测点名称列表请求成功',
      'data': [1, 2, 3, 4].map((e, i) => (
        {
          devicePointName: `测点名称${e}`,
          devicePointCode: `测点编码${e}`,
          devicePointUnit: `测点单位${e}`,

        }
      )),
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: {},
  },
  {
    api: '/mock/api/v3/wind/analysis/scatterplot/list',
    method: 'get',
    response: {
      'code': '10000',
      'message': '散点图测点名称列表请求成功',
      'data': [1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i) => (
        {
          xMaxValue: '2000',
          xMinValue: '10',
          yMaxValue: '2000',
          yMinValue: '10',
          deviceName: `WT0${e}`,
          chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i) => ({
            x: `${e * 100}`,
            y: `${e * 100 + 100}`,
          })),
        })),
      'serviceCode': '3.0',
    },

    delay: 1000,
    error: {},
  },
];
