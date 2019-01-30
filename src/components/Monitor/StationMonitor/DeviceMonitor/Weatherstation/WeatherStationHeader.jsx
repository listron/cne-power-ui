import React from 'react';
import { deviceStatusArray } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';

const WeatherStationHeader = ({ deviceDetail }) => {
  const { deviceStatus } = deviceDetail;
  const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
  return (
    <div className={styles.deviceMonitorHeader} >
      <div className={styles.deviceName}>
        <span className={styles.weatherStationName}>{deviceDetail.deviceName}</span>
        <span className={styles.status} >
          <span>设备状态:</span> 
          <span className={deviceStatusInfo && `${deviceStatusInfo.icon} statusIcon` || ''}></span>
          <span>{ deviceStatusInfo && deviceStatusInfo.statusName || ' '}</span>
        </span>
      </div>
    </div>
  )
}

export default WeatherStationHeader;