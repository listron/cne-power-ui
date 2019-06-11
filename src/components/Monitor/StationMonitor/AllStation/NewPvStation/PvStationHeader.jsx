import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Tooltip } from 'antd';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { dataFormats, numWithComma, unitDataFormat } from '../../../../../utils/utilFunc';
import { DeviceValueFormat, divideFormarts, multiplyFormarts } from '../../PvCommon/PvDataformat';
class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }


  render() {
    // 默认传过来的数据是 发电量是kW 装机容量 MW 实时功率 kW 小数根据数据计算
    const { pvMonitorStation, monitorPvUnit } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationPower = divideFormarts(stationDataSummary.stationPower, realTimePowerUnit);
    const stationCapacity = realCapacityUnit === 'MW' ? stationDataSummary.stationCapacity : multiplyFormarts(stationDataSummary.stationCapacity, 1000);
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = divideFormarts(stationDataSummary.dayPower, powerUnit);
    const monthPower = divideFormarts(stationDataSummary.monthPower, powerUnit);
    const yearPower = divideFormarts(stationDataSummary.yearPower, powerUnit);
    const monthRate = stationDataSummary.monthRate;
    const equivalentHours = stationDataSummary.equivalentHours;
    const yearRate = stationDataSummary.yearRate;
    const percent = (stationPower && stationCapacity) ? (stationPower / stationCapacity) * 100 : 0;
    return (
      <div className={styles.headStation}>
        <div className={styles.leftIcon}></div>
        <div ref={'allStaionStatic'} className={styles.allStaionStatic}></div>
        <div className={styles.dataColumn}>
          <div className={styles.stationPower}>
            <div> <span className={styles.dataValue}>{DeviceValueFormat(stationPower, '--', 2)}</span>{realTimePowerUnit}</div>
            <div> <span className={styles.dataValue}>{DeviceValueFormat(stationCapacity, '--', 2)}</span>{realCapacityUnit}</div>
          </div>
          <OwnProgress percent={percent} active={true} />
          <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
        </div>
        <div className={styles.dataColumn}>
          <div> 平均辐射  <span className={`${styles.dataValue} ${styles.radiation}`}>{DeviceValueFormat(instantaneous, '--', 2)}</span> W/m² </div>
          <div >  装机台数 <span className={styles.dataValue}>{DeviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{DeviceValueFormat(dayPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div> 日利用小时 <span className={styles.dataValue}>{DeviceValueFormat(equivalentHours, '--', 2)}</span> h</div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{DeviceValueFormat(monthPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div> 月完成率 <span className={styles.dataValue}>{DeviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{DeviceValueFormat(yearPower, '--', 2, true)}</span> {powerUnit} </div>
          <div> 年完成率 <span className={styles.dataValue}>{DeviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
      </div>
    )
  }
}
export default (pvStationHeader)