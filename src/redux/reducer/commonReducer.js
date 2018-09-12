import Immutable from 'immutable';

import { commonAction } from '../../constants/actionTypes/commonAction';

var initState = Immutable.fromJS({
  topMenu:{
    name: '实时监控',
    path: '/monitor',
    children: [
      {
        name: '电站监控',
        iconStyle: 'home',
        path: '/monitor/station',
        defaultPath: true,
      },{
        name: '告警',
        iconStyle: 'exclamation-circle',
        path: '/monitor/alarm',
        children: [
          {
            name: '实时告警',
            path: '/monitor/alarm/realtime',
          },{
            name: '历史告警',
            path: '/monitor/alarm/history',
          },{
            name: '告警统计',
            path: '/monitor/alarm/statistic',
          }
        ],
      }
    ]
  },
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