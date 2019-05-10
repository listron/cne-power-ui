import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Tooltip } from 'antd';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { dataFormats, numWithComma, unitDataFormat } from '../../../../../utils/utilFunc';

class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }

  DeviceValueFormat = (data, placeholder = '--', pointLength, special = false) => {
    let point = pointLength;
    if (special) { // 特殊的设置 只针对光伏
      if (data > 1) point = 2;
      if (data <= 1) point = 4;
    }
    let showData = dataFormats(data, placeholder, point, true)
    if (showData !== '--') {
      const valueArr = showData.split('.');
      const intNum = valueArr[0];
      const pointNum = valueArr[1];
      return (
        <span className={styles.valueFormat}>
          <span className={styles.int} style={{ fontSize: 24 }}>{numWithComma(intNum)}</span>
          {pointNum && <span className={styles.decimal} style={{ fontSize: 18 }}>.{pointNum}</span>}
        </span>
      )
    } else {
      return showData
    }
  }

  divideFormarts = (data, unit) => { // 除
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    if (unit === "万kWh") {
      return data / 10000
    }
    return data
  }

  multiplyFormarts = (data, quantity) => { // 乘
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    return data * quantity
  }

  render() {
    // 默认传过来的数据是 发电量是kW 装机容量 MW 实时功率 kW 小数根据数据计算
    const { pvMonitorStation, monitorPvUnit } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationPower = realTimePowerUnit === 'kW' ? stationDataSummary.stationPower : this.multiplyFormarts(stationDataSummary.stationPower, 1000);
    const stationCapacity = realCapacityUnit === 'MW' ? stationDataSummary.stationCapacity : this.multiplyFormarts(stationDataSummary.stationCapacity, 1000);
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = this.divideFormarts(stationDataSummary.dayPower, powerUnit);
    const monthPower = this.divideFormarts(stationDataSummary.monthPower, powerUnit);
    const yearPower = this.divideFormarts(stationDataSummary.yearPower, powerUnit);
    const monthRate = stationDataSummary.monthRate;
    const equivalentHours = stationDataSummary.equivalentHours;
    const yearRate = stationDataSummary.yearRate;
    const percent = (stationPower && stationCapacity) ? (stationPower / 1000) / stationCapacity * 100 : 0;
    return (
      <div className={styles.headStation}>
        <div className={styles.leftIcon}></div>
        <div ref={'allStaionStatic'} className={styles.allStaionStatic}></div>
        <div className={styles.dataColumn}>
          <div className={styles.stationPower}>
            <div> <span className={styles.dataValue}>{this.DeviceValueFormat(stationPower, '--', 2)}</span>{realCapacityUnit}</div>
            <div> <span className={styles.dataValue}>{this.DeviceValueFormat(stationCapacity, '--', 2)}</span>{realTimePowerUnit}</div>
          </div>
          <OwnProgress percent={percent} active={true} />
          <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
        </div>
        <div className={styles.dataColumn}>
          <div> 平均辐射  <span className={`${styles.dataValue} ${styles.radiation}`}>{this.DeviceValueFormat(instantaneous, '--', 2)}</span> W/m² </div>
          <div >  装机台数 <span className={styles.dataValue}>{this.DeviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(dayPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div> 日等效时 <span className={styles.dataValue}>{this.DeviceValueFormat(equivalentHours, '--', 2)}</span> h</div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(monthPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div> 月完成率 <span className={styles.dataValue}>{this.DeviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(yearPower, '--', 2, true)}</span> {powerUnit} </div>
          <div> 年完成率 <span className={styles.dataValue}>{this.DeviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
      </div>
    )
  }
}
export default (pvStationHeader)