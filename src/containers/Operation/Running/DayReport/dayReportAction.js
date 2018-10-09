

export const dayReportAction = {
  dayReportLoading: Symbol('dayReportLoading'), // loading
  changeDayReportStore: Symbol('changeDayReportStore'), // store变化
  dayReportFetchSuccess: Symbol('dayReportFetchSuccess'), // api成功调用
  resetDayReportStore: Symbol('resetDayReportStore'), // reset store数据

  toChangeDayReportStore: Symbol('toChangeDayReportStore'),
  getDayReportList: Symbol('getDayReportList'),
} 