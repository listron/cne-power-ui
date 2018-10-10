
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allStationAnalysis.scss";
import PropTypes from "prop-types";
import AllStationStatistic from '../../../../components/statisticalAnalysis/stationAnalysis/allStationAnalysis/AllStationStatistic.jsx';
import SingStationStatistic from '../../../../components/statisticalAnalysis/stationAnalysis/allStationAnalysis/SingStationStatistic.jsx';
import { allStationAnalysisAction } from './AllStationAnalysisAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


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
  
  }

  componentWillUnmount() {
    // this.props.resetAlarm();
  }

  render() {
    const { showPage } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '全部电站',
        }
      ],
    };
  
    return (
      <div className={styles.allStationAnalysisBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.allStationStatistic}>     
          <AllStationStatistic {...this.props} />
          {showPage === 'single' && <SingStationStatistic {...this.props} />}     
         
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    // ...state.monitor.alarmStatistic.toJS(),
    // stations: state.common.get('stations'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  // changeAlarmStatisticStore: payload => dispatch({ type: alarmAction.CHANGE_ALARM_STATISTIC_STORE_SAGA, payload }),
  // getStationsAlarmStatistic: payload => dispatch({ type: alarmAction.GET_STATIONS_ALARM_STATISTIC_SAGA, payload }),
  // getSingleStationAlarmStatistic: payload => dispatch({ type: alarmAction.GET_SINGLESTATION_ALARM_STATISTIC_SAGA, payload }),
  // resetAlarm: payload => dispatch({ type: alarmAction.RESET_ALARM_STATISTIC_SAGA, payload }),
  // exportAlarm: payload => dispatch({ type: alarmAction.EXPORT_ALARM_STATISTIC_SAGA, payload }),
})


export default connect(mapStateToProps, mapDispatchToProps)(ALarmStatistic);









