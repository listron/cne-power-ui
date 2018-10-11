const homeData = require('./mock/home')
const testData = require('./mock/test')
const inspectionList = require('./mock/operation/MockinspectionList');
const defectList = require('./mock/operation/MockDefectList');
const enterprise = require('./mock/system/enterprise');
const department = require('./mock/system/department');
const getVerificationCode = require('./mock/login/getVerificationCode');
const user = require('./mock/system/user');
const stationManage = require('./mock/system/stationManage');

const monitor =require('./mock/monitor/stationMonitor')

const singleStationMonitor = require('./mock/monitor/singleStationMonitor');
const monitorDevice = require('./mock/monitor/deviceMonitor');
const others = require('./mock/others/other');

const plan = require('./mock/system/plan');
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
  ...plan,

  ...stationManage, //电站管理-电站

  ...monitor,

  ...singleStationMonitor,
  ...monitorDevice, //监控-单设备详情
  ...others,
]
