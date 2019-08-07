import Immutable from 'immutable';

import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';

var initState = Immutable.fromJS({
  loading: false,
  stationCode: null,
  showPage: 'allStation', //allStation显示全部电站，singleStation,显示单电站
  scatterNames: [],
  scatterotherNames: [],
  scatterData: [],
  xPointCode: '',
  yPointCode: '',
  startTime: '',
  endTime: '',
  xPointName: '',
  yPointName: '',
  srcObj: {},
  newSrcUrl: [],



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
