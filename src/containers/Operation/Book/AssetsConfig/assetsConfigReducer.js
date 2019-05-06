import Immutable from 'immutable';
import { assetConfigAction } from './assetsConfigAction';
import moment from 'moment';

var initState = Immutable.fromJS({
  loading: false,
  selectType:'assetStructure',//'assetStructure'资产结构，'deviceFactory'设备厂家，'deviceMode'设备型号
  assetType:'pv',//用户权限类型，pv是光，wind风,multiple是两种都有
  assetList: [],

  
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