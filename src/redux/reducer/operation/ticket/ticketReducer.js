import immutable from 'immutable';
import { ticketAction } from '../../../../constants/actionTypes/operation/ticketAction';

var initState = immutable.fromJS({
  showContainer: 'list',
  editNewDefect: false
});

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case ticketAction.CHANGE_SHOW_CONTAINER:
      return state.set('showContainer', action.data.container)
                  .set('editNewDefect', !!action.data.editNewDefect);
  }
  return state;
}

export default ticketReducer;