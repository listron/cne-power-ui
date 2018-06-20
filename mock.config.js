

const homeData = require('./mock/home') 
const testData = require('./mock/test')
const inspectionList = require('./mock/operation/MockinspectionList')
const defectList = require('./mock/operation/MockDefectList')

exports.mockConfig = [
  ...homeData,
  ...testData,
  ...inspectionList,
  ...defectList
]