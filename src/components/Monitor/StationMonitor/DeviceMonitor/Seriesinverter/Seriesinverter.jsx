import React, { Component } from 'react';
import { Button } from 'antd';
import DeviceMonitorStatistics from '../DeviceMonitorCommon/DeviceMonitorStatistics';
import InverterTenMin from './InverterTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import DeviceMonitorHeader from '../DeviceMonitorCommon/DeviceMonitorHeader';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './seriesinverter.scss';

class Seriesinverter extends Component {
  static propTypes = {
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    deviceDetail: PropTypes.object,
    deviceTenMin: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode,stationCode } = this.props.match.params;
    console.log('did mount')
    this.props.getMonitorDeviceData({
      stationCode,
      deviceCode,
      deviceTypeCode
    })
  }

  componentWillUnmount(){
    console.log('unmount')
  }

  render(){
    const { deviceDetail, deviceTenMin, deviceAlarmList, devicePointData } = this.props;
    return (
      <div className={styles.seriesinverter}>
        <DeviceMonitorHeader deviceDetail={deviceDetail} />
        <DeviceMonitorStatistics deviceDetail={deviceDetail} />
        <InverterTenMin deviceTenMin={deviceTenMin} />
        <DeviceAlarmTable deviceAlarmList={deviceAlarmList} />
        <DevicePointsData devicePointData={devicePointData} />
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">走我们从逆变器去气象站</Link>
        </Button>
        <Button>
          <Link to={`/hidden/monitorDevice/73/206/${parseInt(Math.random*10000)}`}>测试路径变化导致的</Link>
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

