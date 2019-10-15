import React from 'react';
import { Progress } from 'antd';
import styles from './deviceMonitor.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent/index';
import { monitordataFormat, dataFormats } from '../../../../../utils/utilFunc';

function PowerProgress({ devicePower, deviceCapacity, theme }) {
  const tmpPercent = parseFloat(deviceCapacity) === 0 ? ' -- ' : devicePower / deviceCapacity;
  const percent = tmpPercent >= 0 ? tmpPercent * 100 : 0;
  const showDevicePower = (devicePower || devicePower === 0) ? devicePower : ' -- ';
  const showCapacityPower = (deviceCapacity || deviceCapacity === 0) ? deviceCapacity : ' -- ';
  return (
    <div className={`${styles.powerProgress} ${styles[theme]}`} >
      <div className={styles.progressNum}>
        <span className={styles.leftText}>
          <DeviceValueFormat value={dataFormats(showDevicePower, '--', 2)} />
        </span>
        <span className={styles.rightText}>
          <DeviceValueFormat value={dataFormats(showCapacityPower, '--', 2)} />
        </span>

      </div>
      <Progress strokeWidth={3} percent={percent} showInfo={false} />
      <div className={styles.progressText}>
        <span className={styles.leftText}>实时功率 (kW)</span>
        <span className={styles.rightText}>装机容量 (kW)</span>
      </div>
    </div>
  );
}

export default PowerProgress;
