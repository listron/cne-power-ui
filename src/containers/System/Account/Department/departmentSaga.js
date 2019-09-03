import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { departmentAction } from './departmentAction';
import { commonAction } from '../../../alphaRedux/commonAction';


function* changeDepartmentStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type: departmentAction.CHANGE_DEPARTMENT_STORE,
    payload,
  });
}

function* resetStore() {
  yield put({
    type: departmentAction.RESET_STORE,
  });
}

function* getDepartmentList(action) {//请求部门列表数据
  const { payload } = action;
  // const url = '/mock/system/departmentList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDepartmentList}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.post, url, payload);

    const totalNum = response.data.data.totalNum || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if (totalNum === 0) { // 总数为0时，展示0页
      pageNum = 1;
    } else if (maxPage < pageNum) { // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload: {
        ...payload,
        departmentData: response.data.data.context || [],
        totalNum,
        pageNum,
        buttonLoading: false,
      },
    });
  } catch (e) {
    yield put({
      type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload: {
        ...payload,
        departmentData: [],
        totalNum: 0,
        buttonLoading: false,
      },
    });
    console.log(e);
  }
}

function* deleteDepartment(action) { // 删除部门
  const { payload } = action;
  // const url = '/mock/system/deleteDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.departmentInfo}/${payload.departmentId}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.delete, url);
    if (response.data.code === '10000') {
      yield put({//清空选中项
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          selectedDepartment: [],
        },
      });
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.system.department.get('departmentSource'),
        departmentName: state.system.department.get('departmentName'),
        parentDepartmentName: state.system.department.get('parentDepartmentName'),
        stationName: state.system.department.get('stationName'),
        sort: state.system.department.get('sort'),
        ascend: state.system.department.get('ascend'),
        pageNum: state.system.department.get('pageNum'),
        pageSize: state.system.department.get('pageSize'),
      }));
      yield put({//重新请求所有部门信息
        type: departmentAction.getAllDepartment,
        payload: { enterpriseId: payload.enterpriseId },
      });
      yield put({
        type: departmentAction.getDepartmentList,
        payload: params,
      });
    }
  } catch (e) {
    console.log(e);
    yield put({//清空选中项
      type: departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: {
        loading: false,
        buttonLoading: false,
      },
    });
  }
}

//获取该企业所有用户，用于部门分配用户数据
function* getDepartmentUser(action) {
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDepartmentUser}/${payload.enterpriseId}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
        payload: {
          departmentUser: response.data.data,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getAllDepartment(action) {//获取所有部门基础信息
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getAllDepartment}/${payload.enterpriseId}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
        payload: {
          allDepartment: response.data.data,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getDepartmentStation(action) {//获取电站-部门一一对应表
  const { payload } = action;
  // const url = '/mock/system/allDepartments';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDepartmentStation}/${payload.enterpriseId}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get, url);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
        payload: {
          DepartmentStation: response.data.data,
        },
      });
    }

  } catch (e) {
    console.log(e);
  }
}

function* getDepartmentDetail(action) {// 请求单部门详细数据信息
  const { payload } = action;
  // const url = '/mock/system/departmentDetail';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.departmentInfo}/${payload.departmentId}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const response = yield call(axios.get, url);
    yield put({
      type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload: {
        departmentDetail: response.data && response.data.data || {},
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function* getOtherPageDetail(action) {//部门详情页第一条查看前一条详情/最后一条看下一条详情=>翻页+请求详情
  const { payload, previous } = action;
  // const listUrl = '/mock/system/departmentList';
  const listUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDepartmentList}`;
  try {
    yield put({ type: departmentAction.DEPARTMENT_FETCH });
    const listResponse = yield call(axios.post, listUrl, payload);
    const { departmentData, totalNum } = listResponse.data.data;
    const { departmentId } = previous ? departmentData[departmentData.length - 1] : departmentData[0];
    // const detailUrl = '/mock/system/departmentDetail';
    const detailUrl = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.departmentInfo}/${departmentId}`;
    const detailResponse = yield call(axios.get, detailUrl);
    yield put({
      type: departmentAction.GET_DEPARTMENT_FETCH_SUCCESS,
      payload: {
        ...payload,
        departmentData,
        totalNum,
        departmentDetail: detailResponse.data.data,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function* addDepartmentInfo(action) {//新建部门信息
  const { payload } = action;
  // const url = '/mock/system/addDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.departmentInfo}`;
  try {
    yield put({ //按钮的loading
      type: departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: {
        buttonLoading: !payload.continueAdd,
        continueAddLoading: payload.continueAdd,
      },
    });
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          showPage: payload.continueAdd ? 'add' : 'list',
          buttonLoading: false,
          continueAddLoading: false,
        },
      });
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.system.department.get('departmentSource'),
        departmentName: state.system.department.get('departmentName'),
        parentDepartmentName: state.system.department.get('parentDepartmentName'),
        stationName: state.system.department.get('stationName'),
        sort: state.system.department.get('sort'),
        ascend: state.system.department.get('ascend'),
        pageNum: state.system.department.get('pageNum'),
        pageSize: state.system.department.get('pageSize'),
      }));
      yield put({//请求所有部门信息
        type: departmentAction.getAllDepartment,
        payload: { enterpriseId: payload.enterpriseId },
      });
      yield put({
        type: departmentAction.getDepartmentList,
        payload: params,
      });
    } else {
      message.error('数据出错,请重新填写');
      yield put({
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          buttonLoading: false,
          continueAddLoading: false,
          loading: false,
        },
      });
    }
  } catch (e) {
    console.log(e);
    message.error('数据出错,请重新填写');
    yield put({
      type: departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: {
        buttonLoading: false,
        continueAddLoading: false,
        loading: false,
      },
    });
  }
}

function* editDepartmentInfo(action) {//编辑部门信息
  const { payload } = action;
  // const url = '/mock/system/editDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.departmentInfo}`;
  try {
    yield put({ //按钮的loading
      type: departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: { buttonLoading: true },
    });
    const response = yield call(axios.put, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          showPage: 'list',
        },
      });
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.system.department.get('departmentSource'),
        departmentName: state.system.department.get('departmentName'),
        parentDepartmentName: state.system.department.get('parentDepartmentName'),
        stationName: state.system.department.get('stationName'),
        sort: state.system.department.get('sort'),
        ascend: state.system.department.get('ascend'),
        pageNum: state.system.department.get('pageNum'),
        pageSize: state.system.department.get('pageSize'),
      }));
      yield put({
        type: departmentAction.getDepartmentList,
        payload: params,
      });
    }
  } catch (e) {
    yield put({ //按钮的loading
      type: departmentAction.CHANGE_DEPARTMENT_STORE,
      payload: {
        buttonLoading: false,
        continueAddLoading: false,
        loading: false,
      },
    });
    console.log(e);
  }
}

function* setDepartmentUser(action) {
  const { payload } = action;
  // const url = '/mock/system/editDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setDepartmentUser}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          showAssignUserModal: false,
        },
      });
      const showPage = yield select(state => state.system.department.get('showPage'));
      const departmentId = yield select(state => state.system.department.getIn(['departmentDetail', 'departmentId']));
      if (showPage === 'detail') {
        yield put({
          type: departmentAction.getDepartmentDetail,
          payload: {
            departmentId: departmentId,
          },
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function* setDepartmentStation(action) {
  const { payload } = action;
  // const url = '/mock/system/editDepartment';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.setDepartmentStation}`;
  try {
    const response = yield call(axios.post, url, payload);
    if (response.data.code === '10000') {
      yield put({
        type: departmentAction.CHANGE_DEPARTMENT_STORE,
        payload: {
          showAssignStationModal: false,
        },
      });
      const showPage = yield select(state => state.system.department.get('showPage'));
      const departmentId = yield select(state => state.system.department.getIn(['departmentDetail', 'departmentId']));
      if (showPage === 'detail') {
        yield put({
          type: departmentAction.getDepartmentDetail,
          payload: {
            departmentId: departmentId,
          },
        });
      }
      const params = yield select(state => ({//继续请求部门列表
        enterpriseId: payload.enterpriseId,
        departmentSource: state.system.department.get('departmentSource'),
        departmentName: state.system.department.get('departmentName'),
        parentDepartmentName: state.system.department.get('parentDepartmentName'),
        stationName: state.system.department.get('stationName'),
        sort: state.system.department.get('sort'),
        ascend: state.system.department.get('ascend'),
        pageNum: state.system.department.get('pageNum'),
        pageSize: state.system.department.get('pageSize'),
      }));
      yield put({
        type: departmentAction.getDepartmentList,
        payload: params,
      });
      yield put({
        type: commonAction.getStations,
      });

    }
  } catch (e) {
    console.log(e);
  }
}


export function* watchDepartment() {
  yield takeLatest(departmentAction.changeDepartmentStore, changeDepartmentStore);
  yield takeLatest(departmentAction.resetStore, resetStore);
  yield takeLatest(departmentAction.getDepartmentList, getDepartmentList);
  yield takeLatest(departmentAction.deleteDepartment, deleteDepartment);
  yield takeLatest(departmentAction.getDepartmentUser, getDepartmentUser);
  yield takeLatest(departmentAction.getAllDepartment, getAllDepartment);
  yield takeLatest(departmentAction.getDepartmentStation, getDepartmentStation);
  yield takeLatest(departmentAction.getDepartmentDetail, getDepartmentDetail);
  yield takeLatest(departmentAction.getOtherPageDetail, getOtherPageDetail);
  yield takeLatest(departmentAction.addDepartmentInfo, addDepartmentInfo);
  yield takeLatest(departmentAction.editDepartmentInfo, editDepartmentInfo);
  yield takeLatest(departmentAction.setDepartmentUser, setDepartmentUser);
  yield takeLatest(departmentAction.setDepartmentStation, setDepartmentStation);
}

