

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
    login: '/v3/login',
    loginPhoneCode: '/v3/login/phonecode',
    getVerificationCode: '/v3/login/verificationcode/',
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
    }
  }
}