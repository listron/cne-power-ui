import React from 'react';
import PowerProgress from './PowerProgress';
import styles from './deviceMonitorStatistics.scss';

function DeviceMonitorStatistics({deviceDetail}) {
  console.log(deviceDetail);
  //实施功率，装机容量=deviceDetail.devicePower,deviceCapacity
  const { devicePower, deviceCapacity } = deviceDetail;
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>图标</div>

      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerGen}>日发电量</div>
      <div className={styles.timerGen}>月发电量</div>
      <div className={styles.timerGen}>年发电量</div>
    </div>
  )
}

export default DeviceMonitorStatistics;