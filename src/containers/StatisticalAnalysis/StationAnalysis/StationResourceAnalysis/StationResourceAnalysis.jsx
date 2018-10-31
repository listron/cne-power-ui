
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./stationResourceAnalysis.scss";
import { stationResourceAnalysisAction } from './stationResourceAnalysisAction';
import PropTypes from "prop-types";
import StationResourceAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/StationResourceAnalysis/StationResourceAnalysis';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class ProductionAnalysisContainer extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
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
     
     
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: stationResourceAnalysisAction.CHANGE_STATIONRESOURCESTATIONDATA_STORE_SAGA, payload }),
 



  
})


export default connect(mapStateToProps, mapDispatchToProps)(ProductionAnalysisContainer);









