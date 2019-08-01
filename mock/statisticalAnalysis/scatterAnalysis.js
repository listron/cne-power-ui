module.exports = [
  {
    api: '/mock/api/v3/wind/analysis/scatterplot/names',
    method: 'get',
    response: {
      'code': '10000',
      'message': '散点图测点名称列表请求成功',
      'data': {
        xPointName: 'X测点名称',
        xPointCode: 'X测点编码',
        yPointName: 'y测点名称',
        yPointCode: 'y测点编码',
        pointsUnionName: '测点联合名称',
      },
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
      'data': {
        xPointName: 'X测点名称',
        xPointCode: 'X测点编码',
        yPointName: 'y测点名称',
        yPointCode: 'y测点编码',

      },
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
      'data': {
        xMaxValue: '2000',
        xMinValue: '10',
        yMaxValue: '2000',
        yMinValue: '10',
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i) => ({
          name: `WT0${e}`,
          x: `${e * 100}`,
          y: `${e * 100 + 100}`,
        })),
      },
      'serviceCode': '3.0',
    },
    delay: 1000,
    error: {},
  },
];
