import Immutable from 'immutable';

import { partInfoAction } from './partInfoAction';

const initState = Immutable.fromJS({
  type: '',
  partsId:'',
  deviceCode:'',
  deviceName:'',
  manufactorId:null,//厂家Id
  allStationBaseInfo:[],
  detailPartsRecord:{},//编辑前的默认值
  loading: false,
  stationCode: '', // 选中的电站
  stationName:'',//电站名
  deviceTypeCode: null, // 选中的设备类型
  deviceModeCode: null, // 选中的设备型号
  orderField: '', // 排序字段
  orderMethod: '', // 排序方式('0':正序,'1': 倒序)
  showPage:'list',
  deviceTypeList: [], // 设备类型列表
  deviceComList: [], // 设备下组件列表
  detailPartInfo:{},//组件详情
  assetList:[],//生产资产树
  partsFactorsList:[],//组件厂家列表
  factorsPartsMode:[],//厂家下型号列表
  collectorDevices:[],//集电线路数据
  boostDevices:[],//升压数据
  undefinedDevices:[],//未分组数据数据
  partInfoTree:[],//复制组件中的树
  addmanufactorId:'',//新增的厂家Id
  addmodeId:'',//新增设备型号
 
 
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