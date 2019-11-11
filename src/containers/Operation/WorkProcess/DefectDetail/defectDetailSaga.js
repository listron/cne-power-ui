import { put, call, takeLatest, select, fork } from 'redux-saga/effects';
import { defectDetailAction } from './defectDetailReducer';
import path from '@path';
import moment from 'moment';

import { message } from 'antd';
const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { operation } = APISubPaths;

export function* watchDefectDetail() {
  // yield takeLatest(defectDetailAction.xxx, xxx);
}

