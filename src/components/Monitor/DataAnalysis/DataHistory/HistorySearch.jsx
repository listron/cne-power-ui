import React, { Component } from 'react';
import styles from './dataHistory.scss';

class HistorySearch extends Component {
  render(){
    return (
      <div className={styles.historySearch}>
        <span>选择电站</span>
        <span>设备类型</span>
        <span>选择设备</span>
        <span>时间选择</span>
        <span>数据时间间隔</span>
      </div>
    )
  }
}

export default HistorySearch;