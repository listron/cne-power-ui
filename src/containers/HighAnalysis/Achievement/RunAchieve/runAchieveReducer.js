import immutable from 'immutable';

export const runAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDevices: Symbol('getDevices'),
  getIndicatorsList: Symbol('getIndicatorsList'),
  getSequenceChart: Symbol('getSequenceChart'),
  getFirstChart: Symbol('getFirstChart'),
  getSecondChart: Symbol('getSecondChart'),
  getThirdChart: Symbol('getThirdChart'),
  getFourthChart: Symbol('getFourthChart'),
};

const initState = immutable.fromJS({
  modesInfo: [],
  modeDevices: [],
  indicatorsList: [],
  checkedMonths: [],
  allMonths: [],

  hourOptionValue: 'TR002', // 功率
  sequenceTime: 0,
  sequenceLoading: false,
  sequenceData: [],

  // 第一个散点图坐标
  firstChartXAxis: 'NC002', // 风速
  firstChartYAxis: 'TR002', // 功率
  firstChartTime: 0,
  firstChartLoading: false,
  firstChartData: [],

  // 第二个散点图坐标
  secondChartXAxis: 'NC002', // 风速
  secondChartYAxis: 'RT101', // 桨叶角
  secondChartTime: 0,
  secondChartLoading: false,
  secondChartData: [],

  // 第三个散点图坐标
  thirdChartXAxis: 'GN001', // 发电机转速
  thirdChartYAxis: 'CV002', // 扭矩
  thirdChartTime: 0,
  thirdChartLoading: false,
  thirdChartData: [],

  // 第四个散点图坐标
  fourthChartXAxis: 'NC002', // 风速
  fourthChartYAxis: 'GN001', // 发电机转速
  fourthChartTime: 0,
  fourthChartLoading: false,
  fourthChartData: [],
});

export const achieveRun = (state = initState, action) => {
  switch (action.type) {
    case runAchieveAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case runAchieveAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case runAchieveAction.resetStore:
      return initState;
  }
  return state;
};
