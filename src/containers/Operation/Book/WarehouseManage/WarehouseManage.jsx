import React, { Component } from 'react';
import { connect } from 'react-redux';
import { warehouseManageAction } from './warehouseManageReducer';

class WarehouseManage extends Component {
  
  componentDidMount(){

  }
  
  render(){
    return (
      <div>
        仓库管理
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.warehouseManage.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: warehouseManageAction.resetStore }),
  changStore: payload => dispatch({ type: warehouseManageAction.changStore, payload }),
//   // getWarehouseList: payload => dispatch({ type: warehouseAction.getWarehouseList, payload }),
//   // getWarehouseAddList: payload => dispatch({ type: warehouseAction.getWarehouseAddList, payload }),
//   // getWarehouseDelList: payload => dispatch({ type: warehouseAction.getWarehouseDelList, payload }),
//   // getWarehouseUpdateList: payload => dispatch({ type: warehouseAction.getWarehouseUpdateList, payload }),
//   // getGoodsList: payload => dispatch({ type: warehouseAction.getGoodsList, payload }),
//   // getGoodsAddList: payload => dispatch({ type: warehouseAction.getGoodsAddList, payload }),
//   // getGoodsDelList: payload => dispatch({ type: warehouseAction.getGoodsDelList, payload }),
//   // getGoodsUpdateList: payload => dispatch({ type: warehouseAction.getGoodsUpdateList, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseManage);
