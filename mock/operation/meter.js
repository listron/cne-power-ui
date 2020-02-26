

module.exports = [
  { // 设备类型下对应可展示测点
    api: '/mock/operation/meter',
    method: 'post',
    response: {
      code: '10000',
      message: '请求成功',
      data: [
        {
          meterId: 100,
          stationCode: 200,
          stationName: '电站200',
          meterNumber: 300,
          meterName: '电表名称300',
          meterType: 1,
          magnification: 500,
          totalStartCode: 600,
          topStartCode: 601,
          peakStartCode: 602,
          flatStartCode: 603,
          lowStartCode: 604,
          updateTime: '2020-02-12',
          isRelDocket: 0,
        }, {
          meterId: 101,
          stationCode: 201,
          stationName: '电站201',
          meterNumber: 301,
          meterName: '电表名称301',
          meterType: 2,
          magnification: 501,
          totalStartCode: 6001,
          topStartCode: 6011,
          peakStartCode: 6021,
          flatStartCode: 6031,
          lowStartCode: 6041,
          updateTime: '2020-02-13',
          isRelDocket: 1,
        },
      ],
    },
    error: {},
  },
];
