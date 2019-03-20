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
        loading: true,
        listQueryParams: {
          ...payload,
        },
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
      },
    })
  }
}


function* addWran(action) { // 新增预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.post, url, payload.params);
    if (response.data.code === '10000') {
      message.success('新增成功！！！');
      const params = yield select(state => {
        return state.system.warning.get('listQueryParams').toJS();
      });
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          showPage: payload.continueAdd ? 'add' : 'home',
        },
      });
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

function* modify(action) { // 修改预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      message.success('修改成功!!!');
      const params = yield select(state => {
        return state.system.warning.get('listQueryParams').toJS();
      });
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          showPage: 'home',
        },
      });
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

function* getDetail(action) { // 查询预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}/${payload}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          warnDetail: response.data.data || {}
        },
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('请求数据失败！！！')
    yield put({
      type: warningAction.changeWarnStore,
      payload: {
        warnDetail: {}
      },
    });
  }
}

function* warnDelete(action) { // 删除预警配置
  const { payload } = action;
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      message.success('删除成功！！！')
      const params = yield select(state => {
        return state.system.warning.get('listQueryParams').toJS();
      });
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
        warnDetail: {}
      },
    });
  }
}

function* getOtherPageDetail(action) {//预警规则 第一条查看前一条详情/最后一条看下一条详情=>翻页+请求详情
  const { payload } = action;
  const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAlarmList}`
  try {
    const listResponse = yield call(axios.post, listUrl, payload.parms);
    const warnList = listResponse.data.data || [];
    const totalNum = listResponse.data.data && listResponse.data.data[0] && listResponse.data.data[0].totalCount || 0;
    if (listResponse.data.code) {
      const { warningCheckId } = payload.previous ? warnList[warnList.length - 1] : warnList[0];
      const detailUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.warnConf}/${warningCheckId}`;
      const detailResponse = yield call(axios.get, detailUrl);
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          listQueryParams: {
            ...payload.parms,
          },
          warnList,
          warnDetail: detailResponse.data.data || {},
          totalNum,
        },
      });
    }

  } catch (e) {
    console.log(e);
  }
}



function* getPoints(action) { // 新-获取电站下测点数据
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getStationPoints}`;
  const { payload } = action;
  const params=payload;
  try {
    const response = yield call(axios.get, url, { params });
    if (response.data.code === '10000') {
      yield put({
        type: warningAction.changeWarnStore,
        payload: {
          ruleDevicePoints: response.data.data || [],
        }
      });
    }
  } catch (e) {
    console.log(e);
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
  yield takeLatest(warningAction.getOtherPageDetail, getOtherPageDetail);
  yield takeLatest(warningAction.getPoints, getPoints);

}