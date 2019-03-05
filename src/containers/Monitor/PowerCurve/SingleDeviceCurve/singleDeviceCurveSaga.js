import { call, put, takeLatest, select, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import Path from '../../../../constants/path';
// import { allDeviceCurveAction } from './allDeviceCurveAction';
import { message } from 'antd';
import moment from 'moment';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;









export function* watchSingleDeviceCurve() {

  //yield takeLatest(allDeviceCurveAction.getAllDeviceCurveData, getAllDeviceCurveData);

}
