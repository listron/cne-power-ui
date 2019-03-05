import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './historyStyle.scss';
import path from '../../../../constants/path';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

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
    queryParam: PropTypes.object,
    partHistory: PropTypes.object,

    changeHistoryStore: PropTypes.func,
    getHistory: PropTypes.func,
    downLoadFile: PropTypes.func,
  };

  selectHistoryType = (historyType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const { changeHistoryStore } = this.props;
    changeHistoryStore({ historyType })
  }

  showChart = () => {
    this.selectHistoryType('chart');
  }

  showList = () => {
    this.selectHistoryType('list');
  }

  exportHistory = () => { // '导出历史数据excel'
    const { downLoadFile, queryParam } = this.props;
    const url = `${APIBasePath}${monitor.exportHistory}`;
    let { startTime, endTime } = queryParam;
    startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
    endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
    downLoadFile({ // 
      url,
      fileName: `${startTime}至${endTime}历史数据`,
      params: {
        ...queryParam,
        startTime,
        endTime,
      },
    })
  }

  render(){
    const { historyType, partHistory = {} } = this.props;
    const { dataList = [] } = partHistory;
    return (
      <div className={styles.historyDataType}>
        <div className={styles.tabIcons}>
          <Icon onClick={this.showChart} type="bar-chart" className={historyType === 'chart'? styles.active : styles.normal} />
          <Icon onClick={this.showList} type="bars" className={historyType === 'list'? styles.active : styles.normal} />
        </div>
        {historyType === 'list' && <Button
          className={styles.export}
          onClick={this.exportHistory}
          disabled={dataList.length === 0}
        >导出</Button>}
      </div>
    )
  }
}

export default HistoryDataType;