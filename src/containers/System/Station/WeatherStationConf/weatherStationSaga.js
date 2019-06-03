import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { weatherStationAction } from './weatherStationReducer';
import moment from 'moment';


function* getWeatherList(action) { // 请求气象站列表
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.WeatherStaion}`
    try {
        yield put({
            type: weatherStationAction.changeWeatherStationStore,
            payload: {
                listParameter: {
                    ...payload,
                },
                loading: true
            }
        });
        const response = yield call(axios.post, url, payload);
        if (response.data.code === '10000') {
            const totalNum = response.data.data && response.data.data.count || 0;
            let { pageNum, pageSize } = payload;
            const maxPage = Math.ceil(totalNum / pageSize);
            if (totalNum === 0) { // 总数为0时，展示0页
                pageNum = 1;
            } else if (maxPage < pageNum) { // 当前页已超出
                pageNum = maxPage;
            }
            yield put({
                type: weatherStationAction.changeWeatherStationStore,
                payload: {
                    weatherList: response.data.data.stationData || [],
                    totalNum,
                    listParameter: {
                        ...payload,
                        pageNum,
                    },
                    loading: false
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: weatherStationAction.changeWeatherStationStore,
            payload: {
                listParameter: {
                    ...payload,
                },
                loading: false,
                weatherList: []
            },
        })
    }
}

function* getEditWeather(action) { // 修改气象站
    const { payload } = action;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.WeatherStaion}`
    try {
        const response = yield call(axios.put, url, payload);
        if (response.data.code === '10000') {
            message.success(`修改成功`);
            yield put({
                type: weatherStationAction.changeWeatherStationStore,
                payload: {
                    pageStatus: 'list'
                },
            });
            const params = yield select(state => state.system.weatherStationReducer.get('listParameter').toJS());
            console.log('params', params)
            yield put({
                type: weatherStationAction.getWeatherList,
                payload: params,
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(`修改失败，请重试`);
        yield put({
            type: weatherStationAction.changeWeatherStationStore,
            payload: {
                loading: false,
            },
        })
    }
}

function* getUpdateWeather(action) { // 重制气象站配置
    const { payload } = action;
    const { stationCode } = payload;
    console.log(stationCode)
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.WeatherStaion}/${stationCode}`
    try {
        const response = yield call(axios.delete, url);
        if (response.data.code === '10000') {
            message.success(`重制成功`);
            const params = yield select(state => state.system.weatherStationReducer.get('listParameter').toJS());
            console.log(params)
            yield put({
                type: weatherStationAction.getWeatherList,
                payload: params,
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        message.error(`重制失败，请重试`);
        yield put({
            type: weatherStationAction.changeWeatherStationStore,
            payload: {
                loading: false,
            },
        })
    }
}

function* getWeatherStation(action) {
    const { payload } = action;
    const { stationCode } = payload;
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getWeatherStation}${stationCode}`
    try {
        const response = yield call(axios.get, url);
        if (response.data.code === '10000') {
            yield put({
                type: weatherStationAction.changeWeatherStationStore,
                payload: {
                    weatherStation: response.data.data || []
                },
            });
        } else { throw response.data }
    } catch (e) {
        console.log(e);
        yield put({
            type: weatherStationAction.changeWeatherStationStore,
            payload: {
                weatherStation: [],
            },
        })
    }
}


export function* watchWeatherStation() {
    yield takeLatest(weatherStationAction.getWeatherList, getWeatherList);
    yield takeLatest(weatherStationAction.getEditWeather, getEditWeather);
    yield takeLatest(weatherStationAction.getUpdateWeather, getUpdateWeather);
    yield takeLatest(weatherStationAction.getWeatherStation, getWeatherStation);
}