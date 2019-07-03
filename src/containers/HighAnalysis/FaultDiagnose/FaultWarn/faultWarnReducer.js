import Immutable from 'immutable';
import { faultWarnAction } from './faultWarnAction.js';

const initState = Immutable.fromJS({
  loading: false,
  faultWarnList: [], // 多风场故障预警汇总列表
});


const faultWarnReducer = (state = initState, action) => {
  switch (action.type) {
    case faultWarnAction.changeFaultWarnStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnAction.faultWarnFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultWarnAction.resetStore:
      return initState;
  }
  return state;
};

export default faultWarnReducer;
