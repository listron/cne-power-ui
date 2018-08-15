import React from 'react';
import styles from '../eachDeviceMonitor.scss';

function WeatherStationStatistics({ deviceDetail }) {
  
  const { windSpeed, temp, humidity, batteryTemp, instantaneous, sunshine, windDirect } = deviceDetail;
  // const 
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span>气象站图标</span>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{windSpeed}</div>
        <div className={styles.genText}>风速 m/s</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{temp}</div>
        <div className={styles.genText}>环境温度 ℃</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{humidity}</div>
        <div className={styles.genText}>湿度g/m³</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{batteryTemp}</div>
        <div className={styles.genText}>电池板温度 ℃</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{instantaneous}</div>
        <div className={styles.genText}>总辐射 W/㎡</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{sunshine}</div>
        <div className={styles.genText}>总日照 h</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>{windDirect}</div>
        <div className={styles.genText}>风向 °</div>
      </div>
    </div>
  )
}

export default WeatherStationStatistics;