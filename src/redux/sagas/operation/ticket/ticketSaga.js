import { put, takeLatest } from 'redux-saga/effects';
import { ticketAction } from '../../../../constants/actionTypes/operation/ticketAction';


//改变显示的组件：detail，list，create
function* changeShowContainer(action) {
  yield put({ 
    type: ticketAction.CHANGE_SHOW_CONTAINER, 
    payload: action.payload
  }); 
}

export function* watchChangeShowContainer() {
  yield takeLatest(ticketAction.CHANGE_SHOW_CONTAINER_SAGA, changeShowContainer);
}