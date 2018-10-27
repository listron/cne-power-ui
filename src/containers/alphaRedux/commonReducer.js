import Immutable from 'immutable';

import { commonAction } from './commonAction';

var initState = Immutable.fromJS({
  enterpriseId:'',
  enterpriseName: '',
  loading: false,
  stations: [], // 所有电站
  deviceTypes: [], // 设备类型
  deviceModels: [], // 设备型号
  devicePoints: [], // 设备测点
  stationDeviceTypes: [],//电站下的设备
  devices: [],
  partitions: [],
  allDepartmentData: [], // 企业下所有部门(含层级关系)
  allSeries:[],//所有光伏组件
  firstPartitionCode:'',//光伏组件截取的第一项code
  deviceExistInfo: {}, // 验证设备是否存在
  lostGenTypes: [], // 所有故障类型
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