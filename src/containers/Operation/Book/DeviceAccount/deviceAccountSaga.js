import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { deviceAccountAction } from './deviceAccountAction';
import moment from 'moment';
const APIBasePath=Path.basePaths.APIBasePath;
const monitor=Path.APISubPaths.monitor

// function *getPowerReportList(action) {  // 请求报表列表
//   const { payload } = action;
//   const url =`${APIBasePath}${monitor.getPowerReportList}`;
//   // const url =`/mock/v3/wind/report/fan/gen`;

//   try{
//     yield put({
//       type:deviceAccountAction.changedeviceAccountStore,
//       payload: {
//         loading: true,
//       },
//     });  
//     const response = yield call(axios.post,url,{
//       ...payload,
//     });
//     if(response.data.code === '10000') {
//       const total = response.data.data.pageCount || 0;
//       let { pageNum, pageSize } = payload;
//       const maxPage = Math.ceil(total / pageSize);
//       if (total === 0) { // 总数为0时，展示0页
//         pageNum = 1;
//       } else if (maxPage < pageNum) { // 当前页已超出
//         pageNum = maxPage;
//       }
//       yield put({
//         type:deviceAccountAction.changedeviceAccountStore,
//         payload: {
//           total:response.data.data.pageCount||0,
//           loading:false,
//           ...payload,
//         },
//       });     
//     }else{
//       throw response.data
//     }  
//   }catch(e){
//     console.log(e);
//     yield put({
//       type:deviceAccountAction.changedeviceAccountStore,
//       payload: { ...payload, loading: false ,powerReportList:[]},
//     })
//   }
// }


export function* watchDeviceAccount() {
  // yield takeLatest(deviceAccountAction.getPowerReportList, getPowerReportList);
}