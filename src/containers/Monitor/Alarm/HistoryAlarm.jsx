import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import HistoryAlarmTable from '../../../components/Monitor/Alarm/HistoryAlarm/HistoryAlarmTable';
import HistoryAlarmFilter from '../../../components/Monitor/Alarm/HistoryAlarm/HistoryAlarmFilter';
import DeviceNameSearch from '../../../components/Monitor/Alarm/AlarmFilter/DeviceNameSearch';
import Footer from '../../../components/Common/Footer';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class HistoryAlarm extends Component {
  static propTypes = {
    historyAlarm: PropTypes.array,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    warningStatus: PropTypes.array,
    startTime: PropTypes.array,
    endTime: PropTypes.array,
    deviceName: PropTypes.string,
    getHistoryAlarm: PropTypes.func,
    changeAlarmStore: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    resetAlarm: PropTypes.func,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, warningStatus, deviceName} = this.props;
    this.props.getHistoryAlarm({
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      warningStatus,
      startTime,
      endTime,
      deviceName,
    });
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  onChangeFilter = (obj) => {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, warningStatus, deviceName } = this.props;
    let filter = {
      warningLevel,
      stationCode,
      stationType,
      deviceTypeCode,
      warningConfigName,
      warningStatus,
      startTime,
      endTime,
      deviceName,
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getHistoryAlarm(newFiter);
  }

  render() {
    return (
      <div className={styles.historyAlarmContainer}>
        <div className={styles.historyAlarmBox}>
          <div className={styles.historyAlarm}>
            <HistoryAlarmFilter {...this.props} onChangeFilter={this.onChangeFilter} />      
            <DeviceNameSearch onSearch={this.onChangeFilter} deviceName={this.props.deviceName} />
            <HistoryAlarmTable {...this.props} /> 
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  historyAlarm: state.monitor.alarm.get('historyAlarm').toJS(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
  warningLevel: state.monitor.alarm.get('warningLevel').toJS(),
  stationType: state.monitor.alarm.get('stationType'),
  stationCode: state.monitor.alarm.get('stationCode').toJS(),
  deviceTypeCode: state.monitor.alarm.get('deviceTypeCode').toJS(),
  warningConfigName: state.monitor.alarm.get('warningConfigName').toJS(),
  warningStatus: state.monitor.alarm.get('warningStatus').toJS(),
  startTime: state.monitor.alarm.get('startTime').toJS(),
  endTime: state.monitor.alarm.get('endTime').toJS(),
  deviceName: state.monitor.alarm.get('deviceName'),
  ticketInfo: state.monitor.alarm.get('ticketInfo').toJS(),
  relieveInfo: state.monitor.alarm.get('relieveInfo').toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload}),
  getHistoryAlarm: payload => dispatch({type: alarmAction.GET_HISTORY_ALARM_SAGA, payload}),
  getTicketInfo: payload =>dispatch({ type: alarmAction.GET_TICKET_INFO_SAGA, payload }),
  getRelieveInfo: payload =>dispatch({ type: alarmAction.GET_RELIEVE_INFO_SAGA, payload }),
  resetAlarm: payload =>dispatch({ type: alarmAction.RESET_ALARM_SAGA, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryAlarm);
