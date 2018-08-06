

import config from '../config/apiConfig';

export default {
  basePaths:{
    APIBasePath: config.apiHostUri,
    newAPIBasePath: config.newApiHostUri,
    TokenBasePath: config.tokenUri
  },
  commonPaths:{
    imgUploads:'/v3/uploadfile', //上传文件
    getStations: '/PointAdmin/QueryAllStationDto',
    getDevicetypes: '/v3/station/devicetypes',
    getDevices: '/v3/station/stationdevices',
    getPartitions: '/v3/station/partitions',
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
      departmentInfor: '/v3/department', //部门信息新增，编辑，详情
      departmentAllList: '/v3/department/all', //所有部门列表
      
      getRoleList: '/v3/role/list',
      getMenuList: 'v3/right',
      createRole: '/v3/role',
      editRole: '/v3/role/{enterpriseId}',
      deleteRole: '/v3/role',
    },
    monitor: {//实时监控
      seriesinverterDetail: '/api/v3/monitor/seriesinverter',//组串式逆变器详情
      seriesinverterTenMin: '/api/v3/monitor/seriesinverter/sequencechart',//组串式逆变器10min时序图
      confluenceboxDetail: '/api/v3/monitor/confluencebox',//汇流箱详情
      confluenceboxTenMin: '/api/v3/monitor/confluencebox/sequencechart',//汇流箱10min时序图
      boxtransformerDetail: '/api/v3/monitor/boxtransformer',//箱变详情
      boxtransformerTenMin: '/api/v3/monitor/boxtransformer/sequencechart',//箱变10min时序图
      weatherstationDetail: '/api/v3/monitor/weatherstation', //气象站详情
      monitorPointData: '/api/v3/monitor/point', //设备测点数据
    }
  }
}