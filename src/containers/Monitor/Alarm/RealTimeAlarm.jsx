import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class RealTimeAlarm extends Component {
  static propTypes = {
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.realtimeAlarm}>
               
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  realtimeAlarm: state.monitor.alarm.get('realtimeAlarm').toJS(),

});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({type:alarmAction.CHANGE_ALARM_STORE_SAGA, payload}),
  getRealTimeAlarm: payload => dispatch({type:alarmAction.GET_REALTIME_ALARM_SAGA, payload}),
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
