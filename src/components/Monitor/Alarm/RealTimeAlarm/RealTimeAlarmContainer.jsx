import React, { Component } from "react";
import styles from './realTimeAlarm.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import RealTimeFilter from './RealTimeFilter';
import RealTimeTable from './RealTimeTable';
import PropTypes from 'prop-types';



class RealTimeAlarmContainer extends Component {
  static propTypes = {
    getAlarmNum: PropTypes.func,
    getRealTimeAlarmList: PropTypes.func,
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
    const { getAlarmNum, warningStatus, warningType, } = this.props
    getAlarmNum({ warningStatus, warningType })
    this.alarmStatistic = setInterval(() => getAlarmNum({ warningStatus, warningType }), 10000);
    this.realtimeWarningSetInterval(),
    this.realtimeSetInterval = setInterval(() => this.realtimeWarningSetInterval(), 10000);
  }
  componentWillUnmount() {
    clearInterval(this.realtimeSetInterval)
    clearInterval(this.alarmStatistic)
  }
  onChangeFilter = (value) => {
    clearInterval(this.realtimeSetInterval)
    clearInterval(this.alarmStatistic)
    this.realtimeWarningSetInterval(value)
  }

  realtimeWarningSetInterval = (value) => {
    const { getRealTimeAlarmList, warningTypeStatus, warningType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, } = this.props;
    const params = { warningTypeStatus, rangTime, warningType, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType }
    getRealTimeAlarmList({ ...params, ...value })
  }


  render() {

    const { stations, deviceTypes, } = this.props;
    return (
      <div className={styles.realTimeWarningContainer}>
        <WarningStatisticTop {...this.props} warningStatus={'1'} />
        <RealTimeFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
        <RealTimeTable {...this.props} />
      </div>
    )
  }
}
export default (RealTimeAlarmContainer)