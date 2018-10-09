import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { message } from 'antd';
import { dayReportAction } from './dayReportAction';


function *toChangeDayReportStore(action){ // 存储payload指定参数，替换reducer-store属性。
  const { payload } = action;
  yield put({
    type:  dayReportAction.changeDayReportStore,
    payload,
  })
}

function *getDayReportList(action){//请求日报基本列表数据
  const { payload } = action;
  // const url = '/mock/system/departmentList';
  const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.system.getDayReportList}`
  try{
    yield put({ type:dayReportAction.dayReportLoading });
    const response = yield call(axios.post,url,payload);

    const totalNum = response.data.data.totalNum || 0;
    let { pageNum, pageSize } = payload;
    const maxPage = Math.ceil(totalNum / pageSize);
    if(totalNum === 0){ // 总数为0时，展示0页
      pageNum = 0;
    }else if(maxPage < pageNum){ // 当前页已超出
      pageNum = maxPage;
    }

    yield put({
      type:  dayReportAction.dayReportFetchSuccess,
      payload:{
        ...payload,
        departmentData: response.data.data.context || [],
        totalNum,
        pageNum,
        buttonLoading: false
      },
    });
  }catch(e){
    console.log(e);
  }
}


export function* watchDayReport() {
  yield takeLatest(dayReportAction.toChangeDayReportStore, toChangeDayReportStore);
  yield takeLatest(dayReportAction.getDayReportList, getDayReportList);
}

