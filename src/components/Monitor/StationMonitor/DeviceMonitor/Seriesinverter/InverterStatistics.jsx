import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from './seriesinverter.scss';

function InverterStatistics({ deviceDetail }) {
  
  const { devicePower, deviceCapacity, powerDay, powerMonth, powerYear } = deviceDetail;
  const showDayPower = parseFloat(powerDay) >= 0 ? powerDay: ' -- ';
  const showMonthPower = parseFloat(powerMonth) >= 0 ? powerDay: ' -- ';
  const showYearPower = parseFloat(powerYear) >= 0 ? powerDay: ' -- ';
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span>图标</span>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{showDayPower}</div>
        <div className={styles.genText}>日发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{showMonthPower}</div>
        <div className={styles.genText}>月发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{showYearPower}</div>
        <div className={styles.genText}>日发电量 万kWh</div>
      </div>
    </div>
  )
}

export default InverterStatistics;