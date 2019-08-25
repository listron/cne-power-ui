import Immutable from 'immutable';
import moment from 'moment';
import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';

var initState = Immutable.fromJS({
  loading: false,
  chartLoading: false,
  stationCode: null,
  showPage: 'allStation', //allStation显示全部电站，singleStation,显示单电站
  scatterNames: [],
  scatterotherNames: [],
  activeCode: null,
  scatterData: {},
  xPointCode: '',
  yPointCode: '',
  startTime: moment().month(moment().month() - 1).startOf('month').format(),
  endTime: moment().month(moment().month() - 1).endOf('month').format(),
  pointCodeNameX: '',
  pointCodeNameY: '',
  srcObj: {},
  newSrcUrl: [],
  scatterNameTime: null,
  deviceList: [],
  point1Max: null,
  point1Min: null,
  point2Max: null,
  point2Min: null,
  down: false,
  bigScatterData: {},
  bigchartLoading: false,







});
const dataAnalysisScatterReducer = (state = initState, action) => {
  switch (action.type) {
    case dataAnalysisScatterAction.changeToolStore:
      return state.merge(Immutable.fromJS(action.payload));
    case dataAnalysisScatterAction.resetStore:
      return initState;
  }
  return state;
};
export default dataAnalysisScatterReducer;
