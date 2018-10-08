import Immutable from 'immutable';
import { ticketAction } from './ticketAction';

var initState = Immutable.fromJS({
  showContainer: 'list',//list, detail, create, edit
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.CHANGE_SHOW_CONTAINER:
      return state.set('showContainer', action.payload.container)
                  .set('loading', false);
  }
  return state;
}

export default ticketReducer;