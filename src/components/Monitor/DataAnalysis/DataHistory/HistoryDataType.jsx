import React, { Component } from 'react';
import styles from './historyStyle.scss';

class HistoryDataType extends Component {
  render(){
    return (
      <div className={styles.historyDataType}>
        <div>
          <span>这个是chart</span>
          <span>展示列表</span>
        </div>
        <div>展示标题</div>
        <div>导出</div>
      </div>
    )
  }
}

export default HistoryDataType;