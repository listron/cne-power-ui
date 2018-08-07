const homeData = require('./mock/home')
const testData = require('./mock/test')
const inspectionList = require('./mock/operation/MockinspectionList');
const defectList = require('./mock/operation/MockDefectList');
const enterprise = require('./mock/system/enterprise');
const department = require('./mock/system/department');
const getVerificationCode = require('./mock/login/getVerificationCode');
const user = require('./mock/system/user');
const singleStationMonitor = require('./mock/monitor/singleStationMonitor');



// as
exports.mockConfig = [
  ...homeData,
  ...testData,
  ...inspectionList,
  ...defectList,
  ...enterprise,
  ...department,
  ...getVerificationCode,
  ...user,
  ...singleStationMonitor,
]
