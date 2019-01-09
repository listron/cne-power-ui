import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import RealTimeWarningFilter from './RealTimeWarningFilter';
import RealTimeWarningTable from './RealTimeWarningTable';
import PropTypes from 'prop-types';
import { channel } from "redux-saga";



class RealTimeWarningContainer extends Component {
  static propTypes = {
    getRealtimeWarningStatistic: PropTypes.func,
    getRealtimeWarning: PropTypes.func,
    warningStatus: PropTypes.string,
    warningType: PropTypes.string,
    warningTypeStatus: PropTypes.string,
    rangTime: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    deviceTypes: PropTypes.array,
    warningLevel: PropTypes.array,
    stationCodes: PropTypes.array,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    deviceName: PropTypes.string,
    durationType: PropTypes.string,
    stations: PropTypes.array,

  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    const { getRealtimeWarningStatistic, warningStatus, warningType, } = this.props
    getRealtimeWarningStatistic({ warningStatus, warningType })
    this.WarningStatistic = setInterval(() => getRealtimeWarningStatistic({ warningStatus, warningType }), 10000);
    this.realtimeWarningSetInterval(),
      this.realtimeSetInterval = setInterval(() => this.realtimeWarningSetInterval(), 10000);
  }
  onChangeFilter = (value) => {
    clearInterval(this.realtimeSetInterval)
    clearInterval(this.WarningStatistic)
    this.realtimeWarningSetInterval(value)
  }

  realtimeWarningSetInterval = (value) => {
    const { getRealtimeWarning, warningTypeStatus,warningType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, } = this.props;
    const params = { warningTypeStatus, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType }
    getRealtimeWarning({ ...params, ...value })
  }


  render() {

    const { stations, deviceTypes, } = this.props;
    return (
      <div className={styles.realTimeWarningContainer}>
        <WarningStatisticTop {...this.props} warningStatus={'1'} />
        <RealTimeWarningFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
        <RealTimeWarningTable {...this.props} />
      </div>
    )
  }
}
export default (RealTimeWarningContainer)