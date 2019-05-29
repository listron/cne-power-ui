import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { ticketAction } from '../ticketAction';
import { message } from 'antd';

function* changeDefectStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: ticketAction.CHANGE_DEFECT_STORE,
    payload,
  })
}

//获取缺陷工单列表
function* getDefectList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
      let { pageNum, pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) { // 总数为0时，展示0页
        pageNum = 1;
      } else if (maxPage < pageNum) { // 当前页已超出
        pageNum = maxPage;
      }
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          ...payload,
          total,
          pageNum,
          defectList: response.data.data.defectList,
          selectedRowKeys: [],
          defectStatusStatistics: response.data.data.defectStatusStatistics,
        }
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: ticketAction.SET_DEFECT_FAIL,
      payload: {
        defectList: [],
        selectedRowKeys: [],
        defectStatusStatistics: {},
        loading: false,
      }
    });
  }
}

//获取缺陷工单Id列表(用于上一个，下一个)
function* getDefectIdList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectIdList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          defectIdList: response.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷工单详情
function* getDefectDetail(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectDetail;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: { defectId: payload.defectId } });
    if (response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          defectDetail: response.data.data,
          defectId: payload.defectId,
        }
      });
    } else { throw response.data }
  } catch (e) {
    message.error('请求数据失败')
    // console.log(e);
    yield put({
      type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      payload: {
        defectDetail: {
          defectId: '',
          stationName: '',
          deviceName: '',
          defectTypeName: '',
          defectLevel: 1,
          defectDescribe: '',
          defectStatus: '1',
          photoAddress: '',
          handleData: {
            defectProposal: '',
            defectSolveInfo: '',
            replaceParts: '',
            defectSolveResult: 0,
            status: '1'
          },
          processData: []
        },
      }
    });
  }
}

//获取缺陷常用语
function* getDefectCommonList(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getCommonList;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          commonList: response.data.data.data
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//批量删除工单
function* batchDeleteDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchDeleteDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      message.success('批量删除成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.GET_DEFECT_ID_LIST_SAGA,
        payload: params
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//批量关闭工单
function* batchCloseDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchCloseDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('批量关闭成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//批量下发工单
function* batchSendDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchSendDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('批量下发成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//批量驳回工单
function* batchRejectDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchRejectDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('批量驳回成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//批量验收工单
function* batchChecktDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.batchCheckDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('批量验收成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//下发工单
function* sendDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.sendDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('下发成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: { container: 'list' },
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//驳回工单
function* rejectDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.rejectDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('驳回成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: { container: 'list' },
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//关闭工单
function* closeDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.closeDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('关闭成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: { container: 'list' },
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//执行工单
function* handleDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.handleDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('处理缺陷成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: { container: 'list' },
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//验收工单
function* checkDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.checkDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    // console.log(response)
    if (response.data.code === '10000') {
      message.success('验收成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: { container: 'list' },
      });
    } else {
      yield put({
        type: ticketAction.SET_DEFECT_FAIL,
        error: {
          code: response.data.code,
          message: response.data.message
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//获取缺陷类型信息
function* getDefectTypes(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getDefectTypes;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          defectTypes: response.data.data.data,
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

//生成缺陷
function* createNewDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.createNewDefect;
  // yield put({ type: ticketAction.TICKET_FETCH });
  const isContinueAdd = payload.isContinueAdd;
  delete payload.isContinueAdd;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('创建成功！');
      if (!isContinueAdd) {
        yield put({
          type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
          payload: {
            container: 'list',
          },
        });
      }
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.GET_DEFECT_ID_LIST_SAGA,
        payload: params
      });
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('创建缺陷失败！')
  }
}
//提交缺陷
function* submitDefect(action) {
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.submitDefect;
  yield put({ type: ticketAction.TICKET_FETCH });
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('提交成功！');
      const params = yield select(state => ({
        stationType: state.operation.defect.get('stationType'),
        stationCodes: state.operation.defect.get('stationCodes'),
        defectSource: state.operation.defect.get('defectSource'),
        defectLevel: state.operation.defect.get('defectLevel'),
        timeInterval: state.operation.defect.get('timeInterval'),
        status: state.operation.defect.get('status'),
        pageNum: state.operation.defect.get('pageNum'),
        pageSize: state.operation.defect.get('pageSize'),
        createTimeStart: state.operation.defect.get('createTimeStart'),
        createTimeEnd: state.operation.defect.get('createTimeEnd'),
        deviceTypeCode: state.operation.defect.get('deviceTypeCode'),
        defectTypeCode: state.operation.defect.get('defectTypeCode'),
        sort: state.operation.defect.get('sort'),
        handleUser: state.operation.defect.get('handleUser'),
      }));
      yield put({
        type: ticketAction.GET_DEFECT_LIST_SAGA,
        payload: params
      });
      yield put({
        type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA,
        payload: {
          container: 'list',
        },
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
    message.error('创建缺陷失败！')
  }
}

function* clearDefect(action) {
  yield put({
    type: ticketAction.CLEAR_DEFECT_STATE,
  });
}

function* getKnowledgebase(action) { // 获取智能专家列表
  const { payload } = action;
  let url = Path.basePaths.APIBasePath + Path.APISubPaths.ticket.getKnowledgebase;
  // let url = `/mock/operation/knowledgebase/list`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: ticketAction.GET_DEFECT_FETCH_SUCCESS,
        payload: {
          knowledgebasePramas:payload,
          knowledgebaseList: response.data.data.dataList || [],
        }
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}

function* likeKnowledgebase(action) { // 点赞智能专家
  const { payload } = action;
  const { knowledgeBaseId } = payload;
  let url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.ticket.likeKnowledgebase}${knowledgeBaseId }`;
  // let url = `/mock/operation/knowledgebase/like`;
  
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.config({ top: 230,duration: 2, maxCount: 2,});
      message.success('点赞成功')
      const params = yield select(state => {
        const { knowledgebasePramas = {} } = state.operation.defect.toJS();
        return knowledgebasePramas
      });
      yield put({ // 重新请求点赞列表
        type: ticketAction.getKnowledgebase,
        payload: params,
      })
    } else { throw response.data }
  } catch (e) {
    console.log(e);
  }
}


export function* watchDefect() {
  yield takeLatest(ticketAction.GET_DEFECT_LIST_SAGA, getDefectList);
  yield takeLatest(ticketAction.GET_DEFECT_ID_LIST_SAGA, getDefectIdList);
  yield takeLatest(ticketAction.CHANGE_DEFECT_STORE_SAGA, changeDefectStore);
  yield takeLatest(ticketAction.DELETE_BATCH_DEFECT_SAGA, batchDeleteDefect);
  yield takeLatest(ticketAction.SEND_BATCH_DEFECT_SAGA, batchSendDefect);
  yield takeLatest(ticketAction.CLOSE_BATCH_DEFECT_SAGA, batchCloseDefect);
  yield takeLatest(ticketAction.REJECT_BATCH_DEFECT_SAGA, batchRejectDefect);
  yield takeLatest(ticketAction.CHECK_BATCH_DEFECT_SAGA, batchChecktDefect);
  yield takeLatest(ticketAction.GET_DEFECT_DETAIL_SAGA, getDefectDetail);
  yield takeLatest(ticketAction.GET_DEFECT_LANGUAGE_SAGA, getDefectCommonList);
  yield takeLatest(ticketAction.SEND_DEFECT_SAGA, sendDefect);
  yield takeLatest(ticketAction.REJECT_DEFECT_SAGA, rejectDefect);
  yield takeLatest(ticketAction.CLOSE_DEFECT_SAGA, closeDefect);
  yield takeLatest(ticketAction.HANDLE_DEFECT_SAGA, handleDefect);
  yield takeLatest(ticketAction.CHECK_DEFECT_SAGA, checkDefect);
  yield takeLatest(ticketAction.GET_DEFECT_TYPE_SAGA, getDefectTypes);
  yield takeLatest(ticketAction.DEFECT_CREATE_SAGA, createNewDefect);
  yield takeLatest(ticketAction.SUBMIT_DEFECT_SAGA, submitDefect);
  yield takeLatest(ticketAction.CLEAR_DEFECT_STATE_SAGA, clearDefect);
  yield takeLatest(ticketAction.getKnowledgebase, getKnowledgebase);
  yield takeLatest(ticketAction.likeKnowledgebase, likeKnowledgebase);
}



















