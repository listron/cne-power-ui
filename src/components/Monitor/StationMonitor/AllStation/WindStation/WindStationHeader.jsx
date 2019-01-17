import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import CommonProgress from '../../../../Common/CommonProgress'
import { ValueFormat,DeviceValueFormat } from '../../../../Common/UtilComponent'
import { monitordataFormat } from '../../../../../utils/utilFunc';

class windStationHeader extends React.Component {
  static propTypes = {
    windMonitorStation: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { windMonitorStation,realTimePowerUnit,realCapacityUnit,powerUnit,realTimePowerPoint,realCapacityPoint,powerPoint } = this.props;

    const stationDataSummary = windMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity = stationDataSummary.stationCapacity || ' -- ';
    const stationUnitCount = stationDataSummary.stationUnitCount || '--';
    const instantaneous = stationDataSummary.instantaneous || ' -- ';
    const dayPower = stationDataSummary.dayPower || ' -- ';
    const monthPower = stationDataSummary.monthPower || ' -- ';
    const yearPower = stationDataSummary.yearPower || ' -- ';
    const yearPlanPower = stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate = stationDataSummary.yearPlanRate || ' -- ';
    return (
      <div className={styles.headStation}>
        <div className={styles.typeIcon}>
          <div className={styles.leftIcon}>
          </div>
        </div>
        <CommonProgress value={stationPower} total={stationCapacity} realTimePoint={realTimePowerPoint} realTimeUnit={realTimePowerUnit} points={realCapacityPoint} valueunit={realCapacityUnit}  valueText={`实时功率 (${realTimePowerUnit})`} totalText={`装机容量 (${realCapacityUnit})`} />
        <div className={styles.stationCollect}>
          <div className={styles.equipmentNum}>
            <div className={styles.dataValue}>{stationUnitCount}</div>
            <div className={styles.dataName}>装机台数 (台)</div>
          </div>
          <div className={styles.windSpeed}>
            <div className={styles.dataWindValue}> 
            <DeviceValueFormat value={monitordataFormat(instantaneous, '--')} /></div>
            <div className={styles.dataName}>平均风速 (m/s)</div>
          </div>
          <div className={styles.dayStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={monitordataFormat(dayPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
            </div>
            <div className={styles.dataName}>日发电量 ({powerUnit})</div>
          </div>
          <div className={styles.monthStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={monitordataFormat(monthPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} /> 
            </div>
            <div className={styles.dataName}>月累计发电量 ({powerUnit})</div>
          </div>
        </div>
        <CommonProgress value={yearPower} total={yearPlanPower} points={powerPoint}  realTimePoint={powerPoint} realTimeUnit={powerUnit}  valueunit={powerUnit} valueText={`年累计发电量 (${powerUnit})`} totalText={`计划 (${powerUnit})`} percent={yearPlanRate ? yearPlanRate : ''} />
      </div>
    )
  }
}
export default (windStationHeader)