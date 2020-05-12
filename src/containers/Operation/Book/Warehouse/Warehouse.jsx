import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WarehouseGoods from '../../../../components/Operation/Book/Warehouse/WarehouseGoods/WarehouseGoods';
import WarehouseWrap from '../../../../components/Operation/Book/Warehouse/WarehouseWrap/WarehouseWrap';
import { warehouseAction } from './warehouseAction.js';
import Footer from '../../../../components/Common/Footer';

import styles from './warehouse.scss';

class Warehouse extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 1, // 类型：仓库/物品
    };
  }

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
  }

  // 仓库
  warehouseFunc = () => {
    this.setState({
      type: 1,
    });
  };

  // 仓库
  goodsFunc = () => {
    this.setState({
      type: 2,
    });
  };

  render() {
    const { type } = this.state;
    return (
      <div className={styles.warehouseWrap}>
        <div className={styles.warehouseCenter}>
          <div className={styles.warehouseBox}>
            <div className={styles.warehouseDiv}>
              <div className={styles.warehouseTabs}>
                <p
                  onClick={() => { return this.warehouseFunc(); }}
                  className={type === 1 ? styles.checkBtn : styles.unCheckBtn}
                >
                  仓库
                </p>
                <p
                  onClick={() => { return this.goodsFunc(); }}
                  className={type === 2 ? styles.checkBtn : styles.unCheckBtn}
                >
                  物品
                </p>
              </div>
              {type === 1 ? <WarehouseWrap {...this.props} /> : <WarehouseGoods {...this.props} />}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.operation.warehouse.toJS(),
    stations: state.common.get('stations'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: warehouseAction.resetStore }),
  getWarehouseList: payload => dispatch({ type: warehouseAction.getWarehouseList, payload }),
  getWarehouseAddList: payload => dispatch({ type: warehouseAction.getWarehouseAddList, payload }),
  getWarehouseDelList: payload => dispatch({ type: warehouseAction.getWarehouseDelList, payload }),
  getWarehouseUpdateList: payload => dispatch({ type: warehouseAction.getWarehouseUpdateList, payload }),
  getGoodsList: payload => dispatch({ type: warehouseAction.getGoodsList, payload }),
  getGoodsAddList: payload => dispatch({ type: warehouseAction.getGoodsAddList, payload }),
  getGoodsDelList: payload => dispatch({ type: warehouseAction.getGoodsDelList, payload }),
  getGoodsUpdateList: payload => dispatch({ type: warehouseAction.getGoodsUpdateList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
