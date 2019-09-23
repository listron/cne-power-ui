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
  hourOptionName: '有功功率',
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
  firstXAxisName: '机舱外风速实时值',
  firstXAxisUnit: 'm/s',
  firstYAxisName: '有功功率',
  firstYAxisUnit: 'kw',
  firstHideZero: 1,

  // 第二个散点图坐标
  secondChartXAxis: 'NC001', // 风速
  secondChartYAxis: 'RT101', // 桨叶角
  secondChartTime: 0,
  secondChartLoading: false,
  secondChartData: [],
  secondXAxisName: '机舱外风速实时值',
  secondXAxisUnit: 'm/s',
  secondYAxisName: '桨叶1角度',
  secondYAxisUnit: '°',
  secondHideZero: 1,

  // 第三个散点图坐标
  thirdChartXAxis: 'GN001', // 发电机转速
  thirdChartYAxis: '', // 扭矩
  thirdChartTime: 0,
  thirdChartLoading: false,
  thirdChartData: [],
  thirdXAxisName: '发电机转速',
  thirdXAxisUnit: 'Rpm',
  thirdYAxisName: '扭矩',
  thirdYAxisUnit: 'Nm',
  thirdHideZero: 1,

  // 第四个散点图坐标
  fourthChartXAxis: 'NC001', // 风速
  fourthChartYAxis: 'GN001', // 发电机转速
  fourthChartTime: 0,
  fourthChartLoading: false,
  fourthChartData: [],
  fourthXAxisName: '机舱外风速实时值',
  fourthXAxisUnit: 'm/s',
  fourthYAxisName: '发电机转速',
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
