


module.exports = [
  {
    api:'/mock/v3/login/verificationcode',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "verificationCode": 110099,
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/system/changeEnterprisesds',
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