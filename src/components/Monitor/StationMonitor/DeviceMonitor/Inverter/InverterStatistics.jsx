import React from 'react';
import PropTypes from 'prop-types';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import inverterStyles from './inverter.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat, dataFormat, dataFormats } from '../../../../../utils/utilFunc';

function InverterStatistics({ deviceDetail, subDeviceList, theme }) {
  let { devicePower, deviceCapacity, powerDay, powerMonth, powerYear, deviceTypeCode } = deviceDetail;
  // powerDay = isNaN(parseFloat(powerDay)) ? ' -- ' : parseFloat(powerDay);
  // powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ' : parseFloat(powerMonth);
  // powerYear = isNaN(parseFloat(powerYear)) ? ' -- ' : parseFloat(powerYear);
  // deviceTypeCode === '201' 集中式逆变器 206 组串式逆变器
  if (!subDeviceList.length && subDeviceList.electricityList) {
    subDeviceList = subDeviceList.electricityList || []; // 取出子集组串接口优化后删。
  }
  const seriesGroup = Math.ceil(subDeviceList.length / 4);
  const seriesGroupWidth = Math.ceil(seriesGroup / 2) * 200;
  const statusColor = {
    light: {
      '500': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#3e97d1' }, // 偏大 - 蓝
      '400': { color: '#199475', backgroundColor: '#ceebe0' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f9b600' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#a42b2c' }, // 异常 - 红
    },
    dark: {
      '500': { color: 'transparent', backgroundColor: '#405080' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#405080' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#4d5fe2' }, // 偏大 - 蓝
      '400': { color: '#fff', backgroundColor: '#00baff' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f8b14e' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#fd6e8f' }, // 异常 - 红
    },
  };
  return (

    <div className={`${styles.statisticsBox} ${inverterStyles.statisticsBox}`} >
      <div className={inverterStyles.inverterInfo}>
        <div className={styles.deviceIcon}>
          <span className="iconfont icon-nb"></span>
        </div>
        <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} theme={theme} />
        <div className={styles.timerDayGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={dataFormats(powerDay, '--', 2)} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>日发电量 (kWh)</div>
        </div>
        <div className={styles.timerGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={dataFormats(powerMonth, '--', 2)} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>月累计发电量 (kWh)</div>
        </div>
        <div className={styles.timerGen}>
          <div className={styles.genNum}>
            <DeviceValueFormat value={dataFormats(powerYear, '--', 2)} />
          </div>
          <div className={styles.empty} />
          <div className={styles.genText}>年累计发电量 (kWh)</div>
        </div>
      </div>
      {deviceTypeCode === '206' && <div className={inverterStyles.seriesCurrent} style={{ width: `${seriesGroupWidth}px` }}>
        {subDeviceList.map((e, i) => (
          <span
            className={inverterStyles.eachCurrent}
            key={i}
            style={{
              ...statusColor[theme][e.pointStatus],
              marginRight: (i + 1) % 4 === 0 ? '20px' : '6px',
            }}
          >{dataFormat(e.pointValue, '--', 2)}</span>
        ))}
      </div>}
    </div>
  );
}

InverterStatistics.propTypes = {
  deviceDetail: PropTypes.object,
  subDeviceList: PropTypes.array,
  theme: PropTypes.string,
};

export default InverterStatistics;
