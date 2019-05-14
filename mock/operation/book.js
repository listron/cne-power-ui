
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
          childNodeNum:4,
          childernNodes: [1,].map((e, i) => ({
            assetsId: `0,1,2`,
            assetsName: `二级${e}`,
            assetsType: `2`,
            isBuild: 0,
            childNodeNum:3,
            childernNodes: [1,].map((e, i) => ({
              assetsId: `0,1,2,3`,
              assetsName: `三级${e}`,
              assetsType: `3`,
              isBuild: 1,
              childNodeNum:2,
              childernNodes: [1,  ].map((e, i) => ({
                assetsId: `0,1,2,3,4`,
                assetsName: `四级${e}`,
                assetsType: `3`,
                isBuild: 1,
                childNodeNum:1,
                childernNodes: [1,].map((e, i) => ({
                  assetsId: `0,1,2,3,4,5`,
                  assetsName: `五级${e}`,
                  assetsType: `3`,
                  isBuild: 1,
                  childNodeNum:0,
                })),
              })),
            })),
          })),
        }
      }),
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {data:'请求失败'}
  },
  {//生产资产节点详细信息
    api: '/mock/v3/ledger/detail',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data':[1, 2, 3, 4, 5, 6].map((e, i)=>{
        return{
          "assetsId":`${Math.random(0, 1) * 10000}`,
          "assetsCode":`${Math.random(0, 1) * 10000}`,
          "assetsName":`test${i+1}`,
          "assetsType":`1`,
          "assetsUnit":`${Math.random(0, 1) * 10000}`,
          "createTime":`${Math.random(0, 1) * 10000}`,
          "operateUser":`${Math.random(0, 1) * 10000}`,
          'isBuild':`${i>2?1:0}`
        }
      }),
    },
    delay: 1000,
    error: {data:'请求失败'}
  },
  {
    api: '/mock/v3/ledger/devicemanufactors/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data':[1, 2, 3, 4, 5, 6].map((e, i)=>{
        return{
          "manufactorCode":`${Math.random(0, 1) * 10000}`,
          "manufactorId":`${Math.random(0, 1) * 10000}`,
          "manufactorName":`test${i+1}`,
          "createTime":`${Math.random(0, 1) * 10000}`,
          "operateUser":`${Math.random(0, 1) * 10000}`,

        }
      }),
    },
    delay: 1000,
    error: {data:'请求失败'}
  },
  {
    api: '/mock/v3/ledger/devicemodes/list',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      'data':[1, 2, 3, 4, 5, 6].map((e, i)=>{
        return{
          "modeId":`${Math.random(0, 1) * 10000}`,
          "deviceModeCode":`${Math.random(0, 1) * 10000}`,
          "deviceModeName":`$test{i+1}`,
          "manufactorName":`$test{i+2}`,
          "manufactorCode":`${Math.random(0, 1) * 10000}`,
          "createTime":`${Math.random(0, 1) * 10000}`,
          "operateUser":`${Math.random(0, 1) * 10000}`,
        }
      }),
    },
    delay: 1000,
    error: {data:'请求失败'}
  }
]