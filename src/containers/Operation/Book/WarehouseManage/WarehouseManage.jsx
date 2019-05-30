import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import { warehouseManageAction } from './warehouseManageReducer';
import styles from './warehouseManage.scss';

class WarehouseManage extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    sideKey: PropTypes.string,
    changStore: PropTypes.func,
    resetStore: PropTypes.func,
  }

  state = {
    sideTransform: 0,
  }
  
  componentDidMount(){

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
    this.props.changStore({ tabName: tabInfo[innerHTML] });
  }

  showSide = () => {
    this.setState({ sideTransform: 100 })
  }

  backList = () => {
    this.setState({ sideTransform: 0 })
  }
  
  render(){
    const { sideTransform } = this.state;
    const { tabName, sideKey } = this.props;
    // tabName: 'spares', // tab页控制 spares-备品, tools-工具, materials-物资
    // sideKey: 'list', // 抽屉页控制 list-主页面, insert-入, takeOut-出, reserve-库存
    return (
      <div className={styles.warehouseManage}>
        <CommonBreadcrumb  breadData={[{name: '库存管理'}]} style={{ marginLeft: '38px' }} />
        <div className={styles.manageContainer}>
          <div className={styles.listPage}>
            <div className={styles.tabs} onClick={this.tabChange}>
              <span className={tabName === 'spares' ? styles.active : styles.inactive}>备品备件</span>
              <span className={tabName === 'tools' ? styles.active : styles.inactive}>工具器</span>
              <span className={tabName === 'materials' ? styles.active : styles.inactive}>物资</span>
            </div>
            {/* <SparePage /> */}
            {/* <ToolPage /> */}
            {/* <MaterialPage /> */}
            {/* <div className={styles.listContent}>
              <h3>主内容页面</h3>
              {new Array(10).fill(10).map((e, i) => <p key={i}>测试内容</p>)}
              <button onClick={this.showSide}>主内容页面</button>
              <input />
            </div> */}
            <Footer />
          </div>
          <div className={styles.sidePage} style={{'transition': 'all 500ms ease', transform: `translateX(-${sideTransform}%)`}}>
            {/* <SpareInsert /> */}
            {/* <SpareTakeout /> */}
            {/* <SpareReserve /> */}
            {/* <ToolInsert /> */}
            {/* <ToolTakeout /> */}
            {/* <ToolReserve /> */}
            {/* <MaterialInsert /> */}
            {/* <MaterialTakeout /> */}
            {/* <MaterialReserve /> */}
            {/* <div className={styles.sideContent}>
              <h3>侧边栏</h3>
              {new Array(100).fill(10).map((e, i) => <p key={i}>测试内容</p>)}
              <button onClick={this.backList}>回到主页面</button>
              <input />
            </div> */}
            <Footer />
          </div>
        </div>
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
