import Immutable from 'immutable';
import { dataAnalysisSequenceAction } from './dataAnalysisSequenceAction';
var initState = Immutable.fromJS({
  loading: false,
  stationCode: null,
  showPage: 'allStation', //allStation显示全部电站，singleStation,显示单电站
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
