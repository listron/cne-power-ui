import React, { Component } from 'react';
import RealTimeAlarmTable from '../RealTimeAlarm/RealTimeAlarmTable';
import RealTimeAlarmFilter from '../RealTimeAlarm/RealTimeAlarmFilter';
import RealTimeAlarmInfo from '../RealTimeAlarm/RealTimeAlarmInfo';
import DeviceNameSearch from '../AlarmFilter/DeviceNameSearch';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import TransferAlarmTable from './TransferAlarmTable'
import styles from './transferAlarm.scss';
import PropTypes from 'prop-types';

class TransferAlarm extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.array,

    deviceName: PropTypes.string,
    sortName: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
    getDefectTypes: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
    getAlarmNum: PropTypes.func,
    resetAlarm: PropTypes.func,
    changeAlarmStore: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    location: PropTypes.object,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    isTransferWork: PropTypes.number,
    isRelieveAlarm: PropTypes.number,
    history: PropTypes.object,
    getLostGenType: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  onChangeFilter = (value) => {
    const { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand, } = this.props;
    const params = { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand, }
    this.props.getRealTimeAlarm({ ...params, ...value })
  }


  render() {
    const alarmStatus = 3;
    const { stations, deviceTypes, deviceName } = this.props;
    return (
      <div className={styles.realTimeAlarm}>
        <RealTimeAlarmInfo {...this.props} alarmStatus={alarmStatus} />
        <FilterCondition
          option={['alarmLevel', 'stationType', 'stationName', 'deviceType', 'alarmType', 'rangeTime']}
          stations={stations || []}
          deviceTypes={deviceTypes || []}
          onChange={this.onChangeFilter}
        />
        <DeviceNameSearch onSearch={this.onChangeFilter} deviceName={deviceName} />
        <TransferAlarmTable {...this.props} />
      </div>
    );
  }
}


export default TransferAlarm;