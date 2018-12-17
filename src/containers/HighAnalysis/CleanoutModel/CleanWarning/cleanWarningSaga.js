import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import path from '../../../../constants/path';
import { cleanWarningAction } from './cleanWarningAction';




export function* watchCleanWarning() {
  // yield takeLatest(cleanWarningAction.resetStore, resetStore);
}

