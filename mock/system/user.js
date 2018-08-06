module.exports =[{
  api:'/mock/api/v3/user/list',//用户列表
  method:'post',
  response:{
    "code": "10000",
    "message": "请求成功",
    "data": {
      "totalNum": 10,
      "userData":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
        userId: i,
        userName: '周树人',
        phoneNum: `15501${parseInt(Math.random()*1000000)}`,
        roleName: '运维工',
        spcialRoleName: '删除，添加',
        stationName: '广平,顺义,夏威夷,抚平',
        userStatus: Math.floor(Math.random()*7+1),
      }))
    },
    "serviceCode": "3.0"
  },
  delay:1000,
  error:{}
},{
  api:'/mock/api/v3/userDetail',
  //api:'/api/v3/user/{userId}',//用户详情
  method:'get',
  response:{
    "code": "10000",
    "message": "请求成功",
    "data": {
      userId: 0,
      username: `王小二`,
      fullName: `王小三`,
      phoneNum: `15501${parseInt(Math.random()*1000000)}`,
      Email: '119118117@qq.com',
      createtime:'2018/08/01',
      enterpriseUserStatus:Math.floor(Math.random()*6),
      webChat: 'hdjfhdbchdjssdnbfdn',
      roleName: '删除，添加',
      specialRoleName: '删除，添加',
      enterpriseData: {
        enterpriseId: '6788',
        enterpriseName: '协和系能源',
        departmentData: {
          departmentId: '6789',
          departmentName: '协和运维',
          stationData: {
            stationId:'456789',
            stationName: '夏威夷电站',
          }
        }
      },
    },
    "serviceCode": "3.0"
  },
  delay:1000,
  error:{}
},{
  api: '/api/v3/user',//编辑用户
  method:'put',
  response:{
    "code": "10000",
    "message": "请求成功",
    "data": {
      "msg": '添加成功',
    },
    "serviceCode": "3.0"
  },
  delay:1000,
  error:{}
},{
  api: '/api/v3/createUser',//新建用户
  method:'post',
  response:{
    "code": "10000",
    "message": "请求成功",
    "data": {
      "msg": '添加成功',
    },
    "serviceCode": "3.0"
  },
  delay:1000,
  error:{}
},{
  api: '/api/v3/user/status',//更改用户状态
  method:'put',
  response:{
    "code": "10000",
    "message": "更改成功",
    "data": {
      "msg": '更改成功',
    },
    "serviceCode": "3.0"
  },
  delay:1000,
  error:{}
}]
