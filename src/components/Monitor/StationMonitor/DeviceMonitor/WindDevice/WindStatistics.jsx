import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';

function InverterStatistics({ deviceDetail }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear,windSpeed,angleOfYaw } = deviceDetail;
  powerDay = isNaN(parseFloat(powerDay)) ? ' -- ': parseFloat(powerDay); 
  powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ': parseFloat(powerMonth); 
  powerYear = isNaN(parseFloat(powerYear)) ? ' -- ': parseFloat(powerYear); 
  powerYear = isNaN(parseFloat(windSpeed)) ? ' -- ': parseFloat(windSpeed); 
  powerYear = isNaN(parseFloat(angleOfYaw)) ? ' -- ': parseFloat(angleOfYaw); 
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-windlogo"></span>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{windSpeed}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>风速</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{angleOfYaw}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>偏航角度</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{powerDay}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>日发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{powerMonth}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>月累计发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{powerYear}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>年累计发电量 万kWh</div>
      </div>
    </div>
  )
}

export default InverterStatistics;