import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Path from '../../../../constants/path';
import { personnelGpsAction } from './personnelGpsAction';


function* changePersonnelGpsStore(action) {//存储payload指定参数，替换reducer-store属性。
  const { payload } = action;

  yield put({
    type: personnelGpsAction.CHANGE_PERSONNELGPS_STORE,
    payload
  })
}
function* getPersonnelGpsData(action) {//综合指标年月判断
  const { payload } = action;
   const url= `${Path.basePaths.APIBasePath}${Path.APISubPaths.ticket.getPersonnelGpsData}`
    try{
      yield put({ type:personnelGpsAction.PERSONNELGPS_FETCH });
      const response = yield call(axios.get,url);
      if(response.data.code === '10000') {
        yield put({
          type: personnelGpsAction.GET_PERSONNELGPS_FETCH_SUCCESS,
          payload: {
            personnelGpsData: response.data.data||[],          
          },
        });     
      }  
    }catch(e){
      console.log(e);
    }
}



export function* watchPersonnelGps() {
  yield takeLatest(personnelGpsAction.CHANGE_PERSONNELGPS_STORE_SAGA, changePersonnelGpsStore);
  yield takeLatest(personnelGpsAction.getPersonnelGpsData, getPersonnelGpsData);
  
  

}