
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allStationAnalysis.scss";
import { allStationAnalysisAction } from './allStationAnalysisAction.js';
import { getCookie } from '../../../../utils/index.js';
import PropTypes from "prop-types";
import AllStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationStatistic';
import SingStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/SingStationStatistic';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
// import moment from 'moment';


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
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // const { getAllStationAvalibaData, year, dateType } = this.props;
    // const currentYear = moment().format('YYYY');
    // let time = year ? year : [`${currentYear}`];
    // console.log(time);
    // const userId = getCookie('userId');
    // const params= {
    //     userId: userId,
    //     year: time,
    //     dateType,
    //   }
    // getAllStationAvalibaData(params)
  }
  componentWillReceiveProps(nextProps) {
    
  }
  

  componentWillUnmount() {

  }

  render() {
    const { showPage, dateType, year } = this.props;
    // console.log(year); 
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
          {showPage === 'multiple' && <AllStationStatistic {...this.props} />}
          {showPage === 'single' && <SingStationStatistic {...this.props} />}
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.allStationAnalysis.toJS(),
    stations: state.common.get('stations'),


  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: allStationAnalysisAction.CHANGE_ALLSTATIONDATA_STORE_SAGA, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: allStationAnalysisAction.getAllStationAvalibaData, payload }),
  getAllStationStatisticData: payload => dispatch({ type: allStationAnalysisAction.getAllStationStatisticData, payload }),
  getAllStationStatisticTableData: payload => dispatch({ type: allStationAnalysisAction.getAllStationStatisticTableData, payload }),
  getAllStationMonthBarData: payload => dispatch({ type: allStationAnalysisAction.getAllStationMonthBarData, payload }),
  getAllStationMonthPieData: payload => dispatch({ type: allStationAnalysisAction.getAllStationMonthPieData, payload }),
  getAllStationYearBarData: payload => dispatch({ type: allStationAnalysisAction.getAllStationYearBarData, payload }),
  getSingleStationStatisticData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationStatisticData, payload }),
  getSingleStationTargetData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationTargetData, payload }),
  getSingleStationMonthPieData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationMonthPieData, payload }),
  getSingleStationYearTargetData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationYearTargetData, payload }),
  getSingleStationPlanRateData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPlanRateData, payload }),
  getSingleStationDayCompleteRateData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationDayCompleteRateData, payload }),
  getSingleStationPvCompareData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPvCompareData, payload }),
  getSingleStationYearPvCompareData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationYearPvCompareData, payload }),
  getSingleStationPowerEffectiveData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPowerEffectiveData, payload }),



})


export default connect(mapStateToProps, mapDispatchToProps)(AllStationAnalysis);









