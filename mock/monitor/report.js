
const arr1 = Array(10).fill(1);
const arr2 = Array(12).fill(1);

module.exports = [
  { // 区域
    api: '/mock/v3/wind/report/fan/region',
    method: 'get',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': arr1.map((e, i) => `test${i + 1}`),
      'serviceCode': '3.0',
    },
    error: {},
  },
  { // 电站
    api: '/mock/v3/wind/report/fan/station',
    method: 'get',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': arr1.map((e, i) => {
        return {
          regionName: `test${i + 1}`,
          stationData: arr1.map((item, key) => {
            return {
              stationCode: Math.random() * 100000,
              stationName: `电站${key + 1}`,
            };
          }),
        };
      }),
      'serviceCode': '3.0',
    },
    error: {},
  },
  { // 型号
    api: '/mock/v3/wind/report/fan/devicemode',
    method: 'get',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': arr1.map((e, i) => {
        return {
          regionName: `test${i + 1}`,
          stationData: arr1.map((value, index) => {
            return {
              stationCode: Math.random() * 10000,
              stationName: `电站${index + 1}`,
              deviceModeData: arr1.map((item, key) => {
                return {
                  deviceModeCode: Math.random() * 100000,
                  deviceModeName: `设备型号${key + 1}`,
                };
              }),
            };
          }),
        };


      }),
      'serviceCode': '3.0',
    },
    error: {},
  },
  { // 设备（风机）
    api: '/mock/v3/wind/report/fan/device',
    method: 'get',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': arr1.map((e, i) => {
        return {
          regionName: `test${i + 1}`,
          stationData: arr1.map((value, index) => {
            return {
              stationCode: Math.random() * 100000,
              stationName: `电站${index + 1}`,
              deviceData: arr1.map((item, key) => {
                return {
                  deviceCode: Math.random() * 100000,
                  deviceName: `设备${key + 1}`,
                };
              }),
            };
          }),
        };
      }),
      'serviceCode': '3.0',
    },
    error: {},
  },

  { //电量报表
    api: '/mock/v3/wind/report/fan/gen',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        pageCount: 12,
        dataList: arr2.map((e, i) => ({
          time: '2019-04-05',
          regionName: `test${i + 1}`,
          stationName: `电站${i + 1}`,
          deviceName: '设备名称',
          deviceModeName: '风机型号',

          windSpeedAvg: '平均风速',
          genValid: '发电量',
          genTime: '发电时间',
          equivalentHours: '等效利用小时',
          limitGen: '限电损失电量',
          limitTime: '限电时长',
          faultGen: '故障损失电量',
          faultTime: '故障时长',
        })),
      },
      'serviceCode': '3.0',
    },
    error: {},
  },
  { //设备状态报表汇总
    api: '/mock/v3/wind/report/fan/devicestatus',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        pageCount: 12,
        dataList: arr2.map((e, i) => ({
          time: '2019-04-05',
          regionName: `test${i + 1}`,
          stationName: `电站${i + 1}`,
          deviceName: '设备名称',
          deviceModeName: '风机型号',
          deviceStatusName: '设备状态',
          num: i + 1,
          statusTime: i + 1,
          statusHours: '状态小时数',
        })),
      },
      'serviceCode': '3.0',
    },
    error: {},
  },
  { //设备状态报表明细
    api: '/mock/v3/wind/report/fan/devicestatus/detail',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        pageCount: 12,
        dataList: arr2.map((e, i) => ({
          regionName: `test${i + 1}`,
          stationName: `电站${i + 1}`,
          deviceName: '设备名称',
          deviceModeName: '风机型号',
          deviceStatusName: '设备状态',
          happenTime: '2019-04-05',
          statusTime: i + 1,
          statusHours: '状态小时数',
          statusDescribe: '状态描述',
        })),
      },
      'serviceCode': '3.0',
    },
    error: {},
  },
  { //故障报表汇总
    api: '/mock/v3/wind/report/fan/devicefault',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        pageCount: 12,
        dataList: arr2.map((e, i) => ({
          regionName: `test${i + 1}`,
          stationName: `电站${i + 1}`,
          deviceName: '设备名称',
          deviceModeName: '风机型号',
          num: 2,
          deviceFaultName: '故障描述',
          happenTime: '2019-04-05',
          faultTime: i + 1,
          faultHours: '故障小时数',
          faultGen: '损失电量',
        })),
      },
      'serviceCode': '3.0',
    },
    error: {},
  },
  { //故障报表明细
    api: '/mock/v3/wind/report/fan/devicefault/detail',
    method: 'post',
    response: {
      'code': '10000',
      'message': '请求成功',
      'data': {
        pageCount: 12,
        dataList: arr2.map((e, i) => ({
          regionName: `test${i + 1}`,
          stationName: `电站${i + 1}`,
          deviceName: '设备名称',
          deviceModeName: '风机型号',
          component: '所属部件',
          deviceFaultName: '故障描述',
          faultStartTime: '故障开始时间',
          faultEndTime: '故障结束时间',
          deviceFaultCode: '故障代码',
          happenTime: '2019-04-05',
          faultTime: i + 1,
          faultHours: '故障小时数',
        })),
      },
      'serviceCode': '3.0',
    },
    error: {},
  },


];
