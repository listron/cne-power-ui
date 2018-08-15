import React from "react";
import PropTypes from "prop-types";
import styles from './windstation.scss';
import { Progress } from "antd";

class windStationHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { windMonitorStation } = this.props;
    const stationDataSummary = (windMonitorStation && windMonitorStation.stationDataSummary);
    const stationPower = (stationDataSummary && stationDataSummary.stationPower);
    const stationCapacity = (stationDataSummary && stationDataSummary.stationCapacity);
    const stationUnitCount = (stationDataSummary && stationDataSummary.stationUnitCount);
    const instantaneous = (stationDataSummary && stationDataSummary.instantaneous);
    const dayPower = (stationDataSummary && stationDataSummary.dayPower);
    const monthPower = (stationDataSummary && stationDataSummary.monthPower);
    const yearPower = (stationDataSummary && stationDataSummary.yearPower);
    const yearPlanPower = (stationDataSummary && stationDataSummary.yearPlanPower);
    const yearPlanRate = (stationDataSummary && stationDataSummary.yearPlanRate);

    console.log(windMonitorStation && windMonitorStation.stationDataList);
    return (
      <div>
        <div className={styles.headStation}>
          <div className={styles.typeIcon}>
            <div className={styles.leftIcon}>
            </div>
            <div className={styles.rightIcon}>
            </div>
          </div>
          <div className={styles.progressInfo}>
            <div className={styles.progressData}>
              <div className={styles.stationValue}>
                <div>{stationPower}</div>
                <div>{stationCapacity}</div>
              </div>
              <div className={styles.progressBar}>
                <Progress percent={stationPower / stationCapacity * 100} showInfo={false} status="active" />
              </div>
              <div className={styles.stationType}>
                <div>实时功率 MW</div>
                <div>装机容量 MW</div>
              </div>
            </div>
          </div>
          <div className={styles.stationCollect}>
            <div className={styles.equipmentNum}>
              <div className={styles.dataValue}>{stationUnitCount}</div>
              <div className={styles.dataName}>装机台数 台</div>
            </div>
            <div className={styles.windSpeed}>
              <div className={styles.dataValue}>{instantaneous}</div>
              <div className={styles.dataName}>平均风速 m/s</div>
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
          <div className={styles.progressInfo}>
            <div className={styles.progressData}>
              <div className={styles.stationValue}>
                <div>{yearPower}</div>
                <div>{yearPlanPower}</div>
              </div>
              <div className={styles.progressBar}>
                <Progress percent={yearPower / yearPlanPower * 100} showInfo={false} status="active" />
              </div>
              <div className={styles.stationType}>
                <div>年累计发电量 万kWh</div>
                <div>计划 万kWh</div>
              </div>
            </div>
            <div className={styles.showInfo}>{yearPlanRate}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default (windStationHeader)