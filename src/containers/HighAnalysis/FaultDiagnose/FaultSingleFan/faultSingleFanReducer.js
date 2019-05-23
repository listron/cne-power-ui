import Immutable from 'immutable';
import { faultSingleFanAction } from './faultSingleFanAction.js';

const initState = Immutable.fromJS({
  loading: false,
  showFlag: false, // 控制展开关闭按钮
  stationDeviceList: [{
    deviceName: "",
    connectDeviceFullCode: "",
    warnId: 1
  }], // 获取单电站所有风机
  stationCode: "82", // 电站编码
  deviceName: "", //设备名称
  faultInfo: {// 获取故障预警任务详情
    endTime: null,
    stationName: "",
    algorithmName: "",
    deviceDatas: [],
    algModeDatas: [],
    deviceName: ""
  },
  faultDateList: "", //预警日期-有故障的日期
  faultDate: "", // 故障详情页选择日期
  preDate: [], // 前驱温度时间选择
  afterDate: [], // 后驱温度时间选择
  diffDate: [], // 后驱温度时间选择
  beforeTimeData: [], // 前驱温度时间轴
  afterTimeData: [], // 后驱温度时间轴
  diffTimeData: [], // 温度差时间轴
  preTimeCompare: 0, // 用于前驱比较时间戳
  afterTimeCompare: 0, // 用于后驱比较时间戳
  diffTimeCompare: 0, // 用于温度差比较时间戳
  allTimeCompare: 0, // 用于全部风机比较时间戳
  heatTimeCompare: 0, // 用于相似性热图比较时间戳
  aloneTimeCompare: 0, // 用于单机自适应比较时间戳
  preLoading: true, // 前驱温度loading
  afterLoading: true, // 后驱温度loading
  diffLoading: true, // 温度差loading
  aloneLoading: true, // 单机自适应loading
  heatLoading: true, // 相似性热图loading
  allLoading: true, // 所有风机loading
  warnId: 0, // 有无故障
  faultInfoMessage: "", //log信息
  faultReportInfo: {}, // 历史任务列表
  pageSize: 10,
  pageNum: 1,
  standAloneList: [], // 获取单风机自适应模块检测结果
  similarityList: [], // 获取风机相似性结果
  allFanResultList: {// 获取多机协同模块检测结果-严重程度及识别（所有风机）
    cfResidual: [],
    cfStd: []
  },
  deviceFullCode: "", // 设备全编码
  tenMinutesBeforeList: [{// 获取风机10分钟数据-前驱
    dataList: [],
  }],
  tenMinutesAfterList: [{// 获取风机10分钟数据-后驱
    dataList: [],
  }],
  tenMinutesDiffList: [{// 获取风机10分钟数据-温度差
    dataList: [],
  }],
});


const fetchSingleFanReducer = (state = initState, action) => {
  switch (action.type) {
    case faultSingleFanAction.changeSingleFanStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultSingleFanAction.fetchSingleFanSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultSingleFanAction.resetStore:
      return initState
  }
  return state;
};

export default fetchSingleFanReducer;
