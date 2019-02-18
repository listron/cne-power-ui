import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './historyStyle.scss';

class HistoryDataType extends Component {

  static propTypes = {
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceCodes: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    pointCodes: PropTypes.array, // 选中的测点
    timeSpace:  PropTypes.string,
    historyType:  PropTypes.string,
    

    changeHistoryStore: PropTypes.func,
    getHistory: PropTypes.func,
  };

  selectHistoryType = (historyType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const { changeHistoryStore } = this.props;
    changeHistoryStore({ historyType })
  }

  render(){
    return (
      <div className={styles.historyDataType}>
        <div>
          <span key="chart">chart</span>
          <span key="list">list</span>
        </div>
        <div>
          <h3>各设备测点历史数据趋势图</h3>
          <span>数据为瞬时值</span>
        </div>
        <Button>导出</Button>
      </div>
    )
  }
}

export default HistoryDataType;