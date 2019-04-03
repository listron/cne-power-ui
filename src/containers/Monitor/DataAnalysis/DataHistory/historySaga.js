import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { historyAction } from './historyReducer';
import { message } from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
const { APIBasePath } = Path.basePaths;
const { monitor } = Path.APISubPaths;

function *getAvailableDeviceType({ payload = {} }) { // 获取可用设备类型
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
      const defaultTypes = stationDeviceTypes.find(e => e.deviceTypeCode === 101); // 默认风电机组
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
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
  const url = `${APIBasePath}${monitor.getPointsInfo}` // '/mock/monitor/dataAnalysisPoints';
  try {
    const response = yield call(axios.post, url, {
      deviceIds: deviceFullCodes.map(e => e.deviceId),
      devicePointTypes: timeInterval === 10 ? ['YM', 'YC'] : ['YM', 'YC', 'YX']
    });
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
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

function *getChartHistory(action) { // 历史趋势chart数据获取
  const { payload } = action;
  const { queryParam } = payload;
  const url = `${APIBasePath}${monitor.getAllHistory}`; // '/mock/monitor/dataAnalysis/allHistory';
  try{
    const { devicePoints, startTime, endTime, deviceFullCodes } = queryParam;
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { queryParam, chartLoading: true }
    })
    const response = yield call(axios.post, url, {
      ...queryParam,
      deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
      devicePoints: devicePoints.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
      enterpriseId: Cookie.get('enterpriseId'),
    });
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          chartTime: moment().unix(), // 用于比较
          allHistory: response.data.data || {},
          chartLoading: false
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { chartLoading: false }
    })
    console.log(e);
  }
}

function *getListHistory(action) { // 表格数据获取
  const { payload } = action;
  const { queryParam, listParam } = payload;
  const url = `${APIBasePath}${monitor.getListHistory}`; // /mock/monitor/dataAnalysis/listHistory;
  // const orderText = ['deviceName', 'stationName', 'deviceTypeName', 'deviceModeName', 'time', 'speed'];
  try{
    const { devicePoints, startTime, endTime, deviceFullCodes } = queryParam;
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { queryParam, listParam, tableLoading: true }
    })
    // let { orderField } = listParam;
    // const orderIndex = orderText.indexOf(orderField);
    // if (orderIndex !== -1) { // 规定排序字段以数字字符串返回。
    //   orderField = `${orderIndex}`
    // }
    const response = yield call(axios.post, url, {
      ...queryParam,
      ...listParam,
      // orderField,
      deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).utc().format(),
      devicePoints: devicePoints.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
      enterpriseId: Cookie.get('enterpriseId'),
    });
    const { totalCount = 0 } = response.data.data;
    let { pageNum, pageSize } = listParam;
    const maxPage = Math.ceil(totalCount / pageSize);
    if (totalCount === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          listParam: {
            ...listParam,
            pageNum, 
            pageSize
          },
          tableLoading: false,
          partHistory: response.data.data || {},
        }
      })
    } else {
      throw response.data;
    }
  } catch(e) {
    message.error('获取图表数据失败!');
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: { tableLoading: false }
    })
    console.log(e);
  }
}

function *getSecendInterval(action) { // 用户所在企业数据时间间隔
  const { payload } = action;
  try {
    const { enterpriseId } = payload;
    const url = `${APIBasePath}${monitor.getSecendInteral}/${enterpriseId}` // '/mock/monitor/dataAnalysisSecendInteral';
    const { queryParam } = yield select(state => state.monitor.dataHistory.toJS());
    yield put({
      type: historyAction.CHANGE_HISTORY_STORE,
      payload: {
        queryParam: {
          ...queryParam,
          startTime: moment().startOf('day').subtract(1, 'day'),
          endTime: moment(),
        }
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      const { hasSecond } = response.data.data;
      yield put({
        type: historyAction.GET_HISTORY_SUCCESS,
        payload: {
          intervalInfo: hasSecond === 1 ? [10, 5, 1] : [10 ,5],
          queryParam: {
            ...queryParam,
            startTime: moment().startOf('day').subtract(1, 'day'),
            endTime: moment(),
          }
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

export function* watchDataHistoryMonitor() {
  yield takeLatest(historyAction.getAvailableDeviceType, getAvailableDeviceType);
  yield takeLatest(historyAction.getPointInfo, getPointInfo);
  yield takeLatest(historyAction.getChartHistory, getChartHistory);
  yield takeLatest(historyAction.getListHistory, getListHistory);
  yield takeLatest(historyAction.getSecendInterval, getSecendInterval);
}
