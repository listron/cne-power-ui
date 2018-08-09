import React from 'react';
import { Progress } from 'antd';
import styles from './deviceMonitorStatistics.scss';

function PowerProgress({ devicePower, deviceCapacity }) {
  const tmpPercent = parseFloat(deviceCapacity) === 0 ? ' -- ': devicePower / deviceCapacity;
  const percent = tmpPercent >= 0 ? tmpPercent * 100 : 0;
  return (
    <div className={styles.powerProgress} >
      <div className={styles.progressNum}>
        <span className={styles.leftText}>{devicePower || ' -- '}</span>
        <span className={styles.rightText}>{deviceCapacity || ' -- '}</span>
      </div>
      <Progress strokeColor="#199475" percent={percent} showInfo={false} />
      <div className={styles.progressText}>
        <span className={styles.leftText}>实时功率 MW</span>
        <span className={styles.rightText}>装机容量 MW</span>
      </div>
    </div>
  )
}

export default PowerProgress;