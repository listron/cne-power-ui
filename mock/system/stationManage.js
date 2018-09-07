

module.exports = [
  { // 电站管理列表
    api: '/mock/system/stationList/001',
    method: 'get',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 110, 
        "departmentData":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          departmentId: i,
          departmentName: `第${i}个部门`,
          parentDepartmentName: `${i*2+2}号父部门`,
          departmentSource: i%2,
          stationName:`${['1号','2号','3号','4号','5号','6号','8号','9号','10号'][i]}电站,${10+i}电站,${20+i}电站`,
          hasChildren: !!(i%2),
          hasMember: !!(i%2),
        }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }, { // 选中电站详情
    api:'/mock/system/stationDetail/001',
    method:'get',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        departmentId:'11111',	
        departmentName:'全能战斗部',	
        parentDepartmentName:'abc传说部',	
        createUser:'孙思邈',
        createtime:'公元前2年2月2日，22点22分22秒',	
        updateUser: '张仲景',
        updateTime: '公元215年甲戌月干丑日子时二刻'
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }, { // 保存修改的电站详情
    api:'/mock/system/saveStationDetail',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '修改成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{ // 分配部门至电站
    api:'/mock/system/setDepartment',
    method:'post',
    response:{
      "code": "10000",
      "message": "请求成功",
      "data": {
        text: '删除成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }
]