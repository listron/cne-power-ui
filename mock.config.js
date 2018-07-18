

const homeData = require('./mock/home') 
const testData = require('./mock/test')
const inspectionList = require('./mock/operation/MockinspectionList');
const defectList = require('./mock/operation/MockDefectList');
const enterprise = require('./mock/system/enterprise');
const getVerificationCode = require('./mock/login/getVerificationCode');
const user = require('./mock/system/user');

exports.mockConfig = [
  ...homeData,
  ...testData,
  ...inspectionList,
  ...defectList,
  ...enterprise,
  ...getVerificationCode,
  ...user,
]