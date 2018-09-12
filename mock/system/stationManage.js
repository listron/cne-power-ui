

module.exports = [
  { // 电站管理列表
    api: '/mock/system/stationList/001',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "total": 95,
        "list":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          stationCode: i,
          stationName: `${i}号电站`,
          stationType: i%2,
          coverType: `${i}种覆盖`,
          agencyType: i,
          stationCapacity: i*i/100,
          deviceStatus:!!(i%2),
          pointStatus: !(i%2),
          alarmStatus: !!(i%2),
          departmentStatus: !(i%2),
          stationStatus: !!(i%2),
          stationDepartment: ['0','0-1','0-1-1','2']
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
        stationCode: 1,	
        stationName:'电站1号',	
        stationType: 2,	
        coverType: '覆盖类型哈哈哈',
        createtime:'公元前2年2月2日，22点22分22秒',	
        longitude: 0.1124545122,
        latitude: 0.1124545122,
        affiliateCompany: '新能源大佬！',
        provinceCode: 54,
        provinceName: '北京',
        cityCode: 420,
        cityName: '海淀',
        countyCode: 124,
        countyName: '左勾拳',
        timeZone: 8,
        floorArea: 0.1245757,
        agencyType: 142,
        designCapacity: 0.121567,
        stationCapacity: 0.45521,
        ongridTime: '2018-01-12',
        fullOngridTime: '2018-03-12',
        designUtilizationHours: '3487',
        gridVoltageLevel: 4,
        gridSubstationName: '做不完',
        automaticActiveControl: true,
        automaticAeactiveContro: false,
        lowPressureCrossing: false,
        gridConnectionDetection: true,
        monitoringSystemCount: 4245,
        monitoringSystemName: '1,2,3,4,5,5,5,5,5,5,5,5,,5,',
        stationContactNumber: '15511224444',
        stationStatus: true,
        activeStatus: true,
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  }, { // 保存修改的电站详情
    api:'/mock/system/saveStationDetail',
    method:'put',
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
  },{ // 删除电站
    api:'/mock/system/deleteStation',
    method:'delete',
    response:{
      "code": "10000",
      "message": "删除成功",
      "data": {
        text: '删除成功了！'  
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
        text: '分配部门成功了！'  
      },
      "serviceCode": "3.0"
    },
    delay:1000,
    error:{}
  },{ // 请求设备列表
    api: '/mock/system/deviceManage/deviceList',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 95,
        "context":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          deviceFullCode: i,
          deviceName: `设备${i}号`,
          deviceTypeCode: i*2,
          deviceTypeName: `类${i}型`,
          deviceTypeCode: i*3,
          deviceModeCode: i*4,
          deviceModeName: `型号${i}`,
          producerCode: i*i,
          producerName: `型号${i*i}`,
          connectDeviceFullCode: i*i*2,
          connectDeviceName: `关联设备名称${i*i*2}`,
          deviceCapacity: 10*i,
          enableDisplay: !!(i%2),
        }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{ // 请求测点列表
    api: '/mock/system/pointManage/pointsList',
    method: 'post',
    response: {
      "code": "10000",
      "message": "请求成功",
      "data": {
        "totalNum": 95,
        "context":  [1,2,3,4,5,6,7,8,9,0].map((e,i)=>({
          deviceFullCode: i,
          deviceName: `测点${i}号`,
          deviceTypeCode: i*2,
          deviceTypeName: `类${i}型`,
          deviceTypeCode: i*3,
          deviceModeCode: i*4,
          deviceModeName: `型号${i}`,
          producerCode: i*i,
          producerName: `型号${i*i}`,
          connectDeviceFullCode: i*i*2,
          connectDeviceName: `关联设备名称${i*i*2}`,
          deviceCapacity: 10*i,
          enableDisplay: !!(i%2),
        }))
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  },{
    api: '/mock/system/pointManage/deletePointList',
    method: 'delete',
    response: {
      "code": "10000",
      "message": "删除成功",
      "data": {
        "text": '删除测点成功'
      },
      "serviceCode": "3.0"
    },
    delay: 1000,
    error: {}
  }
]

