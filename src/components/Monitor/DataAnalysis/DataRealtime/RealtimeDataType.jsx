import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './realtimeStyle.scss';
import path from '../../../../constants/path';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class RealtimeDataType extends Component {

  static propTypes = {
    realtimeType:  PropTypes.string,
    queryParam: PropTypes.object,
    changeRealtimeStore: PropTypes.func,
    downLoadFile: PropTypes.func,
  };

  selectRealtimeType = (realtimeType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const { changeRealtimeStore } = this.props;
    changeRealtimeStore({ realtimeType })
  }

  showChart = () => {
    this.selectRealtimeType('chart');
  }

  showList = () => {
    this.selectRealtimeType('list');
  }

  exportRealtime = () => { // '导出实时数据excel'
    const { downLoadFile, queryParam } = this.props;
    const url = `${APIBasePath}${monitor.exportRealtime}`;
    downLoadFile({ // 
      url,
      fileName: '实时数据',
      params: queryParam,
    })
  }

  render(){
    const { realtimeType } = this.props;
    return (
      <div className={styles.realtimeDataType}>
        <div className={styles.tabIcons}>
          <Icon onClick={this.showChart} type="bar-chart" className={realtimeType === 'chart'? styles.active : styles.normal} />
          <Icon onClick={this.showList} type="bars" className={realtimeType === 'list'? styles.active : styles.normal} />
        </div>
        {realtimeType === 'list' && <Button className={styles.export} onClick={this.exportRealtime}>导出</Button>}
      </div>
    )
  }
}

export default RealtimeDataType;