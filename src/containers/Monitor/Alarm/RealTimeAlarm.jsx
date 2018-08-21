import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import { ticketAction } from '../../../constants/actionTypes/operation/ticketAction';
import RealTimeAlarmTable from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmTable';
import RealTimeAlarmFilter from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmFilter';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class RealTimeAlarm extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
    getDefectTypes: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, deviceName} = this.props;
    this.props.getRealTimeAlarm({
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      endTime,
      deviceName
    });
    this.props.getDefectTypes({stationType: 2});
  }

  render() {
    return (
      <div className={styles.realTimeAlarm}>
        <RealTimeAlarmFilter {...this.props} />      
        <RealTimeAlarmTable {...this.props} />   
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  realtimeAlarm: state.monitor.alarm.get('realtimeAlarm').toJS(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
  warningLevel: state.monitor.alarm.get('warningLevel').toJS(),
  stationType: state.monitor.alarm.get('stationType'),
  stationCode: state.monitor.alarm.get('stationCode').toJS(),
  deviceTypeCode: state.monitor.alarm.get('deviceTypeCode').toJS(),
  warningConfigName: state.monitor.alarm.get('warningConfigName').toJS(),
  startTime: state.monitor.alarm.get('startTime'),
  endTime: state.monitor.alarm.get('endTime'),
  deviceName: state.monitor.alarm.get('deviceName'),
  defectTypes: state.operation.defect.get('defectTypes'),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload}),
  getRealTimeAlarm: payload => dispatch({type: alarmAction.GET_REALTIME_ALARM_SAGA, payload}),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECTTYPES_SAGA, payload }),
  onTransferAlarm: payload =>dispatch({ type: alarmAction.TRANSFER_ALARM_SAGA, payload }),
  onRelieveAlarm: payload =>dispatch({ type: alarmAction.RELIEVE_ALARM_SAGA, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
