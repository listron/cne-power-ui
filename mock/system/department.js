

module.exports = [
  {
    api:'/mock/system/departmentList',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 110, 
        "departmentData":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          departmentId: i,
          departmentName: `第${i}个部门`,
          parentDepartmentName: `${i*2+2}号父部门`,
          departmentSource: i%2,
          stationName:`${['1号','2号','3号','4号','5号','6号','8号','9号','10号'][i]}电站`,
        }))
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{
    api:'/mock/system/addDepartment',
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
    api:'/mock/system/departmentDetail',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        departmentId:'11111',	
        departmentName:'全能战斗部',	
        parentDepartmentName:'abc传说部',	
        userFullNameData:[{
          departmentUserId:123,
          userFullName:'张三啊！'
        },{
          departmentUserId:223,
          userFullName:'李四！'
        }]	,
        stationNameData:[{
          departmentStationId:350,
          stationName:'平原'
        },{
          departmentStationId:360,
          stationName:'勇敢！'
        }],
        createUser:'孙思邈',
        createtime:'公元前2年2月2日，22点22分22秒',	
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{//获取企业下电站信息
    api:'/mock/system/departmentAndStation',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [{
        departmentId:'12',
        departmentName:'运维组',
        stationData:[{
          stationId: 1,
          stationName: '广东'
        },{
          stationId: 2,
          stationName: '广西'
        },{
          stationId: 3,
          stationName: '杭州'
        }],
        childDepartmentData:[
          {
            departmentId:'122',
            departmentName: '运维1组',
            stationData:[{
              stationId: 2,
              stationName: '广西'
            }],
          },{
            departmentId:'121',
            departmentName: '运维2组',
            stationData:[{
              stationId: 1,
              stationName: '广东'
            }],
          }
        ]
      }],
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{//获取企业下人员信息
    api:'/mock/system/departmentAndUser',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": [{
        departmentId:'12',
        departmentName:'运维组',
        userData:[{
          userId: 1,
          userName: 'zhang'
        },{
          userId: 2,
          userName: 'liu'
        },{
          userId: 3,
          userName: 'zhou'
        }],
        childDepartmentData:[
          {
            departmentId:'122',
            departmentName: '运维1组',
            userData:[{
              userId: 2,
              userName: 'liu'
            }],
          },{
            departmentId:'121',
            departmentName: '运维2组',
            userData:[{
              userId: 1,
              userName: 'zhang'
            }],
          }
        ]
      }],
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }
]