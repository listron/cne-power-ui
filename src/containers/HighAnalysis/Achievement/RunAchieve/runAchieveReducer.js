import immutable from 'immutable';

export const runAchieveAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDevices: Symbol('getDevices'),
  getSequenceChart: Symbol('getSequenceChart'),
  getFirstChart: Symbol('getFirstChart'),
  getSecondChart: Symbol('getSecondChart'),
  getThirdChart: Symbol('getThirdChart'),
  getFourthChart: Symbol('getFourthChart'),
  getPointsInfo: Symbol('getPointsInfo'),
};

const initState = immutable.fromJS({
  modesInfo: [],
  modeDevices: [],
  checkedMonths: [],
  allMonths: [],
  pointsInfo: [],
  pointTime: 0,

  hourOptionValue: 'TR002', // 功率
  hourOptionName: '有功功率有功功率有功功率',
  hourUnitName: 'kw',
  sequenceTime: 0,
  sequenceLoading: false,
  sequenceData: [],

  // 第一个散点图坐标
  firstChartXAxis: 'NC001', // 风速
  firstChartYAxis: 'TR002', // 功率
  firstChartTime: 0,
  firstChartLoading: false,
  firstChartData: [],
  firstXAxisName: '',
  firstXAxisUnit: 'm/s',
  firstYAxisName: '',
  firstYAxisUnit: 'kw',
  firstHideZero: 1,

  // 第二个散点图坐标
  secondChartXAxis: 'NC001', // 风速
  secondChartYAxis: 'RT101', // 桨叶角
  secondChartTime: 0,
  secondChartLoading: false,
  secondChartData: [],
  secondXAxisName: '',
  secondXAxisUnit: 'm/s',
  secondYAxisName: '',
  secondYAxisUnit: '°',
  secondHideZero: 1,

  // 第三个散点图坐标
  thirdChartXAxis: 'GN001', // 发电机转速
  thirdChartYAxis: '', // 扭矩
  thirdChartTime: 0,
  thirdChartLoading: false,
  thirdChartData: [],
  thirdXAxisName: '',
  thirdXAxisUnit: 'Rpm',
  thirdYAxisName: '',
  thirdYAxisUnit: 'Nm',
  thirdHideZero: 1,

  // 第四个散点图坐标
  fourthChartXAxis: 'NC001', // 风速
  fourthChartYAxis: 'GN001', // 发电机转速
  fourthChartTime: 0,
  fourthChartLoading: false,
  fourthChartData: [],
  fourthXAxisName: '',
  fourthXAxisUnit: 'm/s',
  fourthYAxisName: '',
  fourthYAxisUnit: 'Rpm',
  fourthHideZero: 1,
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
