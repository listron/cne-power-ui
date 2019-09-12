import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import moment from 'moment';
import { message } from 'antd';
import path from '../../../../constants/path';
import { runAchieveAction } from './runAchieveReducer';

const { APIBasePath } = path.basePaths;
const { highAnalysis, monitor } = path.APISubPaths;

function *getDevices({ payload }){
  const url = `${APIBasePath}${highAnalysis.getDevices}`;
  try {
    const { stationCode, runInfo, runFlag } = payload || {};
    const response = yield call(request.post, url, {
      stationCodes: [stationCode],
      deviceTypeCode: 101,
    });
    if (response.code === '10000') {
      const originData = response.data.dataList || [];
      const modeDevices = originData.map(e => ({
        value: e.deviceModeCode,
        label: e.deviceModeName,
        children: (e.devices && e.devices.length > 0) ? e.devices.map(m => ({
          value: m.deviceFullcode,
          label: m.deviceName,
          deviceId: m.deviceId,
        })) : [],
      }));
      // 第一个电站下的设备列表
      const dataArr = modeDevices[0] && modeDevices[0].children && modeDevices[0].children;
      const deviceIds = [];
      const deviceCode = [];
      dataArr.forEach((cur, index) => {
        if(index < 3) {
          deviceIds.push(cur.deviceId);
          deviceCode.push(cur.value);
        }
      });
      // 获取指标
      yield put({
        type: runAchieveAction.getPointsInfo,
        payload: {
          deviceIds,
          runInfo: {
            startTime: moment(runInfo.searchDates[0]).utc().format(),
            endTime: moment(runInfo.searchDates[1]).utc().format(),
            deviceFullcodes: deviceCode,
          },
          runFlag,
        },
      });
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          modeDevices,
        },
      });
    } else{
      throw response.data;
    }
  } catch (error) {
    message.error('获取设备失败, 请刷新重试');
  }
}

function *getPointsInfo(action){
  const { payload: { deviceIds, runInfo, runFlag } } = action;
  const url = `${APIBasePath}${monitor.getPointsInfo}`;
  try {
    const response = yield call(request.post, url, {
      deviceIds,
      devicePointTypes: ['YC'],
    });
    if (response.code === '10000') {
      // 判断有没有扭矩
      const torqueFlag = response.data && response.data.map(cur => (cur.value)).includes('CV002');
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          pointsInfo: response.data && response.data.map(cur => ({
            name: cur.devicePointName,
            value: cur.devicePointCode,
            unitName: cur.devicePointUnit,
          })),
          pointTime: moment().unix(),
          thirdChartYAxis: torqueFlag ? 'CV002' : 'TR002', //第三个图表判断有没有扭矩，没有默认功率
          thirdYAxisName: torqueFlag ? '扭矩' : '有功功率', //第三个图表判断有没有扭矩，没有默认功率
          thirdYAxisUnit: torqueFlag ? 'Nm' : 'kw', //第三个图表判断有没有扭矩，没有默认功率
        },
      });
      // 判断是否请求第三个图chart
      if(runFlag) {
        const params = {
          ...runInfo,
          codes: ['GN001-xAxis-1', `${torqueFlag ? 'CV002' : 'TR002'}-yAxis-1`],
        };
        // 获取指标
        yield put({
          type: runAchieveAction.getThirdChart,
          payload: params,
        });
      }
    } else{
      throw response.data;
    }
  } catch (error) {
    message.error('获取指标失败, 请刷新重试');
  }
}

function *getSequenceChart(action){
  const { payload } = action;
  const url = `${APIBasePath}${highAnalysis.getSequenceChart}`;
  try {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        sequenceLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          sequenceData: !response.data || JSON.stringify(response.data) === '{}' ? [] : response.data,
          sequenceLoading: false,
          sequenceTime: moment().unix(), //时间戳
        },
      });
    } else{
      yield put({
        type: runAchieveAction.changeStore,
        payload: {
          sequenceLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        sequenceLoading: false,
      },
    });
    message.error('获取时序图失败, 请刷新重试');
  }
}


function *getFirstChart(action){
  const { payload } = action;
  const url = `${APIBasePath}${highAnalysis.getFirstChart}`;
  try {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        firstChartLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          firstChartData: !response.data || JSON.stringify(response.data) === '{}' ? [] : response.data,
          firstChartLoading: false,
          firstChartTime: moment().unix(), //时间戳
        },
      });
    } else{
      yield put({
        type: runAchieveAction.changeStore,
        payload: {
          firstChartLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        firstChartLoading: false,
      },
    });
    message.error('获取散点图失败, 请刷新重试');
  }
}

function *getSecondChart(action){
  const { payload } = action;
  const url = `${APIBasePath}${highAnalysis.getSecondChart}`;
  try {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        secondChartLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          secondChartData: !response.data || JSON.stringify(response.data) === '{}' ? [] : response.data,
          secondChartLoading: false,
          secondChartTime: moment().unix(), //时间戳
        },
      });
    } else{
      yield put({
        type: runAchieveAction.changeStore,
        payload: {
          secondChartLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        secondChartLoading: false,
      },
    });
    message.error('获取散点图失败, 请刷新重试');
  }
}

function *getThirdChart(action){
  const { payload } = action;
  const url = `${APIBasePath}${highAnalysis.getThirdChart}`;
  try {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        thirdChartLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          thirdChartData: !response.data || JSON.stringify(response.data) === '{}' ? [] : response.data,
          thirdChartLoading: false,
          thirdChartTime: moment().unix(), //时间戳
        },
      });
    } else{
      yield put({
        type: runAchieveAction.changeStore,
        payload: {
          thirdChartLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        thirdChartLoading: false,
      },
    });
    message.error('获取散点图失败, 请刷新重试');
  }
}

function *getFourthChart(action){
  const { payload } = action;
  const url = `${APIBasePath}${highAnalysis.getFourthChart}`;
  try {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        fourthChartLoading: true,
      },
    });
    const response = yield call(request.post, url, payload);
    if (response.code === '10000') {
      yield put({
        type: runAchieveAction.fetchSuccess,
        payload: {
          fourthChartData: !response.data || JSON.stringify(response.data) === '{}' ? [] : response.data,
          fourthChartLoading: false,
          fourthChartTime: moment().unix(), //时间戳
        },
      });
    } else{
      yield put({
        type: runAchieveAction.changeStore,
        payload: {
          fourthChartLoading: false,
        },
      });
      throw response.data;
    }
  } catch (error) {
    yield put({
      type: runAchieveAction.changeStore,
      payload: {
        fourthChartLoading: false,
      },
    });
    message.error('获取散点图失败, 请刷新重试');
  }
}

export function* watchRunAchieve() {
  yield takeLatest(runAchieveAction.getDevices, getDevices);
  yield takeLatest(runAchieveAction.getSequenceChart, getSequenceChart);
  yield takeLatest(runAchieveAction.getFirstChart, getFirstChart);
  yield takeLatest(runAchieveAction.getSecondChart, getSecondChart);
  yield takeLatest(runAchieveAction.getThirdChart, getThirdChart);
  yield takeLatest(runAchieveAction.getFourthChart, getFourthChart);
  yield takeLatest(runAchieveAction.getPointsInfo, getPointsInfo);
}
