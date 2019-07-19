
import React, { Component } from 'react';
import styles from './miniHome.scss';
import PropTypes from 'prop-types';
import General from './MiniComponents/General';
import InefficientSeries from './MiniComponents/InefficientSeries';
import MonthGenChart from './MiniComponents/MonthGenChart';
import CenterMap from './MiniComponents/CenterMap';
import OutputPower from './MiniComponents/OutputPower';
import { OperationInfo } from './MiniComponents/OperationInfo';
import DeviceStatus from './MiniComponents/DeviceStatus';

class ContentParts extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    enterpriseId: PropTypes.string,
    inefficientList: PropTypes.array,
    monthPower: PropTypes.array,
    outputPower: PropTypes.array,
    outputPowerTime: PropTypes.string,
    mapStation: PropTypes.array,
    realTimeInfo: PropTypes.object,
    operationInfo: PropTypes.object,
    getMonthPower: PropTypes.func,
    getOutputDiagram: PropTypes.func,
  }

  render(){
    const {
      hasMultipleType, mapStation, enterpriseId, realTimeInfo,
      monthPower, getMonthPower,
      inefficientList,
      outputPower, outputPowerTime, getOutputDiagram,
      operationInfo,
    } = this.props;
    return (
      <div className={styles.contentParts} id="homepageContent">
        <div className={styles.leftBox}>
          <General hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo} />
          <InefficientSeries inefficientList={inefficientList} />
          <MonthGenChart
            monthPower={monthPower}
            getMonthPower={getMonthPower}
            enterpriseId={enterpriseId}
            hasMultipleType={hasMultipleType}
          />
        </div>
        <CenterMap {...this.props} />
        <div className={styles.rightBox}>
          <OutputPower
            enterpriseId={enterpriseId}
            outputPowerTime={outputPowerTime}
            mapStation={mapStation}
            outputPower={outputPower}
            getOutputDiagram={getOutputDiagram}
          />
          <OperationInfo operationInfo={operationInfo} />
          <DeviceStatus realTimeInfo={realTimeInfo} hasMultipleType={hasMultipleType} />
        </div>
      </div>
    );
  }
}

export default ContentParts;

