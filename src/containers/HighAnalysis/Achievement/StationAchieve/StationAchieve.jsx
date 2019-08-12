import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StationSearch from '../../../../components/HighAnalysis/Achievement/StationAchieve/StationSearch';
import AnimationBox from '../../../../components/HighAnalysis/Achievement/StationAchieve/AnimationBox';
import LostAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/LostAnalysis/LostAnalysis';
import StopAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/StopAnalysis/StopAnalysis';
import { stationAchieveAction } from './stationAchieveReducer';
import styles from './station.scss';

class StationAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    changeStore: PropTypes.func,
  }

  render() {
    const { active, changeStore } = this.props;
    return (
      <div className={styles.stationAchieve} >
        <StationSearch {...this.props} />
        <AnimationBox changeStore={changeStore} active={active}>
          <LostAnalysis {...this.props} active={active === 'lost'} />
          <StopAnalysis {...this.props} active={active === 'stop'} />
          <div
            className={`${styles.eachPage} ${active === 'curve' ? styles.active : styles.inactive}`}
            style={{backgroundColor: 'gray'}}
          >功率曲线</div>
        </AnimationBox>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStation.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
  quotaInfo: state.highAanlysisReducer.achieveLayout.get('quotaInfo').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stationAchieveAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stationAchieveAction.getDevices, payload }),
  getLostRank: payload => dispatch({ type: stationAchieveAction.getLostRank, payload }),
  getLostTrend: payload => dispatch({ type: stationAchieveAction.getLostTrend, payload }),
  getLostTypes: payload => dispatch({ type: stationAchieveAction.getLostTypes, payload }),

  getStopElec: payload => dispatch({ type: stationAchieveAction.getStopElec, payload }),
  getStopRank: payload => dispatch({ type: stationAchieveAction.getStopRank, payload }),
  getStopTrend: payload => dispatch({ type: stationAchieveAction.getStopTrend, payload }),
  getStopTypes: payload => dispatch({ type: stationAchieveAction.getStopTypes, payload }),

  getCurveDevices: payload => dispatch({ type: stationAchieveAction.getCurveDevices, payload }),
  getCurveDevicesAep: payload => dispatch({ type: stationAchieveAction.getCurveDevicesAep, payload }),
  getCurveDevicesPsd: payload => dispatch({ type: stationAchieveAction.getCurveDevicesPsd, payload }),
  getCurveMonths: payload => dispatch({ type: stationAchieveAction.getCurveMonths, payload }),
  getCurveMonthAep: payload => dispatch({ type: stationAchieveAction.getCurveMonthAep, payload }),
  getCurveMonthPsd: payload => dispatch({ type: stationAchieveAction.getCurveMonthPsd, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

