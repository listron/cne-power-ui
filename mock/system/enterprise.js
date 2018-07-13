


module.exports = [
  {
    api:'/mock/system/enterprisList',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 110, 
        "enterpriseData":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          enterpriseId: i,
          enterpriseName: `第${i}个电站`,
          enterpriseNum: `15501${parseInt(Math.random()*1000000)}`,
          enterpriseStatus: i%2,
        }))
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/system/changeEnterprise',
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
    api:'/mock/system/enterprisDetail/12',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        enterpriseId:'11111',	
        enterpriseIdName:'图书馆电站',	
        enterpriseLogo:'1fjklew',	
        enterpriseNum:'12153413213'	,
        enterpriseDomain:'www.baidu.com',	
        enterpriseWebsite:'www.google.com',	
        enterpriseAddress:'北京市丰台区白石桥南',	
        enterpriseProfile:'新能源崛起！',
        enterpriseStatus:1,
        createUser:'孙思邈',
        createPhone: 15214449995,
        createtime:'公元前2年2月2日，22点22分22秒',	
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
    
  }

]