import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { intelligentExpertAction } from './intelligentExpertAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

function* getIntelligentTable({ payload = {}}) { // 获取列表数据
  const url = `${APIBasePath}${operation.getIntelligentTable}`;

  const { deviceTypeCode, defectTypeCode, faultDescription, recorder, pageNum, pageSize, orderField, sortMethod } = payload;

  const params = {
    deviceTypeCodes: deviceTypeCode,
    faultTypeIds: (!deviceTypeCode || deviceTypeCode.length === 0) ? [] : defectTypeCode,
    faultDescription,
    recorder,
    pageNum,
    pageSize,
    orderField,
    sortMethod
  };
  try {
    yield put({
      type: intelligentExpertAction.getIntelligentExpertStore,
      payload: {
        tableLoading: true,
        ...payload,
      }
    });
    const response = yield call(axios.post, url, {...params});
    const { total = 0 } = response.data.data;
    let { pageNum, pageSize } = params;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          listParams:{
            ...payload,
            pageNum,
            pageSize,
            defectTypeCode: (!deviceTypeCode || deviceTypeCode.length === 0) ? [] : defectTypeCode,
          },
          tableLoading: false,
          intelligentTableData: response.data.data || {},
        },
      });
    } else {
      throw response.data
    }
  } catch (e) {
    message.error('获取列表数据失败！');
    yield put({
      type: intelligentExpertAction.getIntelligentExpertStore,
      payload: {
        tableLoading: false,
        intelligentTableData: {},
        ...params
      }
    });
    console.log(e);
  }
}

function* getImportIntelligent({ payload = {} }) { // 导入
  const url = `${APIBasePath}${operation.getImportIntelligent}`;
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false,  // 不处理数据
      contentType: false   // 不设置内容类型
    });
    if (response.data.code === "10000") {
      message.success('恭喜！你所提交的内容已经导入成功，可在列表中查看');
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          selectedRowKeys: [],
          selectedRowData: []
        }
      })
      const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS());// 继续请求智能专家库列表
      yield put({
        type: intelligentExpertAction.getIntelligentTable,
        payload: params,
      });
    } else {
      message.config({ top: 200,  duration: 2,maxCount: 3 });
      message.error(response.data.message)
    }
  } catch (e) {
    console.log(e);
    message.error('导入失败，请检查文件后重试！');
  }
}

function* deleteIntelligent({ payload = {} }) { // 删除
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      message.success('删除成功');
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload,
      })
      const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS());// 继续请求智能专家库列表
      yield put({
        type: intelligentExpertAction.getIntelligentTable,
        payload: params,
      });
    }
  } catch (e) {
    console.log(e);
    message.error('删除信息失败，请重试！');
  }
}

function* getUserName({payload = {}}) { // 获取相关录入人
  const { username } = payload;
  try {
    const url = `${APIBasePath}${operation.getUserName}/${username}`;
    yield put({ // 相关请求参数缓存，并保留选中的信息。
      type: intelligentExpertAction.getIntelligentExpertStore,
      payload: {
        ...payload,
      }
    })
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          ...payload,
          usernames: response.data.data || []
        }
      })
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取录入人失败！');
    console.log(error);
  }
}

function* addIntelligent({payload = {}}) { // 添加智能专家库
  const { continueAdd } = payload;
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  const { deviceTypeCode, defectTypeCode, faultDescription, checkItems, processingMethod, requiredTools, remark} = payload;
  const params = { deviceTypeCode, faultTypeId: defectTypeCode, faultDescription, checkItems, processingMethod, requiredTools, remark};
  try {
    const response = yield call(axios.post, url, { ...params });
    if (response.data.code === "10000") {
      message.success('添加成功！');
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          ...params,
          showPage: continueAdd ? 'add' : 'list',
          continueAdd
        }
      })
      const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS());// 继续请求智能专家库列表
      yield put({
        type: intelligentExpertAction.getIntelligentTable,
        payload: params,
      });
    } else {
      throw response.data
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: intelligentExpertAction.getIntelligentExpertStore,
      payload
    })
    message.error('添加失败，请重试');
  }
}

function* getKnowledgebase({payload = {}}) { // 查看智能专家库详情
  const { knowledgeBaseId, selectedIndex, showPage = 'show' } = payload;
  const url = `${APIBasePath}${operation.operationIntelligent}/${knowledgeBaseId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          selectedIndex,
          showPage,
          knowledgeBaseId,
          intelligentDetail: response.data.data || {},
        }
      })
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
  }
}

function* getLike({ payload = {} }) { // 点赞
  const { knowledgeBaseId } = payload;
  const url = `${APIBasePath}${operation.getLike}/${knowledgeBaseId}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.config({
        top: 230,
        duration: 2,
        maxCount: 2,
      });
      message.success('点赞成功')
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload
      })
      const payload = yield select(state => ({
        knowledgeBaseId: state.operation.intelligentExpert.get('knowledgeBaseId'),
      }));
      yield put({
        type: intelligentExpertAction.getKnowledgebase,
        payload,
      })
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
  }
}

function* editIntelligent({ payload = {} }){ // 编辑智能专家库详情
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  try{
    const response = yield call(axios.put, url, {...payload});
    if(response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS()); // 继续请求智能专家库列表
      yield put({
        type: intelligentExpertAction.getIntelligentTable,
        payload: params,
      });
    } else {
      throw response.data;
    }
  }catch(e){
    console.log(e);
    message.error('编辑电站详情失败，请重试');
  }
}

export function* watchIntelligentExper() {
  yield takeLatest(intelligentExpertAction.getIntelligentTable, getIntelligentTable);
  yield takeLatest(intelligentExpertAction.getImportIntelligent, getImportIntelligent);
  yield takeLatest(intelligentExpertAction.deleteIntelligent, deleteIntelligent);
  yield takeLatest(intelligentExpertAction.getUserName, getUserName);
  yield takeLatest(intelligentExpertAction.addIntelligent, addIntelligent);
  yield takeLatest(intelligentExpertAction.getKnowledgebase, getKnowledgebase);
  yield takeLatest(intelligentExpertAction.getLike, getLike);
  yield takeLatest(intelligentExpertAction.editIntelligent, editIntelligent);
}
