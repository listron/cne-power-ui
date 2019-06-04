import Immutable from 'immutable';
import { deviceAccountAction } from './deviceAccountAction';

const initState = Immutable.fromJS({
  loading: false,
  pageSize: 10,
  pageNum: 1,
  regionName: "", // 电站区域
  stationCodes: [], // 电站
  manufactorId: "", // 厂家
  modeId: "", // 设备编号
  deviceTypeCode: "", //设备类型
  assetIds: [], // 资产
  orderField: "",
  orderMethod: "",
  attachmentsList: {}, // 台账备件列表
  modeIdDetails: "", // 详情里面的字段
  assetsIdDetails: "", // 详情里面的字段
  orderFieldDetails: "", // 详情里面的字段
  orderMethodDetails: "", // 详情里面的字段
  pageNumDetails: 1,
  pageSizeDetails: 10,
  deviceAccountListLoading: false, // 设备台账列表loading
  deviceAccountList: {}, // 设备台账列表
  regionList: [], // 获取用户权限的电站区域
  stationsManufactorsList: [], // 获取电站下的厂家列表
  deviceModeList: [{// 获取厂家下的设备型号列表
    modeDatas: [{
      modeId:"",
      modeName: ""
    }]
  }],
});
const deviceAccountReducer = (state = initState, action) => {
  switch (action.type) {
    case deviceAccountAction.changeDeviceAccountStore:
      return state.merge(Immutable.fromJS(action.payload));
    case deviceAccountAction.deviceAccountFetchSuccess:
      return state.merge(Immutable.fromJS(action.payload));
    case deviceAccountAction.resetStore:
      return initState
  }
  return state;
};
export default deviceAccountReducer;
