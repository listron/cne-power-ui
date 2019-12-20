
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './stationResourceAnalysis.scss';
import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';
import PropTypes from 'prop-types';
// import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import StationResourceAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis';

import Footer from '../../../../components/Common/Footer';


class ResourceAnalysisContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.props.resetStore();
  }
  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.stationResourceAnalysisBox} ${styles[theme]}`} >
        <div className={styles.stationResourceAnalysis}>
          <StationResourceAnalysis {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.stationResourceAnalysisReducer.toJS(),
    stations: state.common.get('stations'),
    userId: Cookie.get('userId'),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeResourceStore: payload => dispatch({ type: stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: stationResourceAnalysisAction.getAllStationAvalibaData, payload }),
  getResourcePlan: payload => dispatch({ type: stationResourceAnalysisAction.getResourcePlan, payload }),
  getResourceMonthLight: payload => dispatch({ type: stationResourceAnalysisAction.getResourceMonthLight, payload }),
  getResourceYearLight: payload => dispatch({ type: stationResourceAnalysisAction.getResourceYearLight, payload }),
  getResourceMonthWeather: payload => dispatch({ type: stationResourceAnalysisAction.getResourceMonthWeather, payload }),
  getResourceDayWeather: payload => dispatch({ type: stationResourceAnalysisAction.getResourceDayWeather, payload }),
  getResourcePvCompare: payload => dispatch({ type: stationResourceAnalysisAction.getResourcePvCompare, payload }),
  getResourceYearPvCompare: payload => dispatch({ type: stationResourceAnalysisAction.getResourceYearPvCompare, payload }),
  resetStore: payload => dispatch({ type: stationResourceAnalysisAction.resetStore, payload }),
});


export default connect(mapStateToProps, mapDispatchToProps)(ResourceAnalysisContainer);









