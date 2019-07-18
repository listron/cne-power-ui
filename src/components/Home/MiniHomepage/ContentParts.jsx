/*eslint new-cap: ["error", { "capIsNewExceptionPattern": "^wscript\.." }]*/

import React, { Component } from 'react';
import styles from './miniHome.scss';
import PropTypes from 'prop-types';
import General from './MiniComponents/General';
import MonthGenChart from './MiniComponents/MonthGenChart';
import OutputPower from './MiniComponents/OutputPower';
import { OperationInfo } from './MiniComponents/OperationInfo';

class ContentParts extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    enterpriseId: PropTypes.string,
    monthPower: PropTypes.array,
    outputPower: PropTypes.array,
    outputPowerTime: PropTypes.number,
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
      outputPower, outputPowerTime, getOutputDiagram,
      operationInfo,
    } = this.props;
    return (
      <div className={styles.contentParts}>
        <div className={styles.leftBox}>
          <General hasMultipleType={hasMultipleType} realTimeInfo={realTimeInfo} />
          <MonthGenChart
            monthPower={monthPower}
            getMonthPower={getMonthPower}
            enterpriseId={enterpriseId}
            hasMultipleType={hasMultipleType}
          />
        </div>
        <div>中间地图</div>
        <div className={styles.rightBox}>
          <OutputPower
            enterpriseId={enterpriseId}
            outputPowerTime={outputPowerTime}
            mapStation={mapStation}
            outputPower={outputPower}
            getOutputDiagram={getOutputDiagram}
          />
          <OperationInfo operationInfo={operationInfo} />
          <div>设备状态</div>
        </div>
      </div>
    );
  }
}

export default ContentParts;

