import Immutable from 'immutable';
import { ticketAction } from './ticketAction';

var initState = Immutable.fromJS({
  container: 'list',//list, detail, create, edit
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.CHANGE_SHOW_CONTAINER:
      return state.merge(Immutable.fromJS(action.payload)).set('loading', false)
  }
  return state;
}

export default ticketReducer;