import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '@constants/path';
import { weatherStationAction } from './weatherStationReducer';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { reportManage } = path.APISubPaths;

function* getWeatherStationList(action) {
  const { payload } = action;
  const { dateType } = payload;
  const dateTypeArr = ['day', 'month'];
  //当dateTypeArr包含日或月的时候发送getWeatherStationList
  // const url = dateTypeArr.includes[dateType] ? `${APIBasePath}${reportManage.getWeatherStationList}` : `${APIBasePath}${reportManage.getHourWeatherStationList}`;
  console.log('1111111111', dateTypeArr.includes[dateType]);
  const url = dateTypeArr.includes(dateType) ? 'mock/v3/sun/report/weather/list/day' : 'mock/v3/sun/report/weather/list/min';
  try {
    yield put({
      type: weatherStationAction.changeStore,
      payload: {
        listLoading: true,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.pageCount || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) {
        pageNum = 1;
      } else if (maxPage < pageNum) {
        pageNum = maxPage;
      }
      yield put({
        type: weatherStationAction.changeStore,
        payload: {
          reportList: response.data.data.dataList || [],
          total,
          listLoading: false,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取电站报表列表数据失败！');
    yield put({
      type: weatherStationAction.changeStore,
      payload: {
        reportList: [],
        listLoading: false,
      },
    });
    console.log(e);
  }
}

function* getDisabledStation(action) {
  const url = `${APIBasePath}${reportManage.disabledStations}`;
  try {
    const response = yield call(axios.post, url, { deviceTypeCode: 203 });
    if (response.data.code === '10000') {
      yield put({
        type: weatherStationAction.changeStore,
        payload: {
          disabledStation: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    yield put({
      type: weatherStationAction.changeStore,
      payload: {
        disabledStation: [],
      },
    });
    console.log(e);
  }
}



export function* watchWeatherStationReport() {
  yield takeLatest(weatherStationAction.getWeatherStationList, getWeatherStationList);
  yield takeLatest(weatherStationAction.getDisabledStation, getDisabledStation);
}
