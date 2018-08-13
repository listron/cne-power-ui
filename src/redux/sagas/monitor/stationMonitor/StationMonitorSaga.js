import { call, put, takeLatest,select } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';

import { allStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/allStationAction';




// function *getDepartmentList(action){//请求部门列表数据
//   const { payload } = action;
//   const url = '/mock/system/departmentList';
//   // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
//   try{
//     yield put({ type:allStationAction.DEPARTMENT_FETCH });
//     const response = yield call(axios.post,url,payload);
//     yield put({
//       type:  allStationAction.GET_DEPARTMENT_FETCH_SUCCESS,
//       payload:{
//         ...payload,
//         departmentData: response.data.data.departmentData,
//         totalNum: response.data.data.totalNum,
//         buttonLoading: false
//       },
//     });
//   }catch(e){
//     console.log(e);
//   }
// }
// //todo - 删除部门
// function *deleteDepartment(action){
//   const { payload } = action;
//   const url = '/mock/system/deleteDepartment';
//   // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
//   try{
//     yield put({ type:allStationAction.DEPARTMENT_FETCH });
//     const response = yield call(axios.delete,url,payload);
//     if(response.data.code === "10000"){
//       yield put({//清空选中项
//         type:  allStationAction.CHANGE_DEPARTMENT_STORE,
//         payload: {
//           selectedDepartment: [],
//         },
//       })
//       const params = yield select(state => ({//继续请求部门列表
//         enterpriseId: payload.enterpriseId,
//         departmentSource: state.department.get('departmentSource'),
//         departmentName: state.department.get('departmentName'),
//         parentDepartmentName: state.department.get('parentDepartmentName'),
//         stationName: state.department.get('stationName'),
//         sort: state.department.get('sort'),
//         ascend: state.department.get('ascend'),
//         pageNum: state.department.get('pageNum'),
//         pageSize: state.department.get('pageSize'),
//       }));
//       yield put({
//         type:  allStationAction.GET_DEPARTMENT_LIST_SAGA,
//         payload: params,
//       });
//     }
//   }catch(e){
//     console.log(e);
//   }
// }

// //获取所有用户--todo 获取该企业所有用户，用于分配所有用户数据
// function *getAllUsers(action){
//   try{
//     //todo
//   }catch(e){
//     console.log(e)
//   }
// }



// function *getDepartmentDetail(action){// 请求单部门详细数据信息
//   const { payload } = action;
//   const url = '/mock/system/departmentDetail';
//   // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}/${payload.departmentId}`
//   try{
//     yield put({ type:allStationAction.DEPARTMENT_FETCH });
//     const response = yield call(axios.get,url);
//     yield put({
//       type:  allStationAction.GET_DEPARTMENT_FETCH_SUCCESS,
//       payload:{
//         departmentDetail: response.data.data,
//       },
//     });
//   }catch(e){
//     console.log(e);
//   }
// }

// function *getOtherPageDetail(action){//部门详情页第一条查看前一条详情/最后一条看下一条详情=>翻页+请求详情
//   const { payload, previous } = action;
//   const listUrl = '/mock/system/departmentList';
//   // const listUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.getDepartmentList}`
//   try{
//     yield put({ type:allStationAction.DEPARTMENT_FETCH });
//     const listResponse = yield call(axios.post,listUrl,payload);
//     const { departmentData, totalNum } = listResponse.data.data;
//     const { departmentId } = previous?departmentData[departmentData.length - 1]:departmentData[0];
//     const detailUrl = '/mock/system/departmentDetail';
//     // const detailUrl = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}/${departmentId}`
//     const detailResponse = yield call(axios.get,detailUrl);
//     yield put({
//       type:  allStationAction.GET_DEPARTMENT_FETCH_SUCCESS,
//       payload:{
//         ...payload,
//         departmentData,
//         totalNum,
//         departmentDetail: detailResponse.data.data,
//       },
//     });
//   }catch(e){
//     console.log(e);
//   }
// }



// function *editDepartmentInfor(action){//编辑部门信息
//   const { payload } = action;
//   const url = '/mock/system/editDepartment';
//   // const url = `${Path.basePaths.newAPIBasePath}${Path.APISubPaths.system.departmentInfor}`
//   try{
//     yield put({ //按钮的loading
//       type:allStationAction.GET_DEPARTMENT_FETCH_SUCCESS,
//       payload: { buttonLoading: true }
//     });
//     const response = yield call(axios.put,url,payload);
//     if(response.data.code === "10000"){
//       yield put({
//         type:  allStationAction.GET_DEPARTMENT_FETCH_SUCCESS,
//         payload:{
//           showPage: 'list',
//         }
//       });
//       const params = yield select(state => ({//继续请求部门列表
//         enterpriseId: payload.enterpriseId,
//         departmentSource: state.department.get('departmentSource'),
//         departmentName: state.department.get('departmentName'),
//         parentDepartmentName: state.department.get('parentDepartmentName'),
//         stationName: state.department.get('stationName'),
//         sort: state.department.get('sort'),
//         ascend: state.department.get('ascend'),
//         pageNum: state.department.get('pageNum'),
//         pageSize: state.department.get('pageSize'),
//       }));
//       yield put({
//         type:  allStationAction.GET_DEPARTMENT_LIST_SAGA,
//         payload: params,
//       });
//     }
//   }catch(e){
//     console.log(e);
//   }
// }

// //todo - 请求各部门及部门下各电站信息
// function *getDepartmentWithStation(){

// }

// //todo - 请求各部门及部门下各用户信息
// function *getDepartmentWithUser(){

// }
function *getAllMonitorStation(action){//获取所有电站信息
  const { payload } = action;
  const url =  '/mock/v3/monitor/stations/stationType';
  try{
    yield put({ type:allStationAction.MONITORSTATION_FETCH });
    const response = yield call(axios.get,url);
    console.log(response);
    yield put({
      type:  allStationAction.GET_MONITORSTATION_FETCH_SUCCESS,
      payload:{
        allMonitorStation: response.data.data,
      },
    });
  }catch(e){
    console.log(e);
  }
}
function * changeMonitorStationStore(action){//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  allStationAction.CHANGE_MONITORSTATION_STORE,
    payload,
  })

}



export function* watchDepartment() {
  yield takeLatest(allStationAction.GET_ALL_MONITORSTATION_SAGA,getAllMonitorStation);
  yield takeLatest(allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, changeMonitorStationStore);
  // yield takeLatest(allStationAction.CHANGE_DEPARTMENT_STORE_SAGA, changeDepartmentStore);
  // yield takeLatest(allStationAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
  // yield takeLatest(allStationAction.DELETE_DEPARTMENT_SAGA,deleteDepartment);
  // yield takeLatest(allStationAction.GET_ALL_USERS_SAGA,getAllUsers);
  // yield takeLatest(allStationAction.GET_ALL_DEPARTMENT_SAGA,getAllDepartment);
  // yield takeLatest(allStationAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
  // yield takeLatest(allStationAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA,getOtherPageDetail);
  // yield takeLatest(allStationAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfor);
  // yield takeLatest(allStationAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);
}

