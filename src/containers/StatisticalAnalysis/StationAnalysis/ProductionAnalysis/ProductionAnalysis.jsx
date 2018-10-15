
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./productionAnalusis.scss";
import { productionAnalysisAction } from './productionAnalysisAction';
import PropTypes from "prop-types";
import ProductionAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class ProductionAnalysisC extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
    changeAlarmStatisticStore: PropTypes.func,
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
    const { showPage } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '生产分析',
        }
      ],
    };
  
    return (
      <div className={styles.productionAnalysisBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.productionAnalysis}>         
        <ProductionAnalysis {...this.props} />        
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
     ...state.statisticalAnalysisReducer.productionAnalysisReducer.toJS(),
     stations: state.common.get('stations'),
     
     
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA, payload }),


  
})


export default connect(mapStateToProps, mapDispatchToProps)(ProductionAnalysisC);









