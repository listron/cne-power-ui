import immutable from 'immutable';

const overviewAction = {
  getOverviewStation: Symbol('getOverviewStation'), // 获取电站信息
  getOverviewDates: Symbol('getOverviewDates'), // 获取电站各日平均数据完整率
  getOverviewDevices: Symbol('getOverviewDevices'), // 获取设备信息
  afterDeviceTypePointGet: Symbol('afterDeviceTypePointGet'), // 测点列表获取后执行函数
  getOverviewPoints: Symbol('getOverviewPoints'), // 获取测点信息

  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  reset: Symbol('reset'),
};
// 路径携带信息如下: ?tab=station&pages=staion_device_points&station={stationCode:xxx,...}&device={stationCode:xxx,...}&point={stationCode:xxx,...}
const initState = immutable.fromJS({
  tab: 'station', // 激活的tab页, station, device, points
  pages: ['station'], // 开启的tab页面
  stationParam: {}, // stationCode, deviceTypeCode, month => search-station是该字段的jsonStr
  deviceParam: {}, // stationCode, deviceTypeCode, dateType(1日2月), date => 会转为字符串写入search的device
  deviceCheckedList: [], // 设备页选中的测点
  pointParam: {}, // stationCode, deviceTypeCode, deviceFullcode, dateType, date, pointCodes => 会转为字符串写入search的point
  pointsCheckedList: [], // 测点页选中的测点

  stationDatesRate: [], // 电站各日数据平均完备信息
  stationTopData: {}, // 电站页顶部信息
  stationUnix: null, // 电站页请求时间

  devicesData: {}, // 各设备信息
  deveiceLoading: false, // 设备信息loading
  deviceTopData: {}, // 设备页顶部信息
  devicePointsList: [], // 设备页测点列表
  deviceUnix: null, // 电站页请求时间

  pointsData: [], // 各测点信息列表
  pointTopData: {}, // 测点页顶部信息
  pointUnix: null, // 电站页请求时间
});

const overview = (state = initState, action) => {
  switch (action.type) {
    case overviewAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case overviewAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case overviewAction.reset:
      return initState;
  }
  return state;
};

export { overviewAction, overview };
