import { put, takeLatest } from 'redux-saga/effects';
import { TicketAction } from '../../../../constants/actionTypes/operation/ticketAction';


//改变显示的组件：detail，list，create
function* changeShowContainer(action) {
  yield put({ 
    type: TicketAction.CHANGE_SHOW_CONTAINER, 
    data: action.params
  }); 
}

export function* watchChangeShowContainer() {
  yield takeLatest(TicketAction.CHANGE_SHOW_CONTAINER_SAGA, changeShowContainer);
}