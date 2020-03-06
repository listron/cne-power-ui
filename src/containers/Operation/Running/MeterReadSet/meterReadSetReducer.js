import Immutable from 'immutable';
import { meterReadSetAction } from './meterReadSetAction';

const initState = Immutable.fromJS({
  tableLoading: false, // 电表设置loading
  priceLoading: false, // 电价设置loading
  meterListError: false, // 表格data error
  isListTip: false, // 是否显示未新增完电表设置提示语
  isPriceTip: false, // 是否显示未编辑完电价提示语
  isEditPrice: false, // 电价是否编辑中
  isEditList: false, // 电表是否编辑中
  showPage: 'allStation', // allStation展示全部电站，singleStation显示单个电站
  stationCode: '', // 点击电站列表获取stationCode
  stationName: '', // 点击电站列表获取stationName
  meterListData: [], // 抄表设置列表
  baseDeviceData: [], // 抄表设置列表电表名称
  priceDetailData: {}, // 查看电价详情
  addDataNum: null, // 电表设置添加行的数量
});

const meterReadSetReducer = (state = initState, action) => {
  switch(action.type){
    case meterReadSetAction.changeMeterReadSetStore:
      return state.merge(Immutable.fromJS(action.payload));
    case meterReadSetAction.resetStore:
      return initState;
  }
  return state;
};

export default meterReadSetReducer;
