

import config from '../config/apiConfig';

export default {
  basePaths:{
    APIBasePath: config.apiHostUri,
    TokenBasePath: config.tokenUri
  },
  commonPaths:{
    imgUploads:'/v3/uploadfile', //上传文件
    getStations: '/v3/station/datalist',//按照用户权限获取电站
    getDevicetypes: '/v3/station/devicetype',
    getStationDevicetypes: '/v3/station/devicetypes',
    getDevices: '/v3/station/stationdevices',
    getPartitions: '/v3/station/partitions',
    // getRefreshToken: '/v3/oauth/token' --todo 根据过期token中携带的refreshToken获取新token接口。
  },
  APISubPaths: {
    getCompInfo: '/v3/enterprise/domainLogin',
    checkPhone: '/v3/user/validateEnterpriseRegPhoneNum',
    sendCode: '/v3/common/requestSmsCode',
    checkCode: '/v3/user/validateCaptcha',
    logout: '/v3/user/logout',
    createRegister: '/v3/link/createRegisterLink',
    getCompInfoBylink: '/v3/link/queryEnterpriseInfoByLinkCode',
    changePassword: '/v3/user/changeUserPassword',
    signup: '/v3/user/userRegister',
    signupSendCode: '/v3/common/requestSmsCode',
    getShowStatus: '/v3/relation/queryShowStatus',
    changeShowStatus: '/v3/relation/changeShowStatus',
    // 新的登陆注册接口
    login: '/v3/login',
    getVerificationCode: '/v3/login/verificationcode',
    getEnterpriseInfo: '/v3/login/enterpriseinfo',
    loginPhoneCode: '/v3/login/phonecode',
    joinEnterprise: '/v3/login/userenterprise',
    loginPhoneRegister: '/v3/login/phoneregister',
    checkEnterpriseDomain: '/v3/login/enterprisedomain',
    checkEnterpriseName: '/v3/login/enterprise',
    resetPassword: '/v3/login/password',
    registerEnterprise: '/v3/login/enterpriseregister',
    checkUserRegister: '/v3/login/userregister',
    phoneCodeRegister: '/v3/login/phoneregister',

    ticket: {
      getDefectList: '/v3/defect/worklist/pc',
      batchDeleteDefect: '/v3/defect/delete/batch',
      getInspectList: '/v3/inspect/worklist/pc',
      batchSendDefect: '/v3/defect/distribute/batch',
      batchCloseDefect: '/v3/defect/close/batch',
      batchRejectDefect: '/v3/defect/reject/batch',
      batchCheckDefect: '/v3/defect/check/batch',
      getInspectionList: '/v3/inspect/worklist/pc',
      getDefectDetail: '/v3/defect',
      getInspectDetail: '/v3/inspect',
      getCommonList: '/v3/language',
      addInspectAbnormal: '/v3/inspect/abnormal',
      sendDefect: '/v3/defect/distribute',
      rejectDefect: '/v3/defect/reject',
      closeDefect: '/v3/defect/close',
      handleDefect: '/v3/defect/handle',
      checkDefect: '/v3/defect/check',
      getDefectTypes: '/v3/defect/type',
      createNewDefect: '/v3/defect',
      transformDefect: '/v3/inspect/defect',
      setInspectCheck: '/v3/inspect/check',
      finishInspect: '/v3/inspect/finish',
      createInspect:'/v3/inspect',
      deleteAbnormal: '/v3/inspect/deleteabnormal',
      getInspectStandard:'/v3/inspect/standard',
      inspectCheckBatch:'/v3/inspect/check/batch',
    },
    system: {
      getEnterprisList: '/v3/enterprise/list',//企业列表
      getEnterprisDetail: '/v3/enterprise',//企业详情获取
      saveEnterpriseDetail: '/v3/enterprise/change',//保存企业详情
      getDepartmentList: '/v3/department/list',//部门列表
      departmentInfo: '/v3/department', //部门信息新增，编辑，详情，删除
      getAllDepartment: '/v3/department/all', //所有部门列表
      getDepartmentUser: '/v3/department/user', //所有用户列表，用于为部门分配用户
      getDepartmentStation: '/v3/department/station', //所有电站列表，用于为部门分配电站
      setDepartmentUser: '/v3/department/user',//设置部门成员
      setDepartmentStation: '/v3/department/station', //设置部门电站

      getRoleList: '/v3/role/list',
      getMenuList: '/v3/right',
      createRole: '/v3/role',
      editRole: '/v3/role/{enterpriseId}',
      deleteRole: '/v3/role',

      getUserList: '/v3/user/list',//用户列表
      changeUserStatus: '/v3/user/status',//更改用户状态
      getUserDetail: '/v3/user/',//用户详情
      editUserInfo: '/v3/user',//编辑用户
      createUserInfo: '/v3/user',//新建用户
      getInviteLink: '/v3/user/link',//邀请用户
      getRoleAllList: '/v3/role/all/list',//获取企业角色
      importUserBatch: '/v3/user/batch',//批量导入用户
    },
    monitor: {//实时监控
      getStationType:'/v3/monitor/stations/',
      stationDeviceList: '/v3/station/devicelist', // 单电站设备列表获取
      seriesinverterDetail: '/v3/monitor/seriesinverter',//组串式逆变器详情
      seriesinverterTenMin: '/v3/monitor/seriesinverter/sequencechart',//组串式逆变器10min时序图
      confluenceboxDetail: '/v3/monitor/confluencebox',//汇流箱详情
      confluenceboxTenMin: '/v3/monitor/confluencebox/sequencechart',//汇流箱10min时序图
      boxtransformerDetail: '/v3/monitor/boxtransformer',//箱变详情
      boxtransformerTenMin: '/v3/monitor/boxtransformer/sequencechart',//箱变10min时序图
      weatherstationDetail: '/v3/monitor/weatherstation', //气象站详情
      monitorPointData: '/v3/monitor/point', //设备测点数据
      deviceAlarmData: '/v3/alarm/device', // 单设备告警信息
      getRealtimeAlarm: '/v3/alarm/station/alarmlist', //实时告警信息

      getPvmoduleList: '/v3/monitor/pvmodule/datalist/',//光伏组件实时
      getInverterList: '/v3/monitor/seriesinverter/datalist/',// 组串式逆变器实时
      getBoxTransformerList: '/v3/monitor/boxtransformer/datalist/',//箱变实时
      getSingleStation: '/v3/monitor/station/',//单电站实时数据
      getCapabilityDiagram: '/v3/monitor/capabilitydiagram/',//单电站出力图表
      getMonitorPower: '/v3/monitor/power/',//单电站理论发电量-实际发电量图表
      getStationList: '/v3/station/datalist/',//电站列表
      getWeatherList: '/v3/monitor/weather/',//单电站未来天气
      getOperatorList: '/v3/station/user/',//单电站运维人员列表
      getAlarmList: '/v3/alarm/station/alarmnum/',//单电站活动告警数统计
      getWorkList: '/v3/monitor/worklist/',//单电站工单数统计
      getDeviceTypeFlow: '/v3/station/devicetypeflow/',//单电站设备类型流程图

      
      getHistoryAlarm: '/v3/alarm/station/historyalarmlist',//历史告警
      getStationsAlarmStatistic: '/v3/alarm/stations/alarmsummary',//多电站统计
      getSingleStationAlarmStatistic: '/v3/alarm/station/alarmsummary',//单电站统计
      getAlarmNum: '/v3/alarm/stations/alarmnum', //多电站告警数
      getTicketInfo: '/v3/alarm/worklist/getbyid', //告警工单详情
      getRelieveInfo: '/v3/alarm/getrelievealarm', //屏蔽详情
      
    },
    other: {
      editPassword: './v3/', // 更变密码
    }
    // monitor:{
    //   getStationType:'v3/monitor/stations/stationType',
    // }
  }
}
