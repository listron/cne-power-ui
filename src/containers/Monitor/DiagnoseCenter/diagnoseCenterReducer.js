

const diagnoseCenterAction = {
  getEventstatus: Symbol('getEventstatus'),
  getEventtypes: Symbol('getEventtypes'),
  getDiagnoseList: Symbol('getDiagnoseList'),
  circlingQueryList: Symbol('circlingQueryList'),
  stopCircleQueryList: Symbol('stopCircleQueryList'),
  getEventsAnalysis: Symbol('getEventsAnalysis'),

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
};

const initState = {
  pageKey: 'alarm', // 激活页 alarm告警事件 diagnose诊断时间 data数据事件
  showAnalysisPage: false, // 展示侧边分析页 
  analysisEvent: {}, // 选中用于分析的信息
  listParams: {
    eventType: 1, // 1告警事件, 2诊断事件, 3数据事件;
    finished: 0, // 1归档事件, 0非归档事件
    stationCode: null, // 电站编码
    deviceTypeCode: null, // 设备类型编码
    eventCode: null, // 标准事件编码
    eventStatus: null, // 事件状态编码
    eventLevel: null, // 事件级别
    startTime: null, //  起始时间
    endTime: null, // 终止事件
    hassum: 1, // 1包括汇总信息, 0不包括
  }, // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
  listPage: {
    pageNum: 1, // 页码
    pageSize: 10, // 页容量
    sortField: 'eventStatus', // 排序 告警事件eventCode;事件级别eventLevel;设备类型deviceTypeName;设备名称deviceName;发生时间beginTime;持续时长duration;事件状态eventStatus; 发生频次frequency
    sortMethod: 'desc', // 排序方式 asc升序 + desc降序
  }, // 表格排序方式, 表格当前页, 表格每页数据量
  eventstatus: [], // 事件状态信息
  alarmEventtypes: [], //告警事件信息
  diagnEventtypes: [], // 诊断事件信息
  dataEventtypes: [], // 数据事件信息
  diagnoseListLoading: false, // 表格请求loading
  diagnoseListData: [], // 表格信息
  diagnoseUpdateTime: '--', // 表格数据更新时间
  totalNum: 0, // 总量
  summaryInfo: {}, // 汇总统计
  eventAnalysisLoading: false, // 时间分析loading状态
  eventAnalysisInfo: {}, // 告警事件分析结果
};

const diagnoseCenter = (state = initState, action) => {
  switch (action.type) {
    case diagnoseCenterAction.fetchSuccess :
      return { ...state, ...action.payload };
    case diagnoseCenterAction.changeStore:
      return { ...state, ...action.payload };
    case diagnoseCenterAction.reset:
      return initState;
  }
  return state;
};

export { diagnoseCenterAction, diagnoseCenter };
