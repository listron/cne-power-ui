import Immutable from 'immutable';
import { assetConfigAction } from './assetsConfigAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  loading: false,
  selectType:'assetStructure',//'assetStructure'资产结构，'deviceFactory'设备厂家，'deviceMode'设备型号
  assetType:1,//用户权限类型，1是光，0风,multiple是两种都有
  stationType:1,//电站类型1是光，0风,
  assetsParentId:'0',//上一级父节点，默认是最顶级0
  assetList: [],//树列表
  isBuild:null,
  childrenNodeDetail:[],//子节点详情
  assetsName:'',//生产资产节点名称
  assetsType:null,//分类(1：系统，2：设备，3：部件)
  assetsUnit:'',//计量单位
  nowTime:'',//当前时间（utc）
  assetsId:'',//节点Id
  childrenNum:'',//当前节点的子节点数
  manufactorName:'',//设备厂家名称(模糊查询)
  orderField:'',//排序字段（1：编码，2：设备厂家，3：创建时间，4：操作人）
  orderMethod:'',//排序方式（“asc”：升序，”desc“:降序）
  pageNum:1,//页码
  pageSize:10,//每页记录数
  deviceModeName:'',//设备型号名称(模糊查询)
  deviceFactorsList:[],//设备厂家列表信息
  deviceModesList:[],//设备型号列表



  
});
const assetsConfigReducer = (state = initState, action) => {
  switch (action.type) {
    case assetConfigAction.changeAssetConfigStore:
      return state.merge(Immutable.fromJS(action.payload))
    case assetConfigAction.resetAssetConfigStore:
      return initState
  }
  return state;
}
export default assetsConfigReducer;