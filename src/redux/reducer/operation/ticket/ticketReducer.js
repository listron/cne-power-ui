import Immutable from 'immutable';
import { ticketAction } from '../../../../constants/actionTypes/operation/ticketAction';

var initState = Immutable.fromJS({
  showContainer: 'list',
  editNewDefect: false
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.CHANGE_SHOW_CONTAINER:
      return state.set('showContainer', action.payload.container)
                  .set('editNewDefect', !!action.payload.editNewDefect);
  }
  return state;
}

export default ticketReducer;