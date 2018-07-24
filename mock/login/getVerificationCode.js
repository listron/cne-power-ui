


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
        "access_token": "ghjhkhgjkjh",   //token
        "token_type": "abc",    //类型
        "expires_in":  "5678678",     //有效期
        "refresh_token": 'fghjkfghjkl',    //token刷新
        "scope": 'read',       //读写
        "enterpriseId": '5678',   //企业id  （目前只是单个企业）
        "enterpriseName": '协合新能源',  //企业名称
        "userName": 'cne',      //用户名
        "userFullName": 'cnegroup',  //用户姓名
        "right": 'fhdjfdfj',     //所拥有权限英文名（逗号隔开）
        "userStatus":  '0', //用户状态Id
        "userEnterpriseStatus": '67890', //用户企业状态Id
        "auto": '1',	//"1":系统自动生成, "0":非系统生成
        "jti": 'fhdfdkfjdk',
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