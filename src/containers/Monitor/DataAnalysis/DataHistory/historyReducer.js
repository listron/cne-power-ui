import Immutable from 'immutable';

const historyAction = {
  getHistory: Symbol('getHistory'), // 获取时间段内历史数据
  getPointInfo: Symbol('getPointInfo'), // 根据选中电站/设备得到的可选测点信息

  GET_HISTORY_SUCCESS: Symbol('GET_HISTORY_SUCCESS'), // 获取api数据成功
  CHANGE_HISTORY_STORE:Symbol('CHANGE_HISTORY_STORE'), // 手动更新当前history数据
  RESET_HISTORY:Symbol('RESET_HISTORY'), // 数据重置
}

const initState = Immutable.fromJS({
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceCodes: [], // 选中的设备
  startTime: null,
  endTime: null,
  pointCodes: [], // 选中的测点
  timeSpace: 'tenMin', // 数据时间间隔:sec, fiveSec 1s, 5s, 10min;
  historyType: 'chart', // 数据展示方式，'chart'图 / 'list'表格
  
  stationDeviceTypes: [], // 电站下可选设备类型
  pointInfo: [], // 选中设备内可选测点信息。
  allHistory: [], // chart图 - 所有历史数据
  partHistory: [], // 表格内 - 分页后的历史数据
});

const dataHistory = (state = initState, action) => {
  switch (action.type) {
    case historyAction.GET_HISTORY_SUCCESS :
      return state.merge(Immutable.fromJS(action.payload));
    case historyAction.CHANGE_HISTORY_STORE:
      return state.merge(Immutable.fromJS(action.payload));
    case historyAction.RESET_HISTORY:
      return initState;
  }
  return state;
}

export { historyAction, dataHistory };
