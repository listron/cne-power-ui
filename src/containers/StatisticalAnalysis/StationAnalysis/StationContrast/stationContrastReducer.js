import Immutable from 'immutable';
import { stationContrastAction } from './stationContrastAction';
import moment from 'moment';

const initState = Immutable.fromJS({
  loading: false,
  stationCode: [],//两个电站的编码
  dateType: 'month', //日期类型，默认月  year年 month月 day日
  year: [parseInt(moment().format('YYYY'))],//默认年
  month: 0,//默认月
  
  column: '',//选中的行名
  stationContrastList:[],//两电站对比内容
  stationContrastDetail:[],//两电站列对比详情
  
  
});

const stationContrastReducer = (state = initState, action) => {
  console.log(action);
  switch (action.type) {
    case stationContrastAction.stationContrastLoading: // loading状态
      return state.set('loading',true);
    case stationContrastAction.stationContrastFetchSuccess : //请求成功并修改store数据
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false);
    case stationContrastAction.changeStationContrastStore: // 直接替换store值
      return state.merge(Immutable.fromJS(action.payload));
    case stationContrastAction.resetStationContrastStore: //重置参数
      return initState;
  }
  return state;
}


export default stationContrastReducer;