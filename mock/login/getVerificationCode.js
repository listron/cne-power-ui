


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
    api:'/mock/api/v3/login/enterprise/',//验证企业名称是否已注册
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
    api:'/mock/api/v3/login/enterpriseinfo/',//根据域名或名称获取企业信息
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "enterpriseId": '00000000',
        "enterpriseName": '协合新能源',
        'enterpriseLogin': 'https://www.baidu.com/img/bd_logo1.png?where=super',
        'enterpriseDomain': 'www.cnegroup.com'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login/password',//1.1.13.	设置新密码
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "text": '设置新密码成功',  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/api/v3/login/userenterprise',//1.1.10.	加入企业
    method:'get',
    response:{
      "code": "10000",
      "message": "加入企业成功",
      "data": {
        "text": '加入企业成功',  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },

]