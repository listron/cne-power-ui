import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat } from '../../../../../utils/utilFunc';
import styles from './confluencebox.scss';

const EachRecord = ({text, value, unit}) => (
  <div className={styles.eachRecord}>
    <span className={styles.text}>{text}</span>
    <DeviceValueFormat value={value} />
    <span className={styles.unit}>{unit}</span>
  </div>
)

function ConfluenceStatistics({ deviceDetail, subDeviceList = [] }) {
  const { devicePower, deviceCapacity, voltage, electricCurrent, temperature, dispersedRate } = deviceDetail;
  let seriesList = (new Array(16)).fill();
  const statusColor = { // 1-蓝色、2-绿色、3-橙色、4-红色) ['big', 'normal', 'small', 'abnormal',][e.pointLevel - 1];
    '0': { color: '#199475', backgroundColor: '#ceebe0'}, // 未接入
    '1': { color: '#fff', backgroundColor: '#3e97d1'}, // 偏大 - 蓝
    '2': { color: '#fff', backgroundColor: '#199475'}, // 正常 - 绿
    '3': { color: '#fff', backgroundColor: '#f9b600'}, // 偏小 - 橙
    '4': { color: '#fff', backgroundColor: '#3e97d1'}, // 异常 - 红
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
          <EachRecord text="电流" value={monitordataFormat(electricCurrent, '--')} unit="A" />
        </div>
        <div className={styles.line} />
        <div className={styles.statisticsInfo}>
          <EachRecord text="温度" value={monitordataFormat(temperature, '--')} unit="℃" />
          <EachRecord text="离散率" value={monitordataFormat(dispersedRate, '--')} unit="%" />
        </div>
      </div>
      <div className={styles.seriesCurrent}>
        {seriesList.map((e, i) => {
          const { electricCurrent = '--', status = '0' } = subDeviceList[i] || {};
          const emptySeries = i > subDeviceList.length - 1; // 超出长度为不存在。
          return (
            <span
              className={styles.eachCurrent}
              key={i}
              style={{
                backgroundColor: emptySeries ? '#f1f1f1': statusColor[status].backgroundColor,
                color: emptySeries ? '#199475': statusColor[status].color,
                marginRight: (i + 1) % 4 === 0 ? '20px' : '6px'
              }}
            >{emptySeries ? '' : electricCurrent}</span>
          )
        })}
      </div>
    </div>
  )
}

export default ConfluenceStatistics;