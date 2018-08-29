
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./alarm.scss";
import PropTypes from "prop-types";
import AlarmAllStationStatistic from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmAllStationStatistic';
import AlarmSingleStationStatistic from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmSingleStationStatistic'
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import Footer from '../../../components/Common/Footer';
// import TransitionContainer from '../../../components/Common/TransitionContainer';

class ALarmStatistic extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    singleStationCode: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    stations: PropTypes.object,

    getStationsAlarmStatistic: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
    resetAlarm: PropTypes.func,
    loading: PropTypes.bool,
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    const stationCode = pathname.split('/')[4];
    this.changeStationCode(stationCode);
  }

  componentWillReceiveProps(nextProps) {
    const pathname = nextProps.location.pathname;
    const stationCode = pathname.split('/')[4];
    const oldStationCode = this.props.location.pathname.split('/')[4];
    if(oldStationCode !== stationCode) {
      this.changeStationCode(stationCode);
    }
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  changeStationCode(stationCode) {
    if(stationCode) {
      this.props.changeAlarmStatisticStore({
        showPage: 'single',
        singleStationCode: stationCode
      });
    } else {
      this.props.changeAlarmStatisticStore({
        showPage: 'multiple',
        singleStationCode: ''
      });
    }
  }


  render() {
    const { showPage } = this.props;
    return (
      <div className={styles.alarmStatistic}>
        {showPage==='multiple'&&<AlarmAllStationStatistic {...this.props} />}
        {showPage==='single'&&<AlarmSingleStationStatistic {...this.props} />}
        {/* <div className={styles.alarmStatisticMain}>
          {showPage==='multiple'&&<AlarmAllStationStatistic {...this.props} />}
        </div>
        <TransitionContainer
          show={showPage==='single'}
          timeout={500}
          effect="side"
        >
          <div className={styles.alarmStatisticSide}>
            {showPage==='single'&&<AlarmSingleStationStatistic {...this.props} />}
          </div>
        </TransitionContainer> */}
        <Footer />
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
  changeAlarmStatisticStore: payload => dispatch({type: alarmAction.CHANGE_ALARM_STATISTIC_STORE_SAGA, payload}),
  getStationsAlarmStatistic: payload => dispatch({type: alarmAction.GET_STATIONS_ALARM_STATISTIC_SAGA, payload}),
  getSingleStationAlarmStatistic: payload => dispatch({type: alarmAction.GET_SINGLESTATION_ALARM_STATISTIC_SAGA, payload}),
  resetAlarm: payload =>dispatch({ type: alarmAction.RESET_ALARM_STATISTIC_SAGA, payload }),
})


export default connect(mapStateToProps, mapDispatchToProps)(ALarmStatistic);









