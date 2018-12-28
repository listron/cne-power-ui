import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { dataFormat } from '../../../../../utils/utilFunc';

function InverterStatistics({ deviceDetail }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear,windSpeed,angleOfYaw } = deviceDetail;
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-windlogo"></span>
        <p className={styles.deviceCode} title={deviceDetail.deviceModeName|| "--" }>{deviceDetail.deviceModeName || "--"}</p>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>
      
        <DeviceValueFormat value={dataFormat(windSpeed, '--')} />
        </div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>风速</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>{(angleOfYaw || angleOfYaw===0 )? +angleOfYaw:'--'}°</div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>风向</div>
      </div>
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>
        <DeviceValueFormat value={dataFormat(powerDay, '--')} />
        </div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>日发电量 (kWh)</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>
        <DeviceValueFormat value={dataFormat(powerMonth, '--')} /></div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>月累计发电量 (kWh)</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>
        <DeviceValueFormat value={dataFormat(powerYear, '--')} /></div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>年累计发电量 (kWh)</div>
      </div>
    </div>
  )
}

export default InverterStatistics;