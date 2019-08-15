import Immutable from 'immutable';
import { dataAnalysisSequenceAction } from './dataAnalysisSequenceAction';
var initState = Immutable.fromJS({
  chartLoading: false,
  chartTime: null, //图的时间戳
  stationCode: null,
  pointY1: '',
  pointY2: '',
  startTime: '',
  endTime: '',
  deviceFullCode: '',
  pointCodeNameX: '',
  pointCodeNameY: '',
  showPage: 'allStation', //allStation显示全部电站，singleStation,显示单电站
  deviceList: [], //电站下的设备
  sequenceNames: [], //测点
  sequenceNameTime: null, //请求测点的时间戳
  sequenceotherNames: [], //其他测点名字
  sequenceData: [], //时序图汇总数据
  curBigChartData: {}, //当前请求到的时序图
  down: false,



});
const dataAnalysisSequenceReducer = (state = initState, action) => {
  switch (action.type) {
    case dataAnalysisSequenceAction.changeSquenceStore:
      return state.merge(Immutable.fromJS(action.payload));
    case dataAnalysisSequenceAction.resetStore:
      return initState;
  }
  return state;
};
export default dataAnalysisSequenceReducer;
