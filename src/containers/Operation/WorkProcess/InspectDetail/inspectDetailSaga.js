import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { inspectDetailAction } from './inspectDetailReducer';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

export function* watchInspectDetail() {
  // yield takeLatest(inspectDetailAction.xxx, xxx);
}

