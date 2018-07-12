


module.exports = [
  {
    api:'/mock/api/v3/login/verificationcode/',//获取验证码
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "verificationCode": "110099",
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login',//密码登录
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
  },{
    api:'/mock/api/v3/login/phonecode',//手机号登录
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '手机号登录成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login/phoneregister',//手机号用户注册
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '手机号注册成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login/enterprisedomain/',//验证企业域名是否有效
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "isRegister": 0,  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login/enterprise/',//验证企业是否注册
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '手机号注册成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },

]