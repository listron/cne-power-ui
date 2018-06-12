

import config from '../config/apiConfig';

export default {
  basePaths:{
    APIBasePath: config.apiHostUri,
    newAPIBasePath: config.newApiHostUri,
    TokenBasePath: config.tokenUri
  },
  commonPaths:{
    imgUploads:'/Pv/Utils/UploadFiles',
  },
  APISubPaths: {
    getCompInfo: '/v3/enterprise/domainLogin',
    login: '/v3/login',
    checkPhone: '/v3/user/validateEnterpriseRegPhoneNum',
    sendCode: '/v3/common/requestSmsCode',
    checkCode: '/v3/user/validateCaptcha',
    logout: '/v3/user/logout',
    createRegister: '/v3/link/createRegisterLink',
    getCompInfoBylink: '/v3/link/queryEnterpriseInfoByLinkCode',
    changePassword: '/v3/user/changeUserPassword',
    signup: '/v3/user/userRegister',
    getShowStatus: '/v3/relation/queryShowStatus',
    changeShowStatus: '/v3/relation/changeShowStatus',
    ticket: {
      getDefectList: '/v3/defect/worklist',

    }
  }
}