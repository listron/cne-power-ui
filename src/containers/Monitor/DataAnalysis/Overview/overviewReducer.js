import immutable from 'immutable';

const overviewAction = {
  getStationData: Symbol('getStationData'), // 获取电站信息
  getDevicesData: Symbol('getDevicesData'), // 获取设备信息
  getPointsData: Symbol('getPointsData'), // 获取测点信息

  GET_OVERVIEW_SUCCESS: Symbol('GET_OVERVIEW_SUCCESS'),
  CHANGE_OVERVIEW_STORE: Symbol('CHANGE_OVERVIEW_STORE'),
  RESET_OVERVIEW: Symbol('RESET_OVERVIEW'),
};

const initState = immutable.fromJS({
  activePage: '', // 激活的tab页, station, device, points
  stationSearch: '', // stationCode, deviceTypeCode, month的jsonString
  deviceSearch: '', // stationCode, deviceTypeCode, dateType, date, pointCodes的jsonString
  pointSearch: '', // stationCode, deviceTypeCode, deviceFullcode, dateType, date, pointCodes测点的jsonString

  stationData: {}, // 选中电站基本数据质量信息
  stationDatesRate: [], // 电站各日数据平均完备信息
  devicesData: {}, // 各设备信息
  pointsData: [], // 各测点信息列表
});

const overview = (state = initState, action) => {
  switch (action.type) {
    case overviewAction.GET_OVERVIEW_SUCCESS :
      return state.merge(immutable.fromJS(action.payload));
    case overviewAction.CHANGE_OVERVIEW_STORE:
      return state.merge(immutable.fromJS(action.payload));
    case overviewAction.RESET_OVERVIEW:
      return initState;
  }
  return state;
};

export { overviewAction, overview };
