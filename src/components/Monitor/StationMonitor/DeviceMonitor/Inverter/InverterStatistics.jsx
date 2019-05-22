import React from 'react';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import inverterStyles from './inverter.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat } from '../../../../../utils/utilFunc';

function InverterStatistics({ deviceDetail, subDeviceList }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear, deviceTypeCode } = deviceDetail;
  powerDay = isNaN(parseFloat(powerDay)) ? ' -- ' : parseFloat(powerDay);
  powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ' : parseFloat(powerMonth);
  powerYear = isNaN(parseFloat(powerYear)) ? ' -- ' : parseFloat(powerYear);
  // deviceTypeCode === '201' 集中式逆变器 206 组串式逆变器
  let seriesList = (new Array(16)).fill();
  const statusColor = { // 1-蓝色、2-绿色、3-橙色、4-红色) ['big', 'normal', 'small', 'abnormal',][e.pointLevel - 1];
    '0': { color: '#199475', backgroundColor: '#ceebe0'}, // 未接入
    '1': { color: '#fff', backgroundColor: '#3e97d1'}, // 偏大 - 蓝
    '2': { color: '#fff', backgroundColor: '#199475'}, // 正常 - 绿
    '3': { color: '#fff', backgroundColor: '#f9b600'}, // 偏小 - 橙
    '4': { color: '#fff', backgroundColor: '#3e97d1'}, // 异常 - 红
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
      {deviceTypeCode === '206' && <div className={inverterStyles.seriesCurrent}>
        {seriesList.map((e, i) => {
          const { electricCurrent = '--', status = '0' } = subDeviceList[i] || {};
          const emptySeries = i > subDeviceList.length - 1; // 超出长度为不存在。
          return (
            <span
              className={inverterStyles.eachCurrent}
              key={i}
              style={{
                backgroundColor: emptySeries ? '#f1f1f1': statusColor[status].backgroundColor,
                color: emptySeries ? '#199475': statusColor[status].color,
                marginRight: (i + 1) % 4 === 0 ? '20px' : '6px'
              }}
            >{emptySeries ? '' : electricCurrent}</span>
          )
        })}
      </div>}
    </div>
  )
}

export default InverterStatistics;