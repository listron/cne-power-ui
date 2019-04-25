import Immutable from 'immutable';
import { faultSingleFanAction } from './faultSingleFanAction.js';

const initState = Immutable.fromJS({
  loading: false,
  showFlag: false // 控制展开关闭按钮
});


const fetchSingleFanReducer = (state = initState, action) => {
  switch (action.type) {
    case faultSingleFanAction.changeSingleFanStore:
      return state.merge(Immutable.fromJS(action.payload));
    case faultSingleFanAction.fetchSingleFanSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case faultSingleFanAction.RESET_STORE:
      return initState
  }
  return state;
};

export default fetchSingleFanReducer;
