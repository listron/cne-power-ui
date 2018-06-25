import { put, takeLatest } from 'redux-saga/effects';
import {
  CHANGE_SHOW_CONTAINER_SAGA,
  CHANGE_SHOW_CONTAINER
} from '../../../../constants/actionTypes/Ticket';


//改变显示的组件：detail，list，create
function* changeShowContainer(action) {
  yield put({ 
    type: CHANGE_SHOW_CONTAINER, 
    data: action.params
  }); 
}

export function* watchChangeShowContainer() {
  yield takeLatest(CHANGE_SHOW_CONTAINER_SAGA, changeShowContainer);
}