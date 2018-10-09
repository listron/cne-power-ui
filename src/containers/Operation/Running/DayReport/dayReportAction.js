

export const dayReportAction = {
  dayReportLoading: Symbol('dayReportLoading'), // loading
  changeDayReportStore: Symbol('changeDayReportStore'), // store变化
  dayReportFetchSuccess: Symbol('dayReportFetchSuccess'), // api成功调用
  resetDayReportStore: Symbol('resetDayReportStore'), // reset store数据

  toChangeDayReportStore: Symbol('toChangeDayReportStore'), // 发起改变store 
  getDayReportList: Symbol('getDayReportList'), // 获取各电站日报总览列表
  dayReportConfig: Symbol('dayReportConfig'), // 获取日报配置
  dayReportDetail: Symbol('dayReportDetail'), // 获取选中日报详情
  dayReportUpdate: Symbol('dayReportUpdate'), // 更新日报数据
} 