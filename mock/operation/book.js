
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];



module.exports = [
  { // 树
    api: '/mock/v3/ledger/assetslist',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1,].map((e, i) => {
        return {
          assetsId: `0,1`,
          assetsName: `一级${e}`,
          assetsType: `1`,
          isBuild: 0,
          childNodeNum: 4,
          childernNodes: [1,].map((e, i) => ({
            assetsId: `0,1,2`,
            assetsName: `二级${e}`,
            assetsType: `2`,
            isBuild: 0,
            childNodeNum: 3,
            childernNodes: [1,].map((e, i) => ({
              assetsId: `0,1,2,3`,
              assetsName: `三级${e}`,
              assetsType: `3`,
              isBuild: 1,
              childNodeNum: 2,
              childernNodes: [1,].map((e, i) => ({
                assetsId: `0,1,2,3,4`,
                assetsName: `四级${e}`,
                assetsType: `3`,
                isBuild: 1,
                childNodeNum: 1,
                childernNodes: [1,].map((e, i) => ({
                  assetsId: `0,1,2,3,4,5`,
                  assetsName: `五级${e}`,
                  assetsType: `3`,
                  isBuild: 1,
                  childNodeNum: 0,
                })),
              })),
            })),
          })),
        }
      }),
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//生产资产节点详细信息
    api: '/mock/v3/ledger/detail',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3, 4, 5, 6].map((e, i) => {
        return {
          "assetsId": `${Math.random(0, 1) * 10000}`,
          "assetsCode": `${Math.random(0, 1) * 10000}`,
          "assetsName": `test${i + 1}`,
          "assetsType": `1`,
          "assetsUnit": `${Math.random(0, 1) * 10000}`,
          "createTime": `${Math.random(0, 1) * 10000}`,
          "operateUser": `${Math.random(0, 1) * 10000}`,
          'isBuild': `${i > 2 ? 1 : 0}`
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//生产厂家列表
    api: '/mock/v3/ledger/devicemanufactors/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3, 4, 5, 6].map((e, i) => {
        return {
          "manufactorCode": `${Math.random(0, 1) * 10000}`,
          "manufactorId": `${Math.random(0, 1) * 10000}`,
          "manufactorName": `test${i + 1}`,
          "createTime": `${Math.random(0, 1) * 10000}`,
          "operateUser": `${Math.random(0, 1) * 10000}`,

        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//设备型号列表
    api: '/mock/v3/ledger/devicemodes/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3, 4, 5, 6].map((e, i) => {
        return {
          "modeId": `${Math.random(0, 1) * 10000}`,
          "deviceModeCode": `${Math.random(0, 1) * 10000}`,
          "deviceModeName": `$test{i+1}`,
          "manufactorName": `$test{i+2}`,
          "manufactorCode": `${Math.random(0, 1) * 10000}`,
          "createTime": `${Math.random(0, 1) * 10000}`,
          "operateUser": `${Math.random(0, 1) * 10000}`,
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//获取某设备厂家下的设备型号
    api: '/mock/v3/ledger/devicemodes/manufactorId',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3].map((e, i) => {
        return {
          'modeId': `设备型号${i}`,
          'deviceModeName': `设备型号名称${i}`,
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//获取某设备的部件信息
    api: '/mock/v3/ledger/device/parts/list/deviceFullcode',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3,].map((e, i) => {
        return {
          "assetsId": `${Math.random(0, 1) * 10000}`,
          "assetsName": `${Math.random(0, 1) * 10000}`,
          "assetsData": [1, 2].map((e, i) => {
            return {
              'assetsId': `${Math.random(0, 1) * 10000}`,
              'assetsName': `${Math.random(0, 1) * 10000}`,
              'assetsData': [1, 2].map((e, i) => {
                return {
                  "assetsId": `${Math.random(0, 1) * 10000}`,
                  "assetsName": `${Math.random(0, 1) * 10000}`,
                  'partsData': [1, 2, 3].map((e, i) => {
                    return {
                      'partsName': `${Math.random(0, 1) * 10000}`,
                      'partsModeName': `${Math.random(0, 1) * 10000}`,
                      'manufactorName': `${Math.random(0, 1) * 10000}`,
                      'madeName': `${Math.random(0, 1) * 10000}`,
                      'supplierName': `${Math.random(0, 1) * 10000}`,
                    }
                  })
                }
              })

             
            }
          }),
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//获取某设备的检修记录
    api: '/mock/v3/ledger/device/defect/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3, 4,].map((e, i) => {
        return {
          "defectId": `${Math.random(0, 1) * 10000}`,
          "defectLevel": `${Math.random(0, 1) * 100}`,
          "defectDescribe": `test${i + 1}`,
          "defectSolveInfo": `${Math.random(0, 1) * 100}`,
          "replaceParts": `${Math.random(0, 1) * 100}`,
          "assetsCode": `${Math.random(0, 1) * 100}`,
          "createTime": `${Math.random(0, 1) * 100}`,
          "finishTime": `${Math.random(0, 1) * 100}`,
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {//获取某设备的历史告警
    api: '/mock/v3/alarm/device/deviceCode/warningType',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': [1, 2, 3, 4,].map((e, i) => {
        return {
          "warningLevel": `${i}`,
          "warningLogId": `${Math.random(0, 1) * 100}`,
          "warningConfigName": `test${i + 1}`,
          "warningCheckDesc": `${Math.random(0, 1) * 100}`,
          "timeOn": `${Math.random(0, 1) * 100}`,
          "durationTime": `${Math.random(0, 1) * 100}`,
        }
      }),
    },
    delay: 1000,
    error: { data: '请求失败' }
  },
  {
    //获取某电站下的设备类型

    api: '/mock/v3/ledger/devicetype/stationCode',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data': {
        collectorDevices: [{
          deviceCode: 11,
          deviceName: '集电线路1',
          type: 1,

        }, {
          deviceCode: 12,
          deviceName: '集电线路2',
          type: 1,

        }],
        boostDevices: [{
          deviceCode: 22,
          deviceName: '升压站1',
          type: 1,

        }],
        undefinedDevices: [{
          deviceCode: 33,
          deviceName: '未分类1',
          type: 1,

        }],
      }
    },
    delay: 1000,
    error: { data: '电站下设备类型请求失败' }

  }
]