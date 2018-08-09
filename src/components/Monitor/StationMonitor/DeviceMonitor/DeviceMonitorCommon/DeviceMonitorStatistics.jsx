import React from 'react';
import PowerProgress from './PowerProgress';
import styles from './deviceMonitorStatistics.scss';

function DeviceMonitorStatistics({ deviceDetail }) {
  
  const { devicePower, deviceCapacity, powerDay, powerMonth, powerYear } = deviceDetail;

  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>图标</div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{powerDay}</div>
        <div className={styles.genText}>日发电量</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{powerMonth}</div>
        <div className={styles.genText}>月发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{powerYear}</div>
        <div className={styles.genText}>日发电量 万kWh</div>
      </div>
    </div>
  )
}

export default DeviceMonitorStatistics;