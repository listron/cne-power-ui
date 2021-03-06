

const diagnoseCenterAction = {
  getEventstatus: Symbol('getEventstatus'),
  getEventtypes: Symbol('getEventtypes'),
  getDiagnoseList: Symbol('getDiagnoseList'),
  circlingQueryList: Symbol('circlingQueryList'),
  stopCircleQueryList: Symbol('stopCircleQueryList'),
  getEventsAnalysis: Symbol('getEventsAnalysis'),
  editEventsStatus: Symbol('editEventsStatus'),
  getLinkageList: Symbol('getLinkageList'),
  getEamRegisterWaring: Symbol('getEamRegisterWaring'),
  // 查询告警登记记录
  getEamDiagList: Symbol('getEamDiagList'),
  // 获取EAM故障登记详情
  getEamFaultDetails: Symbol('getEamFaultDetails'),
  // 获取EAM故障缺陷详情
  getEamDefectDetails: Symbol('getEamDefectDetails'),

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
};

const initState = {
  fromOutside: false, // 是否从外系统携凭证免登陆进入本系统的
  pageKey: 'alarm', // 激活页 alarm告警事件 diagnose诊断时间 data数据事件
  showAnalysisPage: false, // 展示侧边分析页
  showEamPage: false, // 展示Eam登记详情
  filterBoxType: 'items', // 手动控制筛选条件的显隐; 默认items, 切换tabs变为none
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
  selectedRows: [], // 选中的告警项内容
  statusChangeText: '', // 主页面更变告警状态时提示
  linkedStatusChangeText: '', // 分析也联动列表状态更变提示
  allEventsStatus: [], // 事件状态信息
  alarmEventtypes: [], //告警事件信息
  diagnEventtypes: [], // 诊断事件信息
  dataEventtypes: [], // 数据事件信息
  diagnoseListLoading: false, // 表格请求loading
  diagnoseListError: false, // 表格data error
  diagnoseListData: [], // 表格信息
  diagnoseUpdateTime: '--', // 表格数据更新时间
  totalNum: 0, // 总量
  summaryInfo: {}, // 汇总统计
  eventAnalysisLoading: false, // 时间分析loading状态
  eventAnalysisInfo: {}, // 告警事件分析结果
  showEmptyDataTip: false, // 图表无数据时弹出提示语

  isMoreData: false, // 显示联动表格跳转后的数据时，不跳向其他页面
  linkageListLoading: false, // 线型图-联动决策表格loading
  linkageListError: false, // 线型图-联动决策表格loading
  linkageListData: [], // 线型图-联动决策表格数据
  oldAnalysisEvent: {}, // 最初选中的事件信息
  interval: null, // 最初选中的事件时间间隔
  filterLoading: false, // 切换时间或者数据间隔时加载echarts图
  isChartLoading: false, // 联动决策返回原线型图数据时加载echarts图
  isBackEvent: false, // 显示原来的事件详情信息
  linkagePage: '', // 联动决策返回原测点数据时的事件
  diagWarningId: '', // 事件的告警记录Id

  diagLoading: false,
  detailLoading: false,
  eamFaultData: { // 获取EAM故障详情
    faultNo: '',
    stationName1: '',
    stationName2: '',
    stopType: '',
    assetNo1: '',
    assetNo2: '',
    location1: '',
    location2: '',
    faultCode1: '',
    faultCode2: '',
    manufacturer: '',
    model: '',
    faultLevel: '',
    faultSysType1: '',
    faultSysType2: '',
    monitorSysFault: '',
    status: '',
    createName: '',
    createTime: '',
    faultStartTime: '',
    faultEndTime: '',
    reason: '',
  },
  eamDefectData: { // 获取EAM缺陷详情
    defectNo: '',
    stationName1: '',
    stationName2: '',
    defectType: '',
    assetNo1: '',
    assetNo2: '',
    location1: '',
    location2: '',
    defectDetail: '',
    status: '',
    createName: '',
    createTime: '',
    projectSource: '',
    phone: '',
    faultStartTime: '',
    woprofess: '',
  },
  eamDetailParams: { // EAM登记详情
    eventName: '',
    eventDesc: '',
    deviceTypeName: '',
    deviceName: '',
    stationName: '',
    type: 1,
  },
  workOrderList: [], // 子工单列表
  eamDiagList: [], // 查询告警登记记录
  bgcIndex: 0, // 黄色背景
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
