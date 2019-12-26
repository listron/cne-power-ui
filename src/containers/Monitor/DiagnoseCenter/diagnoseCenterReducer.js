

const diagnoseCenterAction = {

  getDiagnoseList: Symbol('getDiagnoseList'),
  analysisEvent: Symbol('analysisEvent'),
  stopCircleQueryList: Symbol('stopCircleQueryList'),
  circlingQueryList: Symbol('circlingQueryList'),

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
};

const initState = {
  tab: 'alarm', // 激活页 alarm告警事件 diagnose诊断时间 data数据事件
  listParams: {

  }, // 列表请求参数: 电站, 设备类型, 发生时间, 告警事件, 事件状态, 归档事件, 
  listPage: {

  }, // 表格排序方式, 表格当前页, 表格每页数据量
  listData: [], // 表格信息
  totalNum: 0, // 总量
  summaryInfo: {}, // 汇总统计

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
