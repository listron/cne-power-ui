import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat, dataFormat } from '../../../../../utils/utilFunc';
import styles from './confluencebox.scss';

const EachRecord = ({text, value, unit}) => (
  <div className={styles.eachRecord}>
    <span className={styles.text}>{text}</span>
    <DeviceValueFormat value={value} />
    <span className={styles.unit}>{unit}</span>
  </div>
)

function ConfluenceStatistics({ deviceDetail, subDeviceList = [] }) {
  const { devicePower, deviceCapacity, voltage, electricity, temperature, dispersedRate } = deviceDetail;
  const seriesGroup = Math.ceil(subDeviceList.length / 4);
  const seriesGroupWidth = Math.ceil(seriesGroup / 2) * 195; 
  const statusColor = {
    '500': { color: '#199475', backgroundColor: '#ceebe0'}, // 无通讯
    '900': { color: '#199475', backgroundColor: '#ceebe0'}, // 未接入
    '802': { color: '#fff', backgroundColor: '#3e97d1'}, // 偏大 - 蓝
    '400': { color: '#fff', backgroundColor: '#199475'}, // 正常 - 绿
    '801': { color: '#fff', backgroundColor: '#f9b600'}, // 偏小 - 橙
    '803': { color: '#fff', backgroundColor: '#3e97d1'}, // 异常 - 红
  };

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
          <EachRecord text="电流" value={monitordataFormat(electricity, '--')} unit="A" />
        </div>
        <div className={styles.line} />
        <div className={styles.statisticsInfo}>
          <EachRecord text="温度" value={monitordataFormat(temperature, '--')} unit="℃" />
          <EachRecord text="离散率" value={monitordataFormat(parseFloat(dispersedRate), '--')} unit="%" />
        </div>
      </div>
      <div className={styles.seriesCurrent} style={{width: `${seriesGroupWidth}px`}}>
        {subDeviceList.map((e, i) => (
          <span
            className={styles.eachCurrent}
            key={i}
            style={{
              ...statusColor[e.pointStatus],
              marginRight: (i + 1) % 4 === 0 ? '20px' : '6px'
            }}
          >{dataFormat(e.pointValue, '--', 2)}</span>
        ))}
      </div>
    </div>
  )
}

export default ConfluenceStatistics;