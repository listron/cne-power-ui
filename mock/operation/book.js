
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

// return {
//   assetsCode: `${Math.random(0, 1) * 10000}`,
//   assetsId: `${Math.random(0, 1) * 10000}`,
//   assetsName: `一级${e}`,
//   assetsType: `1`,
//   assetsUnit: `一级单位`,
//   isBuild: 0,
//   createTime: `2019-01-0${Math.floor(Math.random(0, 1) * 10)}`,
//   operatorUser: `一级操作人${e}`,
//   twoLevelNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
//     assetsCode: `${Math.random(0, 1) * 10000}`,
//     assetsId: `${Math.random(0, 1) * 10000}`,
//     assetsName: `二级${e}`,
//     assetsType: `2`,
//     assetsUnit: `二级单位`,
//     isBuild: 0,
//     createTime: `2019-02-0${Math.floor(Math.random(0, 1) * 10)}`,
//     operatorUser: `二级操作人${e}`,
//     threeLevelNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
//       assetsCode: `${Math.random(0, 1) * 10000}`,
//       assetsId: `${Math.random(0, 1) * 10000}`,
//       assetsName: `三级${e}`,
//       assetsType: `3`,
//       assetsUnit: `三级单位`,
//       isBuild: 1,
//       createTime: `2019-03-0${Math.floor(Math.random(0, 1) * 10)}`,
//       operatorUser: `三级操作人${e}`,
//       fourLevelNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
//         assetsCode: `${Math.random(0, 1) * 10000}`,
//         assetsId: `${Math.random(0, 1) * 10000}`,
//         assetsName: `四级${e}`,
//         assetsType: `3`,
//         assetsUnit: `四级单位`,
//         isBuild: 1,
//         createTime: `2019-04-0${Math.floor(Math.random(0, 1) * 10)}`,
//         operatorUser: `四级操作人${e}`,
//         fiveLevelNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
//           assetsCode: `${Math.random(0, 1) * 10000}`,
//           assetsId: `${Math.random(0, 1) * 10000}`,
//           assetsName: `五级${e}`,
//           assetsType: `3`,
//           assetsUnit: `五级单位`,
//           isBuild: 1,
//           createTime: `2019-05-0${Math.floor(Math.random(0, 1) * 10)}`,
//           operatorUser: `五级操作人${e}`,
//         })),
//       })),
//     })),
//   })),
// }


module.exports = [
  { // 树
    api: '/mock/v3/ledger/assetslist',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": [1, 2, 3, 4, 5, 6].map((e, i) => {
        return {
          assetsId: `0`,
          assetsName: `一级${e}`,
          assetsType: `1`,
          isBuild: 0,
          childernNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
            assetsId: `0,1`,
            assetsName: `二级${e}`,
            assetsType: `2`,
            isBuild: 0,
            childernNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
              assetsId: `0,1,2`,
              assetsName: `三级${e}`,
              assetsType: `3`,
              isBuild: 1,
              childernNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
                assetsId: `0,1,2,3`,
                assetsName: `四级${e}`,
                assetsType: `3`,
                isBuild: 1,
                childernNodes: [1, 2, 3, 4, 5, 6].map((e, i) => ({
                  assetsId: `0,1,2,3,4`,
                  assetsName: `五级${e}`,
                  assetsType: `3`,
                  isBuild: 1,
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
          "assetsName":`$test{i+1}`,
          "assetsType":`1`,
          "assetsUnit":`${Math.random(0, 1) * 10000}`,
          "createTime":`${Math.random(0, 1) * 10000}`,
          "operateUser":`${Math.random(0, 1) * 10000}`,
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
          "manufactorName":`$test{i+1}`,
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