import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './historyStyle.scss';
import PropTypes from 'prop-types';

class HistoryList extends Component {
  static propTypes = {
    // stations: PropTypes.array,
  }

  render() {
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
      }, {
        title: '设备类型',
        dataIndex: 'deviceType',
      }, {
        title: '型号',
        dataIndex: 'deviceTypeModel',
      }, {
        title: '时间',
        dataIndex: 'time',
      }, {
        title: '测点1',
        dataIndex: 'point1',
      }, {
        title: '测点2',
        dataIndex: 'point2',
      }, {
        title: '测点3',
        dataIndex: 'point3',
      }, {
        title: '测点4',
        dataIndex: 'point4',
      }
    ];
    const dataSource = [];
    return (
      <div className={styles.historyList}>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    )
  }
}

export default HistoryList;