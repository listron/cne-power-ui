
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';

import {
  GET_POSTS_SAGA,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAIL
} from '../../constants/actionTypes';

import {
  GET_POSTS_URL
} from '../../constants/url';

const FetchActions = [GET_POSTS_SAGA];

// worker saga
function* showPostsAsync(action) {
  let type = action.type;
  console.log('start action:' + type)
  try {
    console.log('=========Action RUN================')
    const response = yield call(axios.get, GET_POSTS_URL);
    yield put({ type: GET_POSTS_SUCCESS, posts: response.data });
    console.log('=========Dispatch Success================');
  } catch (e) {
    yield put({ type: GET_POSTS_FAIL, error: e });
    console.log('=========Dispatch Failure================');
    console.log(error);
  }
}

// watcher saga
function* watchGetPosts() {
  yield takeLatest(FetchActions, showPostsAsync);
}

// root saga
export default function* rootSaga() {
  yield all([
    watchGetPosts()
  ])
} 