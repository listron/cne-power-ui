
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./alarm.scss";
import PropTypes from "prop-types";
import AlarmAllStationStatistic from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmAllStationStatistic';
import AlarmSingleStationStatistic from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmSingleStationStatistic'
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';


class ALarmStatistic extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    stationCode: PropTypes.array,
    singleStationCode: PropTypes.string,
    changeAlarmStatisticStore: PropTypes.func,
    resetAlarm: PropTypes.func,
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const pathname = nextProps.location.pathname;
    const stationCode = pathname.split('/')[4];
    const oldStationCode = this.props.location.pathname.split('/')[4];
    if (oldStationCode !== stationCode && oldStationCode !== undefined && stationCode !== undefined) {
      this.props.changeAlarmStatisticStore({
        singleStationCode: stationCode
      });
    }
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  render() {
    const { showPage } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '告警统计',
        }
      ],
    };
  
    return (
      <div className={styles.alarmStatisticBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.alarmStatistic}>

          {showPage === 'multiple' && <AlarmAllStationStatistic {...this.props} />}
          {showPage === 'single' && <AlarmSingleStationStatistic {...this.props} />}
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
  changeAlarmStatisticStore: payload => dispatch({ type: alarmAction.CHANGE_ALARM_STATISTIC_STORE_SAGA, payload }),
  getStationsAlarmStatistic: payload => dispatch({ type: alarmAction.GET_STATIONS_ALARM_STATISTIC_SAGA, payload }),
  getSingleStationAlarmStatistic: payload => dispatch({ type: alarmAction.GET_SINGLESTATION_ALARM_STATISTIC_SAGA, payload }),
  resetAlarm: payload => dispatch({ type: alarmAction.RESET_ALARM_STATISTIC_SAGA, payload }),
  exportAlarm: payload => dispatch({ type: alarmAction.EXPORT_ALARM_STATISTIC_SAGA, payload }),
})


export default connect(mapStateToProps, mapDispatchToProps)(ALarmStatistic);









