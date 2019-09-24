import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import path from '../../../constants/path';
import { casePartAction } from './casePartAction';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

function* getDeviceMode(action) { // 获取机型
  const { payload = {} } = action;
  const url = `${APIBasePath}${operation.getDeviceMode}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const data = response.data.data || [];
      const modesInfo = data.map(e => ({
        value: parseInt(e.manufactorId, 0),
        label: e.manufactorName,
        children: (e.deviceModesList && e.deviceModesList.length > 0) ? e.deviceModesList.map(m => ({
          value: `${e.manufactorId}-${m.deviceModeCode}`,
          label: m.deviceModeName,
        })) : [],
      }));
      const deviceModeData = [];
      data.forEach((e) => {
        e.deviceModesList.forEach((item, i) => {
          deviceModeData.push({ ...item, ...e, deviceModeCode: `${e.manufactorId}-${item.deviceModeCode}` });
        });
      });
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          deviceModeData,
          modesInfo,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取机型列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        deviceModeData: [],
      },
    });
    console.log(e);
  }
}
function* getCasePartList(action) { // 获取列表数据
  const { payload } = action;
  const url = `${APIBasePath}${operation.getCasePartList}`;
  try {
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        tableLoading: true,
        ...payload,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const total = response.data.data.total || 0;
      let { pageNum } = payload;
      const { pageSize } = payload;
      const maxPage = Math.ceil(total / pageSize);
      if (total === 0) {
        pageNum = 1;
      } else if (maxPage < pageNum) {
        pageNum = maxPage;
      }

      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          tableLoading: false,
          casePartTableData: response.data.data.dataList || [],
          total,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        tableLoading: false,
        casePartTableData: [],
      },
    });
    console.log(e);
  }
}
function* getQuestionList(action) { // 获取问题列表
  const { payload } = action;
  const url = `${APIBasePath}${operation.getQuestionList}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          questionTypeList: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取问题列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        questionTypeList: [],
      },
    });
    console.log(e);
  }
}
function* getCasePartDetail(action) { // 详情
  const { payload } = action;
  const url = `${APIBasePath}${operation.getCasePartDetail}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      const caseDetailData = response.data.data || {};
      const uploadUrlArr = caseDetailData.annexs ? caseDetailData.annexs.map(e => {
        const queryName = e.annex.split('/');
        const name = queryName[queryName.length - 1];
        return { 'urlName': name, 'url': e.annex, 'name': name, uid: e.annex };
      }) : [];
      const caseDetail = { ...caseDetailData, annexs: uploadUrlArr };

      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          caseDetail,
          uploadUrlArr,
          editFileList: uploadUrlArr,
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取详情列表数据失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        caseDetail: {},
      },
    });
    console.log(e);
  }
}
function* addCasePart(action) { // 添加
  const { payload } = action;
  const url = `${APIBasePath}${operation.addCasePart}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('添加案例失败！');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* likeCase(action) { // 点赞
  const { payload } = action;
  const url = `${APIBasePath}${operation.likeCase}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      message.success('点赞成功');
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {

        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('点赞失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* editCasePart(action) { // 编辑案例
  const { payload } = action;
  const url = `${APIBasePath}${operation.editCasePart}`;
  try {
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      message.success('编辑成功');
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => ({
        //继续请求table列表
        questionTypeCodes: state.operation.casePartReducer.get('questionTypeCodes'),
        pageNum: state.operation.casePartReducer.get('pageNum'),
        pageSize: state.operation.casePartReducer.get('pageSize'),
        deviceModeList: state.operation.casePartReducer.get('deviceModeList'),
        faultDescription: state.operation.casePartReducer.get('faultDescription'),
        orderFiled: state.operation.casePartReducer.get('orderFiled'),
        orderType: state.operation.casePartReducer.get('orderType'),
        stationCodes: state.operation.casePartReducer.get('stationCodes'),
        userId: state.operation.casePartReducer.get('userId'),
        userName: state.operation.casePartReducer.get('userName'),
      }));
      yield put({
        type: casePartAction.getCasePartList,
        payload: params,
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('编辑案例失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* deleteCasePart(action) { // 删除案例
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteCasePart}`;
  try {
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },
      });
      const params = yield select(state => ({
        //继续请求table列表
        questionTypeCodes: state.operation.casePartReducer.get('questionTypeCodes'),
        pageNum: state.operation.casePartReducer.get('pageNum'),
        pageSize: state.operation.casePartReducer.get('pageSize'),
        deviceModeList: state.operation.casePartReducer.get('deviceModeList'),
        faultDescription: state.operation.casePartReducer.get('faultDescription'),
        orderFiled: state.operation.casePartReducer.get('orderFiled'),
        orderType: state.operation.casePartReducer.get('orderType'),
        stationCodes: state.operation.casePartReducer.get('stationCodes'),
        userId: state.operation.casePartReducer.get('userId'),
        userName: state.operation.casePartReducer.get('userName'),
      }));
      yield put({
        type: casePartAction.getCasePartList,
        payload: params,
      });

    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('删除案例失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {

      },
    });
    console.log(e);
  }
}
function* queryUseName(action) { // 获取填报人
  const { payload } = action;
  const url = `${APIBasePath}${operation.queryUseName}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          userData: response.data.data || [],
        },
      });
    } else {
      throw response.data;
    }
  } catch (e) {
    message.error('获取填报人失败');
    yield put({
      type: casePartAction.changeCasePartStore,
      payload: {
        userData: [],
      },
    });
    console.log(e);
  }
}
function* importCase(action) {
  // 导入设备；
  const { payload } = action;
  const url = `${APIBasePath}${
    operation.importCase
    }`;

  try {
    yield put({ type: casePartAction.changeCasePartStore });
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false, // 不处理数据
      contentType: false, // 不设置内容类型
    });
    if (response.data.code === '10000') {
      message.success('导入成功');
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          selectedRowKeys: [],
          selectedRowData: [],
        },
      });
      const params = yield select(state => ({
        //继续请求table列表
        questionTypeCodes: state.operation.casePartReducer.get('questionTypeCodes'),
        pageNum: state.operation.casePartReducer.get('pageNum'),
        pageSize: state.operation.casePartReducer.get('pageSize'),
        deviceModeList: state.operation.casePartReducer.get('deviceModeList'),
        faultDescription: state.operation.casePartReducer.get('faultDescription'),
        orderFiled: state.operation.casePartReducer.get('orderFiled'),
        orderType: state.operation.casePartReducer.get('orderType'),
        stationCodes: state.operation.casePartReducer.get('stationCodes'),
        userId: state.operation.casePartReducer.get('userId'),
        userName: state.operation.casePartReducer.get('userName'),
      }));
      yield put({
        type: casePartAction.getCasePartList,
        payload: params,
      });
    } else {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error(response.data.message);
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({ type: casePartAction.changeCasePartStore, payload: { loading: false } });
  }
}
function* uploadCaseFile(action) {
  //上传附件
  const { payload } = action;
  const url = `${APIBasePath}${operation.uploadCaseFile}`;
  const uploadUrlArr = yield select(state => (state.operation.casePartReducer.get('uploadUrlArr').toJS()));
  try {
    const response = yield call(axios, {
      method: 'post',
      url,
      data: payload.formData,
      processData: false, // 不处理数据
      contentType: false, // 不设置内容类型
    });
    if (response.data.code === '10000') {
      const uploadInfoData = response.data.data || {};
      uploadUrlArr.push(uploadInfoData);

      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
          uploadUrlArr,
        },
      });

    } else {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error(response.data.message);
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({ type: casePartAction.changeCasePartStore, payload: { loading: false, uploadUrlArr: [...uploadUrlArr, { url: '', urlName: '' }] } });
  }
}
function* deleteCaseFile(action) {
  //上传附件
  const { payload } = action;
  const url = `${APIBasePath}${operation.deleteCaseFile}`;
  try {
    yield put({ type: casePartAction.changeCasePartStore });
    const response = yield call(axios.delete, url, { data: payload });
    if (response.data.code === '10000') {
      yield put({
        type: casePartAction.changeCasePartStore,
        payload: {
        },
      });
    } else {
      message.config({ top: 200, duration: 2, maxCount: 3 });
      message.error(response.data.message);
      throw response.data.data;
    }
  } catch (e) {
    console.log(e);
    yield put({ type: casePartAction.changeCasePartStore, payload: { loading: false } });
  }
}

export function* watchCadePartSaga() {
  yield takeLatest(casePartAction.getDeviceMode, getDeviceMode);
  yield takeLatest(casePartAction.getQuestionList, getQuestionList);
  yield takeLatest(casePartAction.getCasePartList, getCasePartList);
  yield takeLatest(casePartAction.getCasePartDetail, getCasePartDetail);
  yield takeLatest(casePartAction.addCasePart, addCasePart);
  yield takeLatest(casePartAction.likeCase, likeCase);
  yield takeLatest(casePartAction.editCasePart, editCasePart);
  yield takeLatest(casePartAction.deleteCasePart, deleteCasePart);
  yield takeLatest(casePartAction.queryUseName, queryUseName);
  yield takeLatest(casePartAction.importCase, importCase);
  yield takeLatest(casePartAction.uploadCaseFile, uploadCaseFile);
  yield takeLatest(casePartAction.deleteCaseFile, deleteCaseFile);

}
