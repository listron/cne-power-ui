import immutable from 'immutable';

export const stopStatusAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),

  getStopStatus: Symbol('getStopStatus'),
  getDevices: Symbol('getDevices'),
};

const initState = immutable.fromJS({
  stationCode: null, // 选中的电站code
  deviceCodes: [], // 选中的设备
  startTime: null,
  endTime: null,
  stopStringify: '', // 存储的路径信息

  modeDevices: [], // 电站 设备型号+设备集合
  stopStatusLoading: false, // loading状态
  stopStatusList: [], // 停机状态数据
});

export const achieveStop = (state = initState, action) => {
  switch (action.type) {
    case stopStatusAction.fetchSuccess :
      return state.merge(immutable.fromJS(action.payload));
    case stopStatusAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case stopStatusAction.resetStore:
      return initState;
  }
  return state;
};
