import Immutable from 'immutable';
import { faultAllFanAction } from './faultAllFanAction.js';

const initState = Immutable.fromJS({
  loading: false,
  showFlag: false, // 控制展开关闭按钮
  stationDeviceList: [], // 获取单电站所有风机
  stationCode: "82", // 电站编码
  deviceName: "a", // 电站名称
  taskId: "387338641160192", // 任务
  deviceFullcode: "82M101M39M1", // 设备编码
  faultInfo: [ // 执行时间，开始日期。。。
    {
      stationName: "",
      algorithmName: "",
      startTime: "",
      endTime: "",
      planExecuteTime: "",
      executeStartTime: "",
      executeEndTime: "",
      trainingStartTime: "",
      createTime: "",
      status: ""
    }
  ],
  faultInfoMessage: "", //log信息
  faultReportInfo: {}, // 历史任务列表
  pageSize: 10,
  pageNumber: 1,
  standAloneList: [], // 获取单风机自适应模块检测结果
  similarityList: [], // 获取风机相似性结果
  allFanResultList: {// 获取多机协同模块检测结果-严重程度及识别（所有风机）
    cfResidual: [],
    cfStd: []
  },
  tenMinutesBeforeList: [{// 获取风机10分钟数据-前驱
    dataList: []
  }],
  tenMinutesAfterList: [{// 获取风机10分钟数据-后驱
    dataList: []
  }],
  tenMinutesDiffList: [{// 获取风机10分钟数据-温度差
    dataList: []
  }]
});


const faultAllFanReducer = (state = initState, action) => {
  switch (action.type) {
    case faultAllFanAction.changeFaultAllFanStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultAllFanAction.fetchFaultAllFanSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultAllFanAction.RESET_STORE:
      return initState
  }
  return state;
};

export default faultAllFanReducer;
