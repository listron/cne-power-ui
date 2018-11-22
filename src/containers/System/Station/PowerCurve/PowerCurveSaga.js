import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import Path from '../../../../constants/path';
import { powerCurveAction } from './PowerCurveAction';

function *changePowerCurveStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  powerCurveAction.changePowerCurveStore,
    payload,
  })
}

function *resetStore(){
  yield put({
    type:  powerCurveAction.resetStore
  })
}


// getPowercurveList: '/v3/management/powercurve', // 功率曲线列表
// getPowercurveDetail: '/v3/management/powercurve/detai', // 功率曲线详情图
// importPowercurve: '/v3/management/powercurve/import', //导入功率曲线
// downloadPowercurve: '/api/v3/management/powercurve/export', // 导出功率曲线

function *getPowerList(action){ // 请求功率曲线列表
  const { payload } = action;
  // const url = '/mock/system/alarmManage/alarmList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getPowercurveList}`
  try{
    yield put({ type: powerCurveAction.powerCurveFetch });
    const response = yield call(axios.post,url,{
      ...payload,
      sortField: payload.sortField.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`), //重组字符串
    });

    const totalNum = response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 1;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }
    yield put({
      type:  powerCurveAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      payload:{
        ...payload,
        alarmList: response.data.data || [],
        totalNum: response.data.data && response.data.data[0] && response.data.data[0].totalCount || 0,
        pageNum,
      },
    });
  }catch(e){
    console.log(e);
    yield put({
      type:  alarmManageAction.CHANGE_ALARM_MANAGE_STORE,
      payload: { ...payload, loading: false },
    })
  }
}


// function *downloadAlarmExcel(action){ // 导出告警时间
//   const { payload } = action;
//   try{
//     const { stationCode, stationName } = payload;
//     const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.downloadAlarmInfo}/${stationCode}`
//     const response = yield call(axios, {
//       method: 'get',
//       url,
//       responseType:'blob'
//     });
//     if(response.data) {
//       const content = response.data;
//       const blob = new Blob([content]);
//       const fileName = `${stationName}告警事件信息表.xlsx`;
//       if ('download' in document.createElement('a')) { // 非IE下载
//         const elink = document.createElement('a');
//         elink.download = fileName;
//         elink.style.display = 'none';
//         elink.href = URL.createObjectURL(blob);
//         document.body.appendChild(elink);
//         elink.click();
//         URL.revokeObjectURL(elink.href); // 释放URL 对象
//         document.body.removeChild(elink);
//       } else { // IE10+下载
//         navigator.msSaveBlob(blob, fileName);
//       }   
//     }
//   }catch(e){
//     console.log(e);
//     message.error(`导出告警事件失败!${e}`)
//   }
// }

export function* watchAlarmManage() {
  yield takeLatest(powerCurveAction.changePowerCurveStoreSaga, changePowerCurveStore);
  yield takeLatest(powerCurveAction.resetStore, resetStore);
  yield takeLatest(powerCurveAction.getPowerList, getPowerList);
}

