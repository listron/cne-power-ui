import React, { Component } from 'react';
import { Button, Icon } from 'antd';
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

  showChart = () => {
    console.log('chart show now ')
  }

  showList = () => {
    console.log('list now ')
  }

  render(){
    const { historyType } = this.props;
    return (
      <div className={styles.historyDataType}>
        <div className={styles.tabIcons}>
          <Icon onClick={this.showChart} type="bar-chart" className={historyType === 'chart'? styles.active : styles.normal} />
          <Icon onClick={this.showList} type="bars" className={historyType === 'list'? styles.active : styles.normal} />
        </div>
        {/* <Button>导出</Button> */}
      </div>
    )
  }
}

export default HistoryDataType;