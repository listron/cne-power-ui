
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./stationResourceAnalysis.scss";
import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';
import PropTypes from "prop-types";
// import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import StationResourceAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class ResourceAnalysisContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  
  }

  componentWillUnmount() {
   
  }

  render() {

    const breadCrumbData = {
      breadData: [
        {
          name: '资源分析',
        }
      ],
    };
  
    return (
      <div className={styles.stationResourceAnalysisBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.stationResourceAnalysis}>         
        <StationResourceAnalysis {...this.props} />        
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
     ...state.statisticalAnalysisReducer.stationResourceAnalysisReducer.toJS(),
    stations: state.common.get('stations'),
    userId : Cookie.get('userId'),
     
     
  }
}
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
})


export default connect(mapStateToProps, mapDispatchToProps)(ResourceAnalysisContainer);









