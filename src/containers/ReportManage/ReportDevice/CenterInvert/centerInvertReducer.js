import immutable from 'immutable';

const centerInvertAction = {
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getCenterInverList: Symbol('getCenterInverList'),
  exportCenterInvert: Symbol('exportCenterInvert'),
};

const initState = immutable.fromJS({
  listLoading: false, // 列表loading
  exportLoading: false, // 导出loading
  parmas: {
    pageSize: 10,
    pageNum: 1,
    stationCode: null, //电站编码 单电站
    deviceFullcodes: [], //设备全编码
    orderFiled: '',
    orderType: '', //"asc"：正序 "desc"：倒序
  },
  total: 0,
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  reportTime: '', // 日的时间
  dateType: 'day', // 日 day 月 month 年 year 
  deviceList: [], // 设备列表
  reportList: [], // 报表数据
  deviceTypes: [], //根据设备的列表 
});

const centerInvert = (state = initState, action) => {
  switch (action.type) {
    case centerInvertAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case centerInvertAction.resetStore:
      return initState;
  }
  return state;
};

export { centerInvertAction, centerInvert };
