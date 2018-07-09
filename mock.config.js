

const homeData = require('./mock/home') 
const testData = require('./mock/test')
const inspectionList = require('./mock/operation/MockinspectionList');
const defectList = require('./mock/operation/MockDefectList');
const enterprise = require('./mock/system/enterprise');

exports.mockConfig = [
  ...homeData,
  ...testData,
  ...inspectionList,
  ...defectList,
  ...enterprise,
]