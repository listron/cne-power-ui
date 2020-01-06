import { call, takeLatest, put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { performanceAnalysisAction } from './performanceAnalysisAction';
const { basePaths, commonPaths, APISubPaths } = Path;
const { APIBasePath } = basePaths;

function* getEquipmentSelection(action) {
  const { payload } = action;
  const url = '';
  try {
    const response = yield call(axios.post, url, payload);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

function* getDeviceModels(action) { // 新共用接口，获取电站设备类型下设备型号
  const url = `${Path.basePaths.APIBasePath}${Path.commonPaths.getDeviceModel}`;
  const { payload } = action;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [zuchuan, jizhong] = yield all([call(axios.get, url, { params: { stationCode: payload.stationCode, deviceTypeCode: '206' } }), call(axios.get, url, { params: { stationCode: payload.stationCode, deviceTypeCode: '201' } })]);
    if (zuchuan.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          deviceModels: zuchuan.data.data || [],
        },
      });
    }
    if (jizhong.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          deviceModelOther: jizhong.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getEleDeviceData(action) { // 查询集电线路下的设备型号和设备类型数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getEleDeviceData}/${payload.deviceFullCode}`;

  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          eleDeviceModels: response.data.data || [],
        },
      });
    }

  } catch (e) {
    console.log(e);
  }
}

function* getEleLineCode(action) {//集电线路
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getEleLineCode}/${payload.stationCode}/${payload.deviceTypeCode}`;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          eleLineCodeData: response.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getPerformance(action) {
  const { payload } = action;
  const { deviceTypeCode } = payload;
  //const conversioneffUrl = '/mock/performance/deviceanalysis/conversioneff';
  const conversioneffUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getconversioneff}`;
  const hoursUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHours}`;
  const availabilityUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailability}`;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [conversioneff, hour, availability] = yield all([
      call(axios.post, conversioneffUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(',') }),
      call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'hour' }),
      call(axios.post, availabilityUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), availabilitySortField: 0 })]);
    if (conversioneff.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          conversionAvgRate: conversioneff.data.data.conversionAvgRate || '',
          conversioneffData: conversioneff.data.data.conversionRateData || [],
          conversionNullValue: conversioneff.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (hour.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          hourData: hour.data.data.dataResults || [],
          hourNullValue: hour.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (availability.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          availabilityData: availability.data.data || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function* getFault(action) {
  const { payload } = action;
  const { deviceTypeCode } = payload;
  const availabilityUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailability}`;
  const hoursUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHours}`;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [availability, faultNum, faultTime] = yield all([
      call(axios.post, availabilityUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), availabilitySortField: 1 }),
      call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'faultNum' }),
      call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'faultTime' })]);
    if (availability.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          lostPowerData: availability.data.data || [],
        },
      });
    }
    if (faultNum.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          faultNumData: faultNum.data.data.dataResults || [],
          faultNumNullvalue: faultNum.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (faultTime.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          faultTimeData: faultTime.data.data.dataResults || [],
          faultTimeNullValue: faultTime.data.data.deviceNamesNullValue || [],
        },
      });
    }

  } catch (e) {
    console.log(e);
  }
}


function* getPerformanceContrast(action) {
  const { payload } = action;
  const { deviceTypeCode } = payload;
  const conversioneffUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getconversioneffContrast}`;
  const hoursUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHoursContrast}`;
  const availabilityUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailabilityContrast}`;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [conversioneff, hour, availability] = yield all([
      call(axios.post, conversioneffUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(',') }),
      call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'hour' }),
      call(axios.post, availabilityUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), availabilitySortField: 0 })]);
    if (conversioneff.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          conversioneffContrastData: conversioneff.data.data.conversionRateData || [],
          contrastConversionAvgRate: conversioneff.data.data.contrastConversionAvgRate || '',
          contrastAvgRate: conversioneff.data.data.conversionAvgRate || '',
          conversDeviceNames: conversioneff.data.data.deviceNames || [],
          // conConversNullValue:conversioneff.data.data.deviceNamesNullValue||[],
          conversionNullValue: conversioneff.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (hour.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          hourContrastData: hour.data.data.results || [],
          hourDeviceNames: hour.data.data.deviceNames || [],
          // conHourNullValue:hour.data.data.deviceNamesNullValue||[],          
          hourNullValue: hour.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (availability.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          availabilityContrastData: availability.data.data.results || [],
          availabilityDeviceNames: availability.data.data.deviceNames || [],
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


function* getFaultContrast(action) {
  const { payload } = action;
  const { deviceTypeCode } = payload;
  const lostPowerUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getAvailabilityContrast}`;
  const hoursUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.getHoursContrast}`;
  try {
    yield put({ type: performanceAnalysisAction.PERFORMANCEANALYSIS_FETCH });
    const [lostPower, faultNum, faultTime] = yield all([
      call(axios.post, lostPowerUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), availabilitySortField: 1 }), call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'faultNum' }),
      call(axios.post, hoursUrl, { ...payload, deviceTypeCode: deviceTypeCode.split(','), dataType: 'faultTime' })]);
    if (lostPower.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          lostPowerContrastData: lostPower.data.data.results || [],
          lostPowerDeviceNames: lostPower.data.data.deviceNames || [],
        },
      });
    }
    if (faultNum.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          faultNumContrastData: faultNum.data.data.results || [],
          faultNumDeviceNames: faultNum.data.data.deviceNames || [],
          // conFaultNumNullValue: faultNum.data.data.deviceNamesNullValue||[],          
          faultNumNullvalue: faultNum.data.data.deviceNamesNullValue || [],
        },
      });
    }
    if (faultTime.data.code === '10000') {
      yield put({
        type: performanceAnalysisAction.GET_PERFORMANCEANALYSIS_FETCH_SUCCESS,
        payload: {
          faultTimeContrastData: faultTime.data.data.results || [],
          faultTimeDeviceNames: faultTime.data.data.deviceNames || [],
          // conFaultTimeNullValue: faultTime.data.data.deviceNamesNullValue||[],          
          faultTimeNullValue: faultTime.data.data.deviceNamesNullValue || [],
        },
      });
    }

  } catch (e) {
    console.log(e);
  }
}



export function* watchPerformanceAnalysisSaga() {
  yield takeLatest(performanceAnalysisAction.getEquipmentSelection, getEquipmentSelection);
  yield takeLatest(performanceAnalysisAction.getEleLineCode, getEleLineCode);
  yield takeLatest(performanceAnalysisAction.getPerformance, getPerformance);
  yield takeLatest(performanceAnalysisAction.getFault, getFault);
  yield takeLatest(performanceAnalysisAction.getPerformanceContrast, getPerformanceContrast);
  yield takeLatest(performanceAnalysisAction.getFaultContrast, getFaultContrast);
  yield takeEvery(performanceAnalysisAction.getDeviceModels, getDeviceModels);
  yield takeEvery(performanceAnalysisAction.getEleDeviceData, getEleDeviceData);
}
