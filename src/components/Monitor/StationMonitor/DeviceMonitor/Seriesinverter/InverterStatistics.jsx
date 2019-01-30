import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat } from '../../../../../utils/utilFunc';

function InverterStatistics({ deviceDetail }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear } = deviceDetail;
  powerDay = isNaN(parseFloat(powerDay)) ? ' -- ' : parseFloat(powerDay);
  powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ' : parseFloat(powerMonth);
  powerYear = isNaN(parseFloat(powerYear)) ? ' -- ' : parseFloat(powerYear);
  return (
    <div className={styles.statisticsBox} >
      <div className={styles.deviceIcon}>
        <span className="iconfont icon-nb"></span>
      </div>
      <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
      <div className={styles.timerDayGen}>
        <div className={styles.genNum}>

          <DeviceValueFormat value={monitordataFormat(powerDay, '--')} />
        </div>

        <div className={styles.empty}></div>
        <div className={styles.genText}>日发电量 (kWh)</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>
          <DeviceValueFormat value={monitordataFormat(powerMonth, '--')} />
        </div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>月累计发电量 (kWh)</div>
      </div>
      <div className={styles.timerGen}>
        <div className={styles.genNum}>
          <DeviceValueFormat value={monitordataFormat(powerYear, '--')} />
        </div>
        <div className={styles.empty}></div>
        <div className={styles.genText}>年累计发电量 (kWh)</div>
      </div>
    </div>
  )
}

export default InverterStatistics;