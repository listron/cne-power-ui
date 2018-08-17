import React from "react";
import PropTypes from "prop-types";
import styles from './allStation.scss';
import { Icon } from 'antd';
import CommonProgress from '../../../Common/CommonProgress'


class AllStationHeader extends React.Component {
  static propTypes = {
    allMonitorStation:PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { allMonitorStation } = this.props;
    const stationDataSummary = allMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity =  stationDataSummary.stationCapacity|| ' -- ';
    const dayPower =  stationDataSummary.dayPower || ' -- ';
    const monthPower =  stationDataSummary.monthPower || ' -- ';
    const yearPower = stationDataSummary.yearPower || ' -- ';
    const yearPlanPower =  stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate =  stationDataSummary.yearPlanRate || ' -- ';
    const stationTypeSummary= stationDataSummary && stationDataSummary.stationTypeSummary || [];
    //console.log(stationTypeSummary);
   const windStation=stationTypeSummary[0] ||{};
   const windNum=windStation.windStationNum || '--';
   const lightStation=stationTypeSummary[1] ||{};
   const pvNum=lightStation.lightStationNum || '--';
   
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
            <div className={styles.dayStation}>
              <div className={styles.dataValue}>{dayPower}</div>
              <div className={styles.dataName}>日发电量 万kWh</div>
            </div>
            <div className={styles.monthStation}>
              <div className={styles.dataValue}>{monthPower}</div>
              <div className={styles.dataName}>月发电量 万kWh</div>
            </div>
          </div>
          <CommonProgress value={yearPower} total={yearPlanPower} valueText={"年累计发电量 万kWh"} totalText={"计划 万kWh"} percent={yearPlanRate} />

         

        </div>
{/* 筛选 */}
        <div className={styles.stationNav}>
          <div className={styles.showType}>
            <Icon type="global" />
          </div>
          <div className={styles.typeTotal}>
            <div className={styles.windTotal}>风电:{windNum}</div>
            <div className={styles.pvTotal}>光伏:{pvNum}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default (AllStationHeader)