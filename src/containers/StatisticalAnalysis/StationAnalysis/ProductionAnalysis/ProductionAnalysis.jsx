
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./productionAnalusis.scss";
import { productionAnalysisAction } from './productionAnalysisAction';
import { allStationAnalysisAction } from '../AllStationAnalysis/allStationAnalysisAction';
import { getCookie } from '../../../../utils/index.js';
import PropTypes from "prop-types";
import ProductionAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis';

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
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }

  render() {
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
    userId : getCookie('userId'),

  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAllStationStore: payload => dispatch({ type: productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: allStationAnalysisAction.getAllStationAvalibaData, payload }),
  ProductionPlanComplete: payload => dispatch({ type: productionAnalysisAction.ProductionPlanComplete, payload }),
  getSingleStationProductionData: payload => dispatch({ type: productionAnalysisAction.getSingleStationProductionData, payload }),
  getSingleStationPlanRateData: payload => dispatch({ type: allStationAnalysisAction.getSingleStationPlanRateData, payload }),


})


export default connect(mapStateToProps, mapDispatchToProps)(ProductionAnalysisContainer);









