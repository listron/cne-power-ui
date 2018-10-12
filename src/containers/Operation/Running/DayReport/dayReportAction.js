

export const dayReportAction = {
  dayReportLoading: Symbol('dayReportLoading'), // loading
  changeDayReportStore: Symbol('changeDayReportStore'), // store变化
  dayReportFetchSuccess: Symbol('dayReportFetchSuccess'), // api成功调用
  resetDayReportStore: Symbol('resetDayReportStore'), // reset store数据

  toChangeDayReportStore: Symbol('toChangeDayReportStore'), // 发起改变store 
  getDayReportList: Symbol('getDayReportList'), // 获取各电站日报总览列表
  getReportUploadedStation: Symbol('getReportUploadedStation'), // 获取指定日期已上传电站列表
  getDayReportConfig: Symbol('getDayReportConfig'), // 获取日报配置
  getStationBaseReport: Symbol('getStationBaseReport'), // 选中日期+电站后各待上传数据电站基础情况
  dayReportDetail: Symbol('dayReportDetail'), // 获取选中日报详情
  dayReportUpdate: Symbol('dayReportUpdate'), // 更新日报数据
} 