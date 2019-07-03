import Immutable from 'immutable';
import { algorithmControlAction } from './algorithmControlAction.js';

const initState = Immutable.fromJS({
  loading: false,
  stationCodes: '', // 电站编码，所有为空字符串
  deviceTypeCode: '',	// 设备类型编码
  createTimeStart: '', // 开始时间
  createTimeEnd: '',	 // 结束时间
  algorithmModalName: [], // 算法模型名称
  algorithmModalId: [], // 算法模型id
  viewType: 'algorithm', // 判断展示算法模型algorithm/列表视图list
  algoModelList: { // 获取预警任务列表-算法模型视图
    largeSizeList: [],
    natureList: [],
    healthList: [],
  },
  algoOptionList: [{// 获取算法列表
    algorithmModalId: '',
  }],
  status: '0', // 状态
  pageSize: 10,
  pageNum: 1,
  algoListView: {// 获取预警任务列表-算法列表视图
    dataList: [],
    count: 0,
  },
  taskStatusStat: {}, // 获取预警任务状态统计
});


const AlgorithmControlReducer = (state = initState, action) => {
  switch (action.type) {
    case algorithmControlAction.changeAlgorithmControlStore:
      return state.merge(Immutable.fromJS(action.payload));
    case algorithmControlAction.fetchAlgorithmControlSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case algorithmControlAction.resetStore:
      return initState;
  }
  return state;
};

export default AlgorithmControlReducer;
