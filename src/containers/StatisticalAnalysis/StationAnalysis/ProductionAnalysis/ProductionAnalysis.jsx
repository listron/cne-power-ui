
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './productionAnalusis.scss';
import { productionAnalysisAction } from './productionAnalysisAction';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import ProductionAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/ProductionAnalysis/ProductionAnalysis';

import Footer from '../../../../components/Common/Footer';


class ProductionAnalysisContainer extends Component {
  static propTypes = {
    location: PropTypes.object,
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.productionAnalysisBox} ${styles[theme]}`} >
        <div className={styles.productionAnalysis}>
          <ProductionAnalysis {...this.props} />
        </div>
        <Footer theme={theme} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.productionAnalysisReducer.toJS(),
    stations: state.common.get('stations'),
    userId: Cookie.get('userId'),
    theme: state.common.get('theme'),

  };
};
const mapDispatchToProps = (dispatch) => ({
  changeProductionStationStore: payload => dispatch({ type: productionAnalysisAction.CHANGE_PRODUCTIONSTATIONDATA_STORE_SAGA, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: productionAnalysisAction.getAllStationAvalibaData, payload }),
  ProductionPlanComplete: payload => dispatch({ type: productionAnalysisAction.ProductionPlanComplete, payload }),
  getSingleStationProductionData: payload => dispatch({ type: productionAnalysisAction.getSingleStationProductionData, payload }),
  getSingleStationPlanRateData: payload => dispatch({ type: productionAnalysisAction.getSingleStationPlanRateData, payload }),
  resetStore: payload => dispatch({ type: productionAnalysisAction.resetStore, payload }),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProductionAnalysisContainer);









