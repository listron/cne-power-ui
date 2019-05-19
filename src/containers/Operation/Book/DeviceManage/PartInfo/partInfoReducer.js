import Immutable from 'immutable';

import { partInfoAction } from './partInfoAction';

const initState = Immutable.fromJS({
 
  allStationBaseInfo:[],
  loading: false,
  stationCode: null, // 选中的电站
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  pageNum: 1,
  pageSize: 10,
  totalNum:  0, // 设备总数
  sortField: '', // 排序字段
  sortMethod: '', // 排序方式('0':正序,'1': 倒序)
  showPage:'list',
  deviceTypeList: [], // 设备类型列表
  deviceComList: [], // 设备下组件列表
  detailPartInfo:{},//组件详情
 
});

const partInfoReducer = (state = initState, action) => {
  switch (action.type) {
    case partInfoAction.changePartInfoStore:
      return state.merge(Immutable.fromJS(action.payload))
    case partInfoAction.resetPartInfoStore:
      return initState
  }
  return state;
}

export default partInfoReducer;