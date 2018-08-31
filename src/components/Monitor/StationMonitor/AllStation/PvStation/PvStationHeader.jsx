import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import CommonProgress from '../../../../Common/CommonProgress'
class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation:PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { pvMonitorStation } = this.props;
    const stationDataSummary =  pvMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity = stationDataSummary.stationCapacity || ' -- ';
    const stationUnitCount =  stationDataSummary.stationUnitCount || ' -- ';
    const instantaneous =  stationDataSummary.instantaneous || ' -- ';
    const dayPower =  stationDataSummary.dayPower || ' -- ';
    const monthPower = stationDataSummary.monthPower || ' -- ';
    const yearPower =   stationDataSummary.yearPower || ' -- ';
    const yearPlanPower =  stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate = stationDataSummary.yearPlanRate || ' -- ';
    return (
      <div>
        <div className={styles.headStation}>
          <div className={styles.typeIcon}>
            <div className={styles.leftIcon}>
            </div>
            <div className={styles.rightIcon}>
            </div>
          </div>
          <CommonProgress value={stationPower} total={stationCapacity} valueText={"实时功率 MW"} totalText={"装机容量 MW"} />
          <div className={styles.stationCollect}>
            <div className={styles.equipmentNum}>
              <div className={styles.dataValue}>{stationUnitCount}</div>
              <div className={styles.dataName}>装机台数 台</div>
            </div>
            <div className={styles.pvInstantaneous}>
              <div className={styles.dataPvValue}>{instantaneous}</div>
              <div className={styles.dataName}>平均辐射 w/m²</div>
            </div>
            <div className={styles.dayStation}>
              <div className={styles.dataValue}>{dayPower}</div>
              <div className={styles.dataName}>日发电量 万kWh</div>
            </div>
            <div className={styles.monthStation}>
              <div className={styles.dataValue}>{monthPower}</div>
              <div className={styles.dataName}>月发电量 万kWh</div>
            </div>
          </div>
          <CommonProgress value={yearPower} total={yearPlanPower} valueText={"年累计发电量 万kWh"} totalText={"计划 万kWh"} percent={yearPlanRate?yearPlanRate:''} />   
        </div>
      </div>
    )
  }
}
export default (pvStationHeader)