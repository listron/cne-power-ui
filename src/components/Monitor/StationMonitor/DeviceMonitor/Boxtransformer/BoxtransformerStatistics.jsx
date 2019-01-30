import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';

function BoxtransformerStatistics({ deviceDetail }) {
  
  const { devicePower, deviceCapacity,} = deviceDetail;
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-xb"></span>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
    </div>
  )
}

export default BoxtransformerStatistics;