module.exports = [
  {//生产计划
    api: '/mock/system/planList',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 110,
        "planData": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((e, i) => ({
          region:'山东',
          stationCode: i,
          stationName: `第${i}个部门`,
          stationType: i,
          stationCapacity: '234252',
          planYear: 2018,
          planPower: parseInt(Math.random()*100000+1000),
          currentYear: 2018,
          currentMonth: 10,
          yearPR: '2380',
          onGridTime: 'null',
          monthPlanPowers:{
            planMonth:[1,2,3,4,5,6,7,8,9,10,11,12],
            planMonthGen: ['123', '24', '556', '35', '345', '546', '123', '24', '556', '35', '345', '546',]
          }
        }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {//编辑
    api: '/mock/system/editPlanInfo',
    method: 'put',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '编辑成功！'
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },
  {//添加生产计划
    api: '/mock/system/addPlanInfo',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '添加成功！'
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }
]
