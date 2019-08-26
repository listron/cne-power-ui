
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';
import styles from './dataAnalysisScatter.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import DataAnalysisAllStation from '../../../../components/StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/DataAnalysisAllStation';
import SingleStationScatter from '../../../../components/StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/SingleStationScatter';

class DataAnalysisScatter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const breadCrumbData = { breadData: [{ name: '散点图' }] };
    const { showPage, theme } = this.props;

    return (
      <div className={`${styles.dataAnalysisScatter} ${styles[theme]}`} >
        <CommonBreadcrumb {...breadCrumbData} style={{ marginLeft: '38px' }} theme={theme} />
        <div className={styles.scatterMain}>
          {showPage === 'allStation' && <DataAnalysisAllStation {...this.props} />}
          {showPage === 'singleStation' && <SingleStationScatter {...this.props} />}
        </div>
        <Footer theme={theme} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.dataAnalysisScatterReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeToolStore: payload => dispatch({ type: dataAnalysisScatterAction.changeToolStore, payload }),
  resetStore: payload => dispatch({ type: dataAnalysisScatterAction.resetStore, payload }),
  getScatterName: payload => dispatch({ type: dataAnalysisScatterAction.getScatterName, payload }),
  getScatterOtherName: payload => dispatch({ type: dataAnalysisScatterAction.getScatterOtherName, payload }),
  getScatterData: payload => dispatch({ type: dataAnalysisScatterAction.getScatterData, payload }),
  getStationDevice: payload => dispatch({ type: dataAnalysisScatterAction.getStationDevice, payload }),


});
export default connect(mapStateToProps, mapDispatchToProps)(DataAnalysisScatter);
