import immutable from 'immutable';

import {
  CHANGE_SHOW_CONTAINER
} from '../../../../constants/actionTypes/Ticket';

var initState = immutable.fromJS({
  showContainer: 'list',
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_SHOW_CONTAINER:
      return state.set('showContainer', action.data.container);
  }
  return state;
}

export default ticketReducer;