import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';

function InverterStatistics({ deviceDetail }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear,windSpeed,angleOfYaw } = deviceDetail;
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-windlogo"></span>
        <p className={styles.deviceCode}>{deviceDetail.deviceCode}</p>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{(windSpeed || windSpeed===0 )? +windSpeed:'--' }</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>风速</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{(angleOfYaw || angleOfYaw===0 )? +angleOfYaw:'--'}°</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>风向</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{(powerDay || powerDay===0 )? parseFloat(powerDay).toFixed(4):'--'}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>日发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{(powerMonth || powerMonth===0 )? parseFloat(powerMonth).toFixed(4):'--'}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>月累计发电量 万kWh</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{(powerYear || powerYear===0 )? parseFloat(powerYear).toFixed(4):'--'}</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>年累计发电量 万kWh</div>
      </div>
    </div>
  )
}

export default InverterStatistics;