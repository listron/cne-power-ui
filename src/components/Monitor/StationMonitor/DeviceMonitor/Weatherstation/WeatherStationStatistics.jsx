import React from 'react';
import styles from '../eachDeviceMonitor.scss';

function WeatherStationStatistics({ deviceDetail }) {
  
  let { windSpeed, temp, humidity, batteryTemp, instantaneous, sunshine, windDirect } = deviceDetail;
  windSpeed = isNaN(parseFloat(windSpeed)) ? ' -- ': parseFloat(windSpeed); 
  temp = isNaN(parseFloat(temp)) ? ' -- ': parseFloat(temp); 
  humidity = isNaN(parseFloat(humidity)) ? ' -- ': parseFloat(humidity); 
  batteryTemp = isNaN(parseFloat(batteryTemp)) ? ' -- ': parseFloat(batteryTemp); 
  instantaneous = isNaN(parseFloat(instantaneous)) ? ' -- ': parseFloat(instantaneous); 
  sunshine = isNaN(parseFloat(sunshine)) ? ' -- ': parseFloat(sunshine); 
  windDirect = isNaN(parseFloat(windDirect)) ? ' -- ': parseFloat(windDirect); 
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-weather"></span>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{windSpeed}</div>
        <div className={styles.genText}>风速 m/s</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{temp}</div>
        <div className={styles.genText}>环境温度 ℃</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{humidity}</div>
        <div className={styles.genText}>湿度g/m³</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{batteryTemp}</div>
        <div className={styles.genText}>电池板温度 ℃</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{instantaneous}</div>
        <div className={styles.genText}>瞬时辐照 W/㎡</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{sunshine}</div>
        <div className={styles.genText}>总日照 h</div>
      </div>
      <div className={styles.weatherEachData}>
        <div className={styles.genNum}>{windDirect}</div>
        <div className={styles.genText}>风向 °</div>
      </div>
    </div>
  )
}

export default WeatherStationStatistics;