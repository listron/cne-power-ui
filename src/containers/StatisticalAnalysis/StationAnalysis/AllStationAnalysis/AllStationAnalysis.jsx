
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './allStationAnalysis.scss';
import { allStationAnalysisAction } from './allStationAnalysisAction.js';
// import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import AllStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationStatistic';
import SingStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/SingStationStatistic';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class AllStationAnalysis extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    stationCode: PropTypes.array,
    singleStationCode: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    resetAlarm: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    getAllStationAvalibaData: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }


  render() {
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.allStationAnalysisBox} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '全部电站' }]} style={{ paddingLeft: '38px' }} theme={theme} />
        <div className={styles.allStationStatistic}>
          {showPage === 'multiple' && <AllStationStatistic {...this.props} />}
          {showPage === 'single' && <SingStationStatistic {...this.props} />}
        </div>
        <Footer theme={theme} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.allStationAnalysis.toJS(),
    stations: state.common.get('stations'),
    userId: Cookie.get('userId'),
    theme: state.common.get('theme'),
    stationTypeCount: state.common.get('stationTypeCount'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE_SAGA, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: allStationAnalysisAction.getAllStationAvalibaData, payload }),
  getAllStationStatisticData: payload => dispatch({ type: allStationAnalysisAction.getAllStationStatisticData, payload }),
  getAllStationStatisticTableData: payload => dispatch({ type: allStationAnalysisAction.getAllStationStatisticTableData, payload }),
  getAllStationMonthBarData: payload => dispatch({ type: allStationAnalysisAction.getAllStationMonthBarData, payload }),
  getAllStationMonthPieData: payload => dispatch({ type: allStationAnalysisAction.getAllStationMonthPieData, payload }),
  getSingleStationStatisticData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationStatisticData, payload }),
  getSingleStationTargetData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationTargetData, payload }),
  getSingleStationMonthPieData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationMonthPieData, payload }),
  getSingleStationPlanRateData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPlanRateData, payload }),
  getSingleStationDayCompleteRateData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationDayCompleteRateData, payload }),
  getSingleStationPvCompareData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPvCompareData, payload }),
  getSingleStationYearPvCompareData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationYearPvCompareData, payload }),
  getSingleStationPowerEffectiveData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPowerEffectiveData, payload }),
  resetStore: payload => dispatch({ type: allStationAnalysisAction.resetStore, payload }),


});


export default connect(mapStateToProps, mapDispatchToProps)(AllStationAnalysis);









