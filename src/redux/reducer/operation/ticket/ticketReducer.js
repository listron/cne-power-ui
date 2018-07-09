import immutable from 'immutable';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';

var initState = immutable.fromJS({
  showContainer: 'list',
  editNewDefect: false
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case TicketAction.CHANGE_SHOW_CONTAINER:
      return state.set('showContainer', action.data.container)
                  .set('editNewDefect', !!action.data.editNewDefect);
  }
  return state;
}

export default ticketReducer;