import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class RealTimeAlarm extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    warningLevel: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    warningConfigName: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.realTimeAlarm}>
               
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  realtimeAlarm: state.monitor.alarm.get('realtimeAlarm').toJS(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
  warningLevel: state.common.get('warningLevel'),
  stationType: state.common.get('stationType'),
  stationCode: state.common.get('stationCode'),
  deviceTypeCode: state.common.get('deviceTypeCode'),
  warningConfigName: state.common.get('warningConfigName'),
  startTime: state.common.get('startTime'),
  endTime: state.common.get('endTime'),
  deviceName: state.common.get('deviceName'),

});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({type:alarmAction.CHANGE_ALARM_STORE_SAGA, payload}),
  getRealTimeAlarm: payload => dispatch({type:alarmAction.GET_REALTIME_ALARM_SAGA, payload}),
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
