

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import PvStationCont from './PvStationCont';
import styles from './pvStation.scss';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon'

class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    stationDeviceList: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    stationCode: PropTypes.string,
    resetSingleStationStore: PropTypes.func,
    realTimePowerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    powerUnit: PropTypes.string,
    powerPoint: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }

  render() {
    const { realTimePowerUnit, realTimePowerPoint, powerUnit, powerPoint } = this.props;
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.pvStation}  >
        <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'辐射(W/m²)'} stationCode={stationCode} yAxisUnit={realTimePowerUnit} yAxisValuePoint={realTimePowerPoint} />
          <PowerDiagramTenMin {...this.props} stationCode={stationCode} yAxisUnit={powerUnit} yAxisValuePoint={powerPoint} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        {/* 设备类型流程图切换 */}
        <PvStationCont {...this.props} />
      </div>
    )
  }
}

export default PvStation;
