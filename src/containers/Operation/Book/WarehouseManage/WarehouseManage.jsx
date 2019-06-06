import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SparePage from '../../../../components/Operation/Book/WarehouseManage/SparePage';
import SpareInsert from '../../../../components/Operation/Book/WarehouseManage/SpareInsert';
import SpareTakeout from '../../../../components/Operation/Book/WarehouseManage/SpareTakeout';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import { warehouseManageAction } from './warehouseManageReducer';
import { commonAction } from '../../../alphaRedux/commonAction';
import styles from './warehouseManage.scss';

class WarehouseManage extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    sideKey: PropTypes.string,
    tableParams: PropTypes.object,
    getWarehouses: PropTypes.func,
    getManufactures: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
    changeStore: PropTypes.func,
    resetStore: PropTypes.func,
  }

  state = {
    sideTransform: 0,
  }
  
  componentDidMount(){
    const { tableParams } = this.props;
    this.props.getWarehouses();
    this.props.getManufactures();
    this.props.getWarehouseManageList({ ...tableParams })
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  sideTransformChange = (sideTransform) => {
    this.setState({ sideTransform });
  }

  tabChange = (e) => {
    const { innerHTML } = e.target;
    const tabInfo = {
      '备品备件': 'spares',
      '工具器': 'tools',
      '物资': 'materials',
    };
    this.props.changeStore({ tabName: tabInfo[innerHTML] });
  }

  showSide = (sideKey) => {
    this.setState({ sideTransform: 100 });
    this.props.changeStore({ sideKey });
  }

  backList = () => {
    this.setState({ sideTransform: 0 });
    this.props.changeStore({ sideKey: 'list' });
  }
  
  render(){
    const { sideTransform } = this.state;
    const { tabName, sideKey } = this.props;
    // tabName: 'spares', // tab页控制 spares-备品, tools-工具, materials-物资
    // sideKey: 'list', // 抽屉页控制 list-主页面, insert-入, takeout-出, reserve-库存
    return (
      <div className={styles.warehouseManage}>
        <CommonBreadcrumb  breadData={[{name: '库存管理'}]} style={{ marginLeft: '38px' }} />
        <div className={styles.manageContainer}>
          <div className={styles.listPage}>
            <div className={styles.listContent}>
              <div className={styles.tabs} onClick={this.tabChange}>
                <span className={tabName === 'spares' ? styles.active : styles.inactive}>备品备件</span>
                <span className={tabName === 'tools' ? styles.active : styles.inactive}>工具器</span>
                <span className={tabName === 'materials' ? styles.active : styles.inactive}>物资</span>
              </div>
              <SparePage {...this.props} showSide={this.showSide} />
            </div>
            
            {/* <ToolPage /> */}
            {/* <MaterialPage /> */}
            <Footer />
          </div>
          <div className={styles.sidePage} style={{'transition': 'all 500ms ease', transform: `translateX(-${sideTransform}%)`}}>
            {sideKey === 'insert' && <SpareInsert {...this.props} backList={this.backList} />}
            {sideKey === 'takeout' && <SpareTakeout {...this.props} backList={this.backList} />}
            {/* <SpareReserve /> */}
            {/* <ToolInsert /> */}
            {/* <ToolTakeout /> */}
            {/* <ToolReserve /> */}
            {/* <MaterialInsert /> */}
            {/* <MaterialTakeout /> */}
            {/* <MaterialReserve /> */}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.warehouseManage.toJS(),
  stations: state.common.get('stations').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: warehouseManageAction.resetStore }),
  changeStore: payload => dispatch({ type: warehouseManageAction.changeStore, payload }),
  getWarehouses: () => dispatch({ type: warehouseManageAction.getWarehouses }),
  getManufactures: () => dispatch({ type: warehouseManageAction.getManufactures }),
  getModes: payload => dispatch({ type: warehouseManageAction.getModes, payload }),
  getWarehouseManageList: payload => dispatch({ type: warehouseManageAction.getWarehouseManageList, payload }),
  deleteWarehouseMaterial: payload => dispatch({ type: warehouseManageAction.deleteWarehouseMaterial, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: warehouseManageAction.changeStore
    }
  }),
  setStockMax: payload => dispatch({ type: warehouseManageAction.setStockMax, payload }),
  importStockFile: payload => dispatch({ type: warehouseManageAction.importStockFile, payload }),
  getGoodsList: payload => dispatch({ type: warehouseManageAction.getGoodsList, payload }),
  addNewGood: payload => dispatch({ type: warehouseManageAction.addNewGood, payload }),
  getAssetslist: payload => dispatch({ type: warehouseManageAction.getAssetslist, payload }),
  insertWarehouse: payload => dispatch({ type: warehouseManageAction.insertWarehouse, payload }),
  getMaterialDetailsList: payload => dispatch({ type: warehouseManageAction.getMaterialDetailsList, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseManage);
