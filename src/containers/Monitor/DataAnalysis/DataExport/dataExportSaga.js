import { call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
import { dataExportAction } from './dataExportAction';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getAvailableDeviceType({ payload = {} }) { // 设备类型
  const { stationCode } = payload;
  const sortTypes = [ // 默认排序顺序
    '风电机组', '集电线路', '站内母线', '主变', '站用变', '接地变', '测风塔', '全场信息汇总', '电能采集', '功率预测系统', '能量管理平台'
  ];
  try {
    const url = `${APIBasePath}${monitor.getAvailableDeviceType}/${stationCode}`;
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const stationDeviceTypes = response.data.data || [];
      stationDeviceTypes.sort((a, b) => {
        const tmpIndexA = sortTypes.indexOf(a.deviceTypeName);
        const tmpIndexB = sortTypes.indexOf(b.deviceTypeName);
        if (tmpIndexA === -1) {
          return 1;
        }
        if (tmpIndexB === -1) {
          return -1;
        }
        return (tmpIndexA - tmpIndexB);
      })
      const defaultTypes = stationDeviceTypes.find(e => e.deviceTypeCode); // 默认选第一个
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload: {
          stationDeviceTypes,
          deviceTypeCode: defaultTypes ? defaultTypes.deviceTypeCode : null,
        }
      })
    } else { throw response }
  } catch(error) {
    console.log(error);
  }
}

function *getPointInfo(action) { // 获取可选测点
  const { payload } = action;
  const { deviceFullCodes, timeInterval } = payload;
  const url = `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(axios.post, url, {
      deviceIds: deviceFullCodes.map(e => e.deviceId),
      devicePointTypes: timeInterval === 10 ? ['YM', 'YC'] : ['YM', 'YC', 'YX']
    });
    if (response.data.code === '10000') {
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload: {
          reRenderTree: moment().unix(), // 记录时间
          pointInfo: response.data.data || [],
        }
      })
    } else {
      throw response.data;
    }
  } catch(error) {
    message.error('获取可选测点信息失败!');
    console.log(error);
  }
}

function *getDataExportList({ payload = {} }) { // 数据导出任务列表
  let { pageNum, pageSize } = payload;
  const url = `${APIBasePath}${monitor.getDataExport}/${pageNum}/${pageSize}`;
  try{
    yield put({
      type: dataExportAction.changeDataExportStore,
      payload: { tableLoading: true }
    })
    const response = yield call(axios.get, url);
    const { totalCount = 0 } = response.data.data;
    const maxPage = Math.ceil(totalCount / pageSize);
    if (totalCount === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload: {
          listParam: {
            pageNum, 
            pageSize
          },
          tableLoading: false,
          partDataExport: response.data.data || {},
        }
      })
    } else { throw response.data }
  } catch(e) {
    message.error('获取列表数据失败!');
    yield put({
      type: dataExportAction.changeDataExportStore,
      payload: { tableLoading: false }
    })
    console.log(e);
  }
}

function *getDataExport({ payload = {} }) { // 生成导出任务
  const { queryParams, deviceTypeCode } = payload;
  const url = `${APIBasePath}${monitor.getDataExport}`;
  try{
    const { devicePointCodes, startTime, endTime, deviceFullCodes } = queryParams;
    const tmpPayload = { queryParams, tableLoading: true };
    yield put({
      type: dataExportAction.changeDataExportStore,
      payload: tmpPayload
    })
    const response = yield call(axios.post, url, {
      ...queryParams,
      deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
      devicePointCodes: devicePointCodes.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
      enterpriseId: Cookie.get('enterpriseId'),
      deviceTypeCode
    });
    if(response.data.code === '10000'){
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload:{
          exportData: response.data.data || {},
        }
      })
      const params = yield select(state => state.monitor.dataExport.get('listParam').toJS());// 重新请求数据导出任务列表
      yield put({
        type: dataExportAction.getDataExportList,
        payload: params,
      });
    } else { throw response.data }
  }catch(e) {
    message.error('获取数据失败!');
    console.log(e);
  }
}

function *getAgainDataExport({ payload = {} }) { // 重新生成导出任务
  const { queryParams, taskId } = payload;
  const url =`${APIBasePath}${monitor.getDataExport}/${taskId}`;
  try{
    const response = yield call(axios.put, url);
    if(response.data.code === '10000'){
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload:{
          taskId
        }
      })
      const params = yield select(state => state.monitor.dataExport.get('listParam').toJS());// 重新请求数据导出任务列表
      yield put({
        type: dataExportAction.getDataExportList,
        payload: params,
      });
    } else { throw response.data }
  }catch(e) {
    message.error('获取数据失败!');
    console.log(e);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const url = `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}`;
    const { queryParam } = yield select(state => state.monitor.dataHistory.toJS());
    const tmpQueryParam = { // 时间重置。
      ...queryParam,
      startTime: moment().subtract(1, 'day').startOf('day'),
      endTime: moment().subtract(1, 'day').endOf('day'),
    }
    yield put({
      type: dataExportAction.changeDataExportStore,
      payload: tmpQueryParam,
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: dataExportAction.GET_DATAEXPORT_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [10, 5, 1] : [10 ,5],
          queryParam: tmpQueryParam,
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取企业数据时间间隔信息失败!');
    console.log(error);
  }
}

export function* watchDataExport() {
  yield takeLatest(dataExportAction.getAvailableDeviceType, getAvailableDeviceType);
  yield takeLatest(dataExportAction.getPointInfo, getPointInfo);
  yield takeLatest(dataExportAction.getDataExportList, getDataExportList);
  yield takeLatest(dataExportAction.getDataExport, getDataExport);
  yield takeLatest(dataExportAction.getAgainDataExport, getAgainDataExport);
  yield takeLatest(dataExportAction.getSecendInterval, getSecendInterval);
}