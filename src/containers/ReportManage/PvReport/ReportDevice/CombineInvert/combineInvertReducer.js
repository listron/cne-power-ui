import immutable from 'immutable';
import moment from 'moment';

const combineInvertAction = {
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getCombineInvertList: Symbol('getCombineInvertList'),
  getDisabledStation: Symbol('getDisabledStation'),
};

const initState = immutable.fromJS({
  listLoading: false, // 列表loading
  downloading: false, // 导出loading
  parmas: {
    pageSize: 10,
    pageNum: 1,
    stationCode: null, //电站编码 单电站
    deviceFullcodes: [], //设备全编码
    orderFiled: 'report_time',
    orderType: 'asc', //"asc"：正序 "desc"：倒序
  },
  total: 0,
  maxPvCount:8,
  startTime: moment().startOf('year').format('YYYY-MM-DD'), // 开始时间
  endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'), // 结束时间
  reportTime: moment().subtract(1, 'day').format('YYYY-MM-DD'), // 日的时间
  dateType: 'hour', // 日 day 月 month 年 year 
  deviceList: [], // 设备列表
  reportList: [], // 报表数据
  deviceTypes: [], //根据设备的列表 
  disabledStation: [],
});

const combineInvert = (state = initState, action) => {
  switch (action.type) {
    case combineInvertAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case combineInvertAction.resetStore:
      return initState;
  }
  return state;
};

export { combineInvertAction, combineInvert };
