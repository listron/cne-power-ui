import React from "react";
import PropTypes from "prop-types";
import styles from './allStation.scss';
//import { Icon } from 'antd';
import CommonProgress from '../../../Common/CommonProgress'
import { ValueFormat} from '../../../Common/UtilComponent'
import { dataFormat } from '../../../../utils/utilFunc';



class AllStationHeader extends React.Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { allMonitorStation, realTimePowerUnit,realCapacityUnit,powerUnit,realTimePowerPoint,realCapacityPoint,powerPoint, } = this.props;
    const stationDataSummary = allMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity = stationDataSummary.stationCapacity || ' -- ';
    const dayPower = stationDataSummary.dayPower || ' -- ';
    const monthPower = stationDataSummary.monthPower || ' -- ';
    const yearPower = stationDataSummary.yearPower || ' -- ';
    const yearPlanPower = stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate = stationDataSummary.yearPlanRate || ' -- ';
    const stationTypeSummary = stationDataSummary.stationTypeSummary || [];
    const windStation = stationTypeSummary.windStationNum || '--';
    const lightStation = stationTypeSummary.lightStationNum || '--';
  

    return (
      <div className={styles.headContainer}>
        <div className={styles.headStation}>
          <div className={styles.typeIcon}>
            <div className={styles.leftIcon}>
            </div>
            <div className={styles.rightIcon}>
            </div>
          </div>
          <CommonProgress value={stationPower} total={stationCapacity} points={realCapacityPoint} valueunit={realCapacityUnit}  valueText={`实时功率 ${realTimePowerUnit}`} totalText={`装机容量 ${realCapacityUnit}`} />
          <div className={styles.stationCollect}>
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
        <div className={styles.stationNav}>
          <div className={styles.showType}>
            <i className="iconfont icon-map"></i>
          </div>
          <div className={styles.typeTotal}>
            <div className={styles.windTotal}>风电<span className={styles.stationNum}>{windStation}</span></div>
            <div className={styles.pvTotal}>光伏<span className={styles.stationNum}>{lightStation}</span></div>
          </div>
        </div>
      </div>
    )
  }
}
export default (AllStationHeader)