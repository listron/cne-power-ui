


module.exports = [
  {
    api:'/mock/systemManage/enterprisList',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "total": 110, 
        "enterpriseList": [
            [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
              stationCode: i,
              stationName: `第${i}个电站`,
              stationPhone: '112121kjhk,112121kjhk,112121kjhk',
              status: i%2,
              web: 'www.baidu.com',
              place: '北京市丰台区芳山镇',
              detail: '我们是一家好企业，大企业！',
            }))
          ]
        },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/systemManage/changeEnterprise',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '创建成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },

]