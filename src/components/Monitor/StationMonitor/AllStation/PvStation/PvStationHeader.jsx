import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import CommonProgress from '../../../../Common/CommonProgress'
import { ValueFormat } from '../../../../Common/UtilComponent'
import { dataFormat } from '../../../../../utils/utilFunc';

class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { pvMonitorStation , realTimePowerUnit,realCapacityUnit,powerUnit,realTimePowerPoint,realCapacityPoint,powerPoint,} = this.props;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity = stationDataSummary.stationCapacity || ' -- ';
    const stationUnitCount = stationDataSummary.stationUnitCount || ' -- ';
    const instantaneous = stationDataSummary.instantaneous || ' -- ';
    const dayPower = stationDataSummary.dayPower || ' -- ';
    const monthPower = stationDataSummary.monthPower || ' -- ';
    const yearPower = stationDataSummary.yearPower || ' -- ';
    const yearPlanPower = stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate = stationDataSummary.yearPlanRate || ' -- ';
    // const yearPlanRate =stationDataSummary.yearPlanRate&&stationDataSummary.yearPlanRate!=='0.00%'?stationDataSummary.yearPlanRate:'--';
    // console.log(yearPlanRate);
    return (
      <div className={styles.headStation}>
        <div className={styles.typeIcon}>
          <div className={styles.leftIcon}>
          </div>
        </div>
        <CommonProgress value={stationPower} total={stationCapacity} points={realCapacityPoint} valueunit={realCapacityUnit}  valueText={`实时功率 ${realTimePowerUnit}`} totalText={`装机容量 ${realCapacityUnit}`} />
        <div className={styles.stationCollect}>
          <div className={styles.equipmentNum}>
            <div className={styles.dataValue}>{stationUnitCount}</div>
            <div className={styles.dataName}>装机台数 台</div>
          </div>
          <div className={styles.pvInstantaneous}>
            <div className={styles.dataPvValue}>{instantaneous}</div>
            <div className={styles.dataName}>平均辐射 W/m²</div>
          </div>
          <div className={styles.dayStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={dataFormat(dayPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
            </div>
            <div className={styles.dataName}>日发电量 {powerUnit}</div>
          </div>
          <div className={styles.monthStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={dataFormat(monthPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} /> 
            </div>
            <div className={styles.dataName}>月累计发电量 {powerUnit}</div>
          </div>
        </div>
        <CommonProgress value={yearPower} total={yearPlanPower} points={powerPoint} valueunit={powerUnit} valueText={`年累计发电量 ${powerUnit}`} totalText={`计划 ${powerUnit}`} percent={yearPlanRate ? yearPlanRate : ''} />
      </div>
    )
  }
}
export default (pvStationHeader)