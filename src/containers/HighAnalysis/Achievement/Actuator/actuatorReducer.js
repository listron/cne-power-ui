import immutable from 'immutable';

export const actuatorAction = {
  fetchSuccess: Symbol('fetchSuccess'),
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getDevices: Symbol('getDevices'),
  getYawRank: Symbol('getYawRank'),
  getReleaseRank: Symbol('getReleaseRank'),
  getYawRend: Symbol('getYawRend'),
  getReleaseRend: Symbol('getReleaseRend'),
};

const initState = immutable.fromJS({
  modeDevices: [],
  yawRankData: [],
  yawRankLoading: false,
  yawRankTime: 0,
  releaseRankData: [],
  releaseRankLoading: false,
  releaseRankTime: 0,
  yawRendData: [],
  yawRendLoading: false,
  yawRendTime: 0,
  releaseRendData: [],
  releaseRendLoading: false,
  releaseRendTime: 0,
  deviceName: '', // 选择的设备名称
  rankDevice: '', // 选择的设备编码
  releaseType: '2', // 日：1，月：2；年：3
  yawType: '2', // 日：1，月：2；年：3
});

export const actuator = (state = initState, action) => {
  switch (action.type) {
    case actuatorAction.fetchSuccess:
      return state.merge(immutable.fromJS(action.payload));
    case actuatorAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case actuatorAction.resetStore:
      return initState;
  }
  return state;
};
