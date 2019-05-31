
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './manageCommon.scss';

export const EnterWarehouse = ({ showSide, checkedStocks }) => {
  const toInsert = () => showSide({ sideKey: 'insert' });
  return (
    <button className={styles.enterWarehouse} onClick={toInsert} disabled={checkedStocks.length > 1}>
      <Icon type="plus" className={styles.plus} />
      <span className={styles.text}>入库</span>
    </button>
  )
}

EnterWarehouse.propTypes = {
  checkedStocks: PropTypes.array,
  showSide: PropTypes.func,
}

