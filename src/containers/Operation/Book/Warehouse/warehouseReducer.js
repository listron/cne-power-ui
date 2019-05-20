import Immutable from 'immutable';
import { warehouseAction } from './warehouseAction.js';

const initState = Immutable.fromJS({
  loading: false,
});


const warehouseReducer = (state = initState, action) => {
  switch (action.type) {
    case warehouseAction.warehouseFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.changeWarehouseStore:
      return state.merge(Immutable.fromJS(action.payload));
    case warehouseAction.resetStore:
      return initState
  }
  return state;
};

export default warehouseReducer;
