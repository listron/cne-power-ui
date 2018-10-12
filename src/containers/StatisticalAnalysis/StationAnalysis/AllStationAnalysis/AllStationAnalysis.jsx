
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allStationAnalysis.scss";
import { allStationAnalysisAction } from './allStationAnalysisAction.js';
import PropTypes from "prop-types";
import AllStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/AllStationStatistic';
import SingStationStatistic from '../../../../components/StatisticalAnalysis/StationAnalysis/AllStationAnalysis/SingStationStatistic';
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
         {showPage === 'multiple'&& <AllStationStatistic {...this.props} />}
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
  
})


export default connect(mapStateToProps, mapDispatchToProps)(ALarmStatistic);









