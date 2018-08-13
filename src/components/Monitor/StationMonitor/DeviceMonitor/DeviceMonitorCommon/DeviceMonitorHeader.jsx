import React, { Component } from 'react';
import styles from './deviceMonitorStatistics.scss';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class DeviceMonitorHeader extends Component {

  static propTypes = {
    deviceAlarmList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      pageSize: 10, 
      currentPage: 1,
      sortedInfo: {
        columnKey: 'warningLevel',
        order: 'ascend',
      }
    }
  }

  render() {
    return (
      <div className={styles.alarmTable} >
        头部啊！
      </div>
    )
  }
  
}

export default DeviceMonitorHeader;