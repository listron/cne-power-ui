import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

/* 
表格通用顶部配置 => 两行展示，文字居上，单位居下。
1. title(string) - 必填 - 表头列标题文字
2. unit(string) - 选填 - 单位
3. className(string) - 选填 - 手动控制外部整体样式
*/

class TableColumnTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    const { title, unit = '', className = '' } = this.props;
    return (
      <div className={`${styles.tableCommonTitle} ${className}`}>
        <div className={styles.text}>{title}</div>
        <div className={styles.unit}>{unit ? `(${unit})` : ''}</div>
      </div>
    )
  }
}
export default TableColumnTitle




