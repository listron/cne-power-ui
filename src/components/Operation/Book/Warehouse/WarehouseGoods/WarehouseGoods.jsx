import React, { Component } from "react";
import styles from "./warehouseGoods.scss";
import PropTypes from 'prop-types';

export default class WarehouseGoods extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
  };

  render() {
    return (
      <div className={styles.warehouseGoods}>
        物品
      </div>
    )
  }
}
