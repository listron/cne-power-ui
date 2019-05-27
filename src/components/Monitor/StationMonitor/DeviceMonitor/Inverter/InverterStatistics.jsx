import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import inverterStyles from './inverter.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat, dataFormat } from '../../../../../utils/utilFunc';

function InverterStatistics({ deviceDetail, subDeviceList }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear, deviceTypeCode } = deviceDetail;
  powerDay = isNaN(parseFloat(powerDay)) ? ' -- ' : parseFloat(powerDay);
  powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ' : parseFloat(powerMonth);
  powerYear = isNaN(parseFloat(powerYear)) ? ' -- ' : parseFloat(powerYear);
  // deviceTypeCode === '201' 集中式逆变器 206 组串式逆变器
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
    <div className={`${styles.statisticsBox} ${inverterStyles.statisticsBox}`} >
      <div className={inverterStyles.inverterInfo}>
        <div className={styles.deviceIcon}>
          <span className="iconfont icon-nb"></span>
        </div>
        <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} />
        <div className={styles.timerDayGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={monitordataFormat(powerDay, '--')} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>日发电量 (kWh)</div>
        </div>
        <div className={styles.timerGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={monitordataFormat(powerMonth, '--')} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>月累计发电量 (kWh)</div>
        </div>
        <div className={styles.timerGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={monitordataFormat(powerYear, '--')} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>年累计发电量 (kWh)</div>
        </div>
      </div>
      {deviceTypeCode === '206' && <div className={inverterStyles.seriesCurrent} style={{width: `${seriesGroupWidth}px`}}>
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
      </div>}
    </div>
  )
}

export default InverterStatistics;