import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './table';
import moment from 'moment';

class DeviceStatus extends Component {
  static propTypes = {
    getDeviceStatusList: PropTypes.func,
    changeDeviceStatusStore: PropTypes.func,
  }

  onTimeChange = (value) => {
    console.log(value)

  }
  onModechange = (value) => {
    console.log(value)
  }


  render() {
    return (
      <div style={{ width: '100%' }}>
        <TimeSelectReport onChange={this.onTimeChange} />
        <SummaryMode onChange={this.onModechange} showFault={false} {...this.props} />
        <TableList {...this.props} />
      </div>
    )
  }
}

export default DeviceStatus;