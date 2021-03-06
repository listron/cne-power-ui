import Immutable from 'immutable';

const alarmEventAction = {
  changeStore: Symbol('changeStore'), // 替换reducer参数
  resetStore: Symbol('resetStore'), // 发起重置数据请求
  getDiagVersion: Symbol('getDiagVersion'), // 发起重置数据请求
  editVersion: Symbol('editVersion'),
  updateVersion: Symbol('updateVersion'),
  delVersion: Symbol('delVersion'),
  getVersionEvent: Symbol('getVersionEvent'),
  getEditVersionStation: Symbol('getEditVersionStation'),
  addVersionEvent: Symbol('addVersionEvent'),
  editVersionEvent: Symbol('editVersionEvent'),
  delVersionEvent: Symbol('delVersionEvent'),
  getAlarmEvent: Symbol('getAlarmEvent'),
  getPointList: Symbol('getPointList'),
  getVersionStation: Symbol('getVersionStation'),
  filterConditionStations: Symbol('filterConditionStations'),
  getEventDetail: Symbol('getEventDetail'),
  alarmEventDetialFlow: Symbol('alarmEventDetialFlow'),
};


var initState = Immutable.fromJS({
  loading: false,
  stationCode: null, // 选中的电站
  deviceTypeCode: 206, // 设备类型 默认是组串式逆变器 201 组串式逆变器
  deviceModeCode: null, // 厂家型号
  diagModeVersionId: null, //版本ID
  diagConfigData: [], //版本的数据
  editVersionLoading: false, // 编辑版本的loading
  versionStationCodes: [], // 当前的制定版本涉及的电站
  versionList: [], // 选定的版本的告警事件
  versionError: false, //获取列表失败
  versionEventLoading: false, //版本告警事件的loading
  editVersionStationCodes: [], // 编辑的版本涉及的电站
  alarmEventType: [], // 告警标准事件类型
  pointList: [], //测点数据
  pointListError: false, // 测点数据错误
  editPoint: {}, // 测点编辑的数据
  setPonitModal: false, // 测点编辑的弹框
  warningTipText: '',
  applyStations: [], //版本应用的电站

  selectedNodesKey: '', // 选中的节点   manufactorCode_deviceModeCode_diagModeVersionId
  expandedKeys: [], // 受控展开的树节点  manufactorCode manufactorCode_deviceModeCode
  filterStations: [], //筛选的电站
  modifyStatus: false, // 是否处于编辑状态
  alarmEventDetial:{},
});

const alarmEventReducer = (state = initState, action) => {
  switch (action.type) {
    case alarmEventAction.changeStore:
      return state.merge(Immutable.fromJS(action.payload));
    case alarmEventAction.resetStore:
      return initState;
  }
  return state;
};

export { alarmEventAction, alarmEventReducer };
