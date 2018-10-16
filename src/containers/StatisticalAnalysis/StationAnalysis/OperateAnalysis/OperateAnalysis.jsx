
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./operateAnalysis.scss";
import { operateAnalysisAction } from './operateAnalysisAction';
import PropTypes from "prop-types";
import OperateAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class OperateAnalysisContainer extends Component {
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
          name: '运行分析',
        }
      ],
    };
  
    return (
      <div className={styles.operateAnalysisBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.operateAnalysis}>         
        <OperateAnalysis {...this.props} />        
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
     ...state.statisticalAnalysisReducer.operateAnalysisReducer.toJS(),
     stations: state.common.get('stations'),
     
     
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE_SAGA, payload }),


  
})


export default connect(mapStateToProps, mapDispatchToProps)(OperateAnalysisContainer);









