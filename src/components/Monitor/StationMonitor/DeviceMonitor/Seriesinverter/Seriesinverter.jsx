import React, { Component } from 'react';
import { Button } from 'antd';
import DeviceMonitorStatistics from '../DeviceMonitorCommon/DeviceMonitorStatistics';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './seriesinverter.scss';

class Seriesinverter extends Component {
  static propTypes = {
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    deviceDetail: PropTypes.object
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode,stationCode } = this.props.match.params
    this.props.getMonitorDeviceData({
      stationCode,
      deviceCode,
      deviceTypeCode
    })
  }

  render(){
    const { deviceDetail } = this.props;
    return (
      <div className={styles.seriesinverter}>
        <h1>这是组串式逆变器展示页</h1>
        <DeviceMonitorStatistics deviceDetail={deviceDetail} />
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">走我们从逆变器去气象站</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/202/112233445566">走我们从逆变器去汇流箱</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/304/112233445566">走我们从逆变器去箱变</Link>
        </Button>
      </div>
    ) 
  }
}

export default Seriesinverter;

