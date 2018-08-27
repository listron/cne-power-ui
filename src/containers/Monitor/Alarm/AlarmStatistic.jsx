
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./alarm.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import AlarmAllStationStatistic from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmAllStationStatistic.jsx';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';




const TabPane = Tabs.TabPane;
class ALarmStatistic extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,

    getStationsAlarmStatistic: PropTypes.func,
    resetAlarm: PropTypes.func,
    loading: PropTypes.bool,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    this.props.resetAlarm();
  }


  render() {
    return (
      <div className={styles.alarmStatist}>
        <AlarmAllStationStatistic {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    )
  }
}
const mapStateToProps = (state) => {

  return {
    ...state.monitor.alarmStatistic.toJS(),
    stations: state.common.get('stations'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  getStationsAlarmStatistic: payload => dispatch({type: alarmAction.GET_STATIONS_ALARM_STATISTIC_SAGA, payload}),
  resetAlarm: payload =>dispatch({ type: alarmAction.RESET_ALARM_STATISTIC_SAGA, payload }),
})


export default connect(mapStateToProps, mapDispatchToProps)(ALarmStatistic);









