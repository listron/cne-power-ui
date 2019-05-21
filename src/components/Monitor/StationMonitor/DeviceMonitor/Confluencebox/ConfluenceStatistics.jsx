import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat } from '../../../../../utils/utilFunc';
import styles from './confluencebox.scss';

{/* <div className={styles.genNum}>
  <DeviceValueFormat value={monitordataFormat(powerMonth, '--')} />
</div> */}

const EachRecord = ({text, value, unit}) => (
  <div className={styles.eachRecord}>
    <span className={styles.text}>{text}</span>
    <DeviceValueFormat value={value} />
    <span className={styles.unit}>{unit}</span>
  </div>
)

function ConfluenceStatistics({ deviceDetail }) {
  const { devicePower, deviceCapacity, voltage, electricCurrent, temperature, dispersedRate, subList = [] } = deviceDetail;
  let seriesList = (new Array(16)).fill();
  return (
    <div className={styles.confluenceStatistics}>
      <div className={styles.confluenceInfo}>
        <div className={styles.deviceIcon}>
          <span className="iconfont icon-hl" />
        </div>
        <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
        <div className={styles.line} />
        <div className={styles.elecInfo}>
          <EachRecord text="电压" value={monitordataFormat(voltage, '--')} unit="V" />
          <EachRecord text="电流" value={monitordataFormat(electricCurrent, '--')} unit="A" />
        </div>
        <div className={styles.line} />
        <div className={styles.statisticsInfo}>
          <EachRecord text="温度" value={monitordataFormat(temperature, '--')} unit="℃" />
          <EachRecord text="离散率" value={monitordataFormat(dispersedRate, '--')} unit="%" />
        </div>
      </div>
      <div className={styles.seriesCurrent}>
        {seriesList.map((e, i) => (<span className={styles.eachCurrent} key={i}>{subList[i]}</span>))}
      </div>
    </div>
  )
}

export default ConfluenceStatistics;