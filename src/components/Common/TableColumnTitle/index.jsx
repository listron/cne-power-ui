import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

/* 
表格通用顶部配置 => 两行展示，文字居上，单位居下。
1. title(string) - 必填 - 表头列标题文字
2. unit(string) - 选填 - 单位
3. className(string) - 选填 - 手动控制外部整体样式
4. style(object) - 选填 -手动控制部分样式
*/

class TableColumnTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    const { title, unit = '', className = '', style = {} } = this.props;
    return (
      <div className={`${styles.tableCommonTitle} ${className}`} style={{...style}}>
        <div className={styles.text} title={title}>{title}</div>
        <div className={styles.unit}>{unit ? `(${unit})` : ''}</div>
      </div>
    )
  }
}
export default TableColumnTitle




