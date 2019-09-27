import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { intelligentExpertAction } from './intelligentExpertAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;
message.config({ top: 200, duration: 2, maxCount: 3 });
function* getIntelligentTable({ payload = {} }) { // 获取列表数据
  const url = `${APIBasePath}${operation.getIntelligentTable}`;
  const { orderField, sortMethod } = payload;
  const params = {
    ...payload,
    orderField: orderField && orderField || 'like_count',
    sortMethod: sortMethod && sortMethod || 'desc',
  };
  try {
    yield put({
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload: {
        tableLoading: true,
        listParams: payload,
      },
    });
    const response = yield call(axios.post, url, params);
    const { total = 0 } = response.data.data || {};
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(total / pageSize);
    if (total === 0) {
      pageNum = 1;
    } else if (maxPage < pageNum) {
      pageNum = maxPage;
    }
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          listParams: {
            ...payload,
            pageNum,
          },
          tableLoading: false,
          intelligentTableData: response.data.data || {},
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取列表数据失败！');
    yield put({
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload: {
        tableLoading: false,
        intelligentTableData: {},
      },
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
      processData: false, // 不处理数据
      contentType: false, // 不设置内容类型
    });
    if (response.data.code === '10000') {
      message.success('恭喜！你所提交的内容已经导入成功，可在列表中查看', 3);
      payload.cancelModal(); // 成功之后，可以关闭弹框
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },
      });
      const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS());// 继续请求智能专家库列表
      yield put({
        type: intelligentExpertAction.getIntelligentTable,
        payload: params,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error('导入失败，请检查文件后重试！');
  }
}

function* deleteIntelligent({ payload = {} }) { // 删除
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  const { knowledgeBaseIds } = payload;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      message.success('删除成功');
      if (knowledgeBaseIds.length > 0) {
        yield put({
          type: intelligentExpertAction.changeIntelligentExpertStore,
          payload: {
            selectedRowKeys: [],
          },
        });
      }
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

function* getUserName({ payload = {} }) { // 获取相关录入人
  const { username } = payload;
  try {
    const url = `${APIBasePath}${operation.getUserName}/${username}`;
    yield put({ // 相关请求参数缓存，并保留选中的信息。
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload: {
        ...payload,
      },
    });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          ...payload,
          usernames: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (error) {
    message.error('获取录入人失败！');
    console.log(error);
  }
}

function* addIntelligent({ payload = {} }) { // 添加智能专家库
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  const { continueAdd, ...params } = payload;
  try {
    const response = yield call(axios.post, url, { ...params });
    if (response.data.code === '10000') {
      message.success('恭喜！你所提交的信息已经保存成功，可在列表中查看');
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          ...params,
          showPage: continueAdd ? 'add' : 'list',
        },
      });
      if (!continueAdd) {
        console.log('进来了');
        const params = yield select(state => state.operation.intelligentExpert.get('listParams').toJS());// 继续请求智能专家库列表
        yield put({
          type: intelligentExpertAction.getIntelligentTable,
          payload: params,
        });
      }
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload,
    });
    message.error('添加失败，请重试');
  }
}

const changeAnnexsform = (annexs) => {
  return annexs.map(e => {
    const arr = e.split('/');
    return {
      url: e,
      urlName: arr[arr.length - 1],
    };
  });
};

function* getKnowledgebase({ payload = {} }) { // 查看智能专家库详情
  const { knowledgeBaseId } = payload;
  const url = `${APIBasePath}${operation.operationIntelligent}/${knowledgeBaseId}`;
  try {
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          knowledgeBaseId,
          intelligentDetail: response.data.data || {},
          uploadFileList: changeAnnexsform(response.data.data.annexs || []),
        },
      });
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
      message.success('点赞成功');
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload,
      });
      const payload = yield select(state => ({
        knowledgeBaseId: state.operation.intelligentExpert.get('knowledgeBaseId'),
      }));
      yield put({
        type: intelligentExpertAction.getKnowledgebase,
        payload,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
  }
}

function* editIntelligent({ payload = {} }) { // 编辑智能专家库详情
  const url = `${APIBasePath}${operation.operationIntelligent}`;
  try {
    const response = yield call(axios.put, url, { ...payload });
    if (response.data.code === '10000') {
      message.success('编辑成功', 3);
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          showPage: 'list',
          uploadFileList: [],
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
  } catch (e) {
    console.log(e);
    message.error('编辑详情失败，请重试');
  }
}

const dealData = (data) => {
  const initData = data.map(e => {
    e.children = e.modeDatas && e.modeDatas.map(item => {
      return {
        label: item.modeName,
        value: item.modeId,
      };
    });
    return {
      label: e.manufactorName,
      value: e.manufactorId,
      children: e.children,
    };
  });
  return initData;
};

function* getDevicemodes(action) { // 获取设备列表
  const { payload } = action;
  const { manufactorId } = payload;
  const url = `${APIBasePath}${operation.deviceModeList}/${manufactorId}`;
  try {
    const response = yield call(axios.get, url, { params: payload });
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          deviceModeList: dealData(response.data.data) || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload: {
        deviceModeList: [],
      },
    });
  }

}

function* getFaultCodeList(action) { // 获取设备列表
  const { payload } = action;
  const { faultCode } = payload;
  console.log('faultCode', faultCode);
  const url = `${APIBasePath}${operation.getFaultCode}/${faultCode}`;
  try {
    const response = yield call(axios.get, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          faultCodeList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: intelligentExpertAction.changeIntelligentExpertStore,
      payload: {
        faultCodeList: [],
      },
    });
  }

}

function* uploadFile({ payload = {} }) { // 上传附件  不限制文件类型
  const url = `${APIBasePath}${operation.uploadFile}`;
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false, // 不处理数据
      contentType: false, // 不设置内容类型
    });
    if (response.data.code === '10000') {
      const params = yield select(state => state.operation.intelligentExpert.get('uploadFileList'));
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          uploadFileList: [...params, response.data.data],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error('上传失败，请检查文件后重试！');
  }
}

function* deleteFile({ payload = {} }) { // 附件删除
  const url = `${APIBasePath}${operation.deleteFile}`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      yield put({
        type: intelligentExpertAction.changeIntelligentExpertStore,
        payload: {
          uploadFile: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    console.log(e);
    message.error('上传失败，请检查文件后重试！');
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
  yield takeLatest(intelligentExpertAction.getDevicemodes, getDevicemodes);
  yield takeLatest(intelligentExpertAction.getFaultCodeList, getFaultCodeList);
  yield takeLatest(intelligentExpertAction.uploadFile, uploadFile);
  yield takeLatest(intelligentExpertAction.deleteFile, deleteFile);
}
