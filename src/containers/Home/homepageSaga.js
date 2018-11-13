import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import path from '../../constants/path';
import { homepageAction } from './homepageAction';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths, { homepage } = APIBasePath;

function *getTotalData(action){
  console.log(action)
}

export function* watchHomepage() {
  yield takeLatest(homepageAction.getTotalData, getTotalData);
}

