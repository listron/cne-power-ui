const homePage = require('./mock/home/homepage');
const inspectionList = require('./mock/operation/MockinspectionList');
const defectList = require('./mock/operation/MockDefectList');
const enterprise = require('./mock/system/enterprise');
const dayReport = require('./mock/operation/dayReport');

const department = require('./mock/system/department');
const getVerificationCode = require('./mock/login/getVerificationCode');
const user = require('./mock/system/user');
const stationManage = require('./mock/system/stationManage');

const monitor =require('./mock/monitor/stationMonitor')
const dataAnalysis = require('./mock/monitor/dataAnalysis');

const singleStationMonitor = require('./mock/monitor/singleStationMonitor');
const monitorDevice = require('./mock/monitor/deviceMonitor');
const monitorpowerCurve = require('./mock/monitor/powerCurve');
const others = require('./mock/others/other');
const MockStationContrast = require('./mock/statisticalAnalysis/MockStationContrast');
const plan = require('./mock/system/plan');
const allstationanalysis = require('./mock/statisticalAnalysis/allstationanalysis');
const stationContrast = require('./mock/statisticalAnalysis/stationContrast');
const cleanWarning = require('./mock/highAnalysis/cleanWarning');
const score = require('./mock/system/score.js');


// as
exports.mockConfig = [
  ...homePage, // 首页mock

  ...inspectionList,
  ...defectList,
  ...dayReport, // 日报

  ...enterprise,
  ...department,
  ...getVerificationCode,
  ...user,
  ...plan,

  ...stationManage, //电站管理-电站

  ...monitor,
  ...dataAnalysis,
  ...monitorpowerCurve,//监控功率曲线

  ...singleStationMonitor,
  ...monitorDevice, //监控-单设备详情
  ...others,
  ...MockStationContrast,//统计分析-电站对比
  ...allstationanalysis,//电站分析
  ...stationContrast,
  ...cleanWarning, // 高级分析-清洗预警
  ...score,//电站评分
]
