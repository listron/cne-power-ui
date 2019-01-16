import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { warningAction } from './warningAction.js';
import Cookie from 'js-cookie';


function* changeWarnStore(action) { // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: warningAction.changeWarnStore,
    payload,
  })
}


function* resetStore() {
  yield put({
    type: warningAction.RESET_STORE
  })
}

function* getSeriesData(action) { //获取低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getSeriesData}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          getConf: response.data.data || {},
          lostGenPercent: response.data.data.lostGenPercent,
          isSend: response.data.data.isSend,
          sendNum: response.data.data.sendNum,
        },
      });
    } else { throw response.data.data }
  } catch (e) {
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        getConf: {},
        lostGenPercent: null,
        isSend: 0,
        sendNum: "",
      },
    });
    console.log(e);
  }
}

function* addSeriesData(action) { //修改低效组串预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addSeriesData}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('修改成功')
      yield put({
        type: warningAction.getSeriesData
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}

function* getCleaningData(action) { //获取清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getCleaningData}/${payload.enterpriseId}`
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          getClean: response.data.data || {},
          lossPowerPercent: response.data.data.lossPowerPercent
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        getClean: {},
        lossPowerPercent: null
      },
    });
  }
}

function* addCleaningData(action) { //设置清洗模型预警配置数据
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.addCleaningData}`
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('修改成功')
      const params = {
        enterpriseId: Cookie.get('enterpriseId'),
      };
      yield put({
        type: warningAction.getCleaningData,
        payload: { ...params }
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}


function* getWarnList(action) { // 请求预警事件列表
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAlarmList}`
  try {
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        loading: true
      }
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const totalNum = response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(totalNum / pageSize);
      if (totalNum === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          listQueryParams: {
            ...payload,
            pageNum,
          },
          warnList: response.data.data || [],
          totalNum: response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0,
          loading: false,
          showPage:'home'
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        listQueryParams: {
          ...payload,
        },
        loading: false,
        showPage:'home'
      },
    })
  }
}


function* addWran(action) { // 新增预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('新增成功！！！');
      const params = yield select(state => ({//继续请求生产计划列表
        stationCode: state.system.warning.get('listQueryParams').stationCode, // 电站编码
        deviceTypeCode: state.system.warning.get('listQueryParams').deviceTypeCode, // 设备类型编码
        deviceModeCode: state.system.warning.get('listQueryParams').deviceModeCode,// 设备型号编码
        pointCode: state.system.warning.get('listQueryParams').pointCode, // 测点编码
        pageNum: state.system.warning.get('listQueryParams').pageNum,
        pageSize: state.system.warning.get('listQueryParams').pageSize,
        sortField: state.system.warning.get('listQueryParams').sortField, // 1 是告警级别
        sortOrder: state.system.warning.get('listQueryParams').sortOrder, // 
        warningTypeCode: state.system.warning.get('listQueryParams').warningTypeCode,  // 0/null告警，1预警
      }));
      yield put({
        type: warningAction.getWarnList,
        payload: params,
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('新增失败！！！')
  }
}

function* modify(action){ // 修改预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('修改成功!!!');
      const params = yield select(state => ({//继续请求生产计划列表
        stationCode: state.system.warning.get('listQueryParams').stationCode, // 电站编码
        deviceTypeCode: state.system.warning.get('listQueryParams').deviceTypeCode, // 设备类型编码
        deviceModeCode: state.system.warning.get('listQueryParams').deviceModeCode,// 设备型号编码
        pointCode: state.system.warning.get('listQueryParams').pointCode, // 测点编码
        pageNum: state.system.warning.get('listQueryParams').pageNum,
        pageSize: state.system.warning.get('listQueryParams').pageSize,
        sortField: state.system.warning.get('listQueryParams').sortField, // 1 是告警级别
        sortOrder: state.system.warning.get('listQueryParams').sortOrder, // 
        warningTypeCode: state.system.warning.get('listQueryParams').warningTypeCode,  // 0/null告警，1预警
      }));
      yield put({
        type: warningAction.getWarnList,
        payload: params,
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('修改失败！！！')
  }
}

function* getDetail(action){ // 查询预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}/${payload}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
           warnDetail:response.data.data || {}
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('请求数据失败！！！')
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
         warnDetail:{}
      },
    });
  }
}

function* warnDelete(action){ // 删除预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.delete, url,{data:payload});
    if (response.data.code === '10000') {
      message.success('删除成功！！！')
      const params = yield select(state => ({//继续请求生产计划列表
        stationCode: state.system.warning.get('listQueryParams').stationCode, // 电站编码
        deviceTypeCode: state.system.warning.get('listQueryParams').deviceTypeCode, // 设备类型编码
        deviceModeCode: state.system.warning.get('listQueryParams').deviceModeCode,// 设备型号编码
        pointCode: state.system.warning.get('listQueryParams').pointCode, // 测点编码
        pageNum: state.system.warning.get('listQueryParams').pageNum,
        pageSize: state.system.warning.get('listQueryParams').pageSize,
        sortField: state.system.warning.get('listQueryParams').sortField, // 1 是告警级别
        sortOrder: state.system.warning.get('listQueryParams').sortOrder, // 
        warningTypeCode: state.system.warning.get('listQueryParams').warningTypeCode,  // 0/null告警，1预警
      }));
      yield put({
        type: warningAction.getWarnList,
        payload: params,
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('删除失败！！！')
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
         warnDetail:{}
      },
    });
  }
}


export function* watchWarning() {
  yield takeLatest(warningAction.changeWarnStoreSaga, changeWarnStore);
  yield takeLatest(warningAction.resetStore, resetStore);
  yield takeLatest(warningAction.getSeriesData, getSeriesData);
  yield takeLatest(warningAction.getCleaningData, getCleaningData);
  yield takeLatest(warningAction.addSeriesData, addSeriesData);
  yield takeLatest(warningAction.addCleaningData, addCleaningData);
  yield takeLatest(warningAction.getWarnList, getWarnList);
  yield takeLatest(warningAction.addWran, addWran);
  yield takeLatest(warningAction.modify, modify);
  yield takeLatest(warningAction.getDetail, getDetail);
  yield takeLatest(warningAction.warnDelete, warnDelete);

}