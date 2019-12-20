import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from './alarmCount.scss';
import PropTypes from 'prop-types';
import {alarmCountAction} from './alarmCountAction';
import Footer from '../../../../components/Common/Footer/index';
import AllAlarmCount from '../../../../components/Monitor/Alarm/AlarmCount/AllAlarmCount';
import SingleAlarmCount from '../../../../components/Monitor/Alarm/AlarmCount/SingleAlarmCount';


class AlarmCount extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // const pathname = nextProps.location.pathname;
    // const stationCode = pathname.split('/')[4];
    // const oldStationCode = this.props.location.pathname.split('/')[4];
    // if (oldStationCode !== stationCode && oldStationCode !== undefined && stationCode !== undefined) {
    //   this.props.changeAlarmStatisticStore({
    //     singleStationCode: stationCode
    //   });
    // }
  }

  componentWillUnmount() {
    // this.props.resetAlarm();
  }

  render() {
    const {showPage} = this.props;
    return (
      <div className={styles.alarmCountBox}>
        <div className={styles.alarmStatistic}>
          {showPage === 'multiple' && <AllAlarmCount {...this.props} />}
          {showPage === 'single' && <SingleAlarmCount {...this.props} />}
        </div>
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.monitor.alarmCount.toJS(),
    stations: state.common.get('stations').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeAlarmCountStore: payload => dispatch({type: alarmCountAction.changeAlarmCountStore, payload}),
  resetStore: payload => dispatch({type: alarmCountAction.resetStore, payload}),
  getAlarmStatistic: payload => dispatch({type: alarmCountAction.getAlarmStatistic, payload}),
  getStationsAlarmStatistic: payload => dispatch({type: alarmCountAction.getSingleAlarmStatistic, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmCount);
