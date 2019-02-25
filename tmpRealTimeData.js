
// 问题: 
// @1:  请求的queryTime是否必须为整10秒(18:21:00), 18:21:08是否可行？

// 初次请求参数:queryParam = {
//   deviceFullCode: 'M350M206M2M1',
//   enterpriseId: '12321312312',
//   stationCode: 360,
//   devicePoint: ['temp', 'xb01'],
//   queryTime: ['2018-01-11 18:20:31', '2018-01-11 18:20:41', '2018-01-11 18:20:51', '2018-01-11 18:21:01', '2018-01-11 18:21:11'], // @1; queryTime设计为数组为了保持与得到数据量的一一对应，此时前端时间累积误差，可通过请求中计算当前时刻与请求数据，进行多数据请求进行消除。
// }
// 初始请求 得到的数据: initArr = 
const initResponse = {
  pointTime: ['2018-01-11 18:20:31', '2018-01-11 18:20:41', '2018-01-11 18:20:51', '2018-01-11 18:21:01', '2018-01-11 18:21:11'], 
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
    },{ 
      pointName: '组件节温',
      pointCode: 'xb01',
      deviceInfo: [ /*.......*/ ], // 第二个测点的各设备5个时刻数据。
    },
  ]
}

// 前端发起初始请求时，会记录queryTime，并指定5s后，继续请求单时刻数据。得到的各测点内各设备数据存储。若初始请求失败，提示刷新重试。

// 5s后，请求参数queryParam属性变为beginQuery: false, 且queryTime: ['2018-01-11 18:21:21']为前端传输的下一刻时间[]。若此时请求失败(超时)，前端数据会默认推送null作为数据,
// 前端始终保存请求时间，并在请求时间 + 5s后发起下一次请求。
const response = {
  pointTime: ['2018-01-11 18:21:21'],
  pointInfo: [
    {
      pointName: '背板温度',
      pointCode: 'temp',
      deviceInfo: [ // 每个测点下，各个设备的5组数据。
        {
          deviceCode: 'M350M206M2M1',
          deviceName: '汇流箱2#1',
          pointValue: ['12.12']
        },{
          deviceCode: 'M350M206M2M2',
          deviceName: '汇流箱2#2',
          pointValue: ['52.12']
        },{
          deviceCode: 'M350M206M2M3',
          deviceName: '汇流箱2#3',
          pointValue: [null]
        }
      ]
    },{ 
      pointName: '组件节温',
      pointCode: 'xb01',
      deviceInfo: [ /*.......*/ ], // 第二个测点的各设备5个时刻数据。
    },
  ]
}

// 前端会将以上数据，依次push进入初始数组。
pointTime => ['2018-01-11 18:20:31', '2018-01-11 18:20:41', '2018-01-11 18:20:51', '2018-01-11 18:21:01', '2018-01-11 18:21:11'];
pointValue => ['12.12', '15.44', '0.74', null, '22.11', '12.72'];
// 实现数据定时推送而非全部数据的传输。