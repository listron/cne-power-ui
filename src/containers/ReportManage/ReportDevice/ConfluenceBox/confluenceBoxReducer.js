import immutable from 'immutable';
import moment from 'moment';

const confluenceBoxAction = {
  changeStore: Symbol('changeStore'),
  resetStore: Symbol('resetStore'),
  getConfluenceBoxList: Symbol('getConfluenceBoxList'),
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
    sortField: 'report_time',
    sortMethod: 'asc', //"asc"：正序 "desc"：倒序
  },
  total: 0,
  stationName: '',// 电站名称
  reportTime: moment().subtract(1, 'day').format('YYYY-MM-DD'), // 日的时间
  deviceList: [], // 设备列表
  reportList: [], // 报表数据
  deviceTypes: [], //根据设备的列表 
  disabledStation: [],
});

const confluenceBox = (state = initState, action) => {
  switch (action.type) {
    case confluenceBoxAction.changeStore:
      return state.merge(immutable.fromJS(action.payload));
    case confluenceBoxAction.resetStore:
      return initState;
  }
  return state;
};

export { confluenceBoxAction, confluenceBox };
