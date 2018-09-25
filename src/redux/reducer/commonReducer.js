import Immutable from 'immutable';

import { commonAction } from '../../constants/actionTypes/commonAction';

var initState = Immutable.fromJS({
  enterpriseId:'',
  enterpriseName: '',
  loading: false,
  stations: [], // 所有电站
  deviceTypes: [], // 设备类型
  deviceModels: [], // 设备型号
  devicePoints: [], // 设备测点
  stationDeviceTypes: [],
  devices: [],
  partitions: [],
  allDepartmentData: [], // 企业下所有部门(含层级关系)
});

const defectReducer = (state = initState, action) => {
  switch (action.type) {
    case commonAction.COMMON_FETCH:
      return state.set('loading', true)
    case commonAction.CHANGE_COMMON_STORE: 
      return state.merge(Immutable.fromJS(action.payload))
    case commonAction.GET_COMMON_FETCH_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload)).set('loading',false)
  }
  return state;
}


export default defectReducer;