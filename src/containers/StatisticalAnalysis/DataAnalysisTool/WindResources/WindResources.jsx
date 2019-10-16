import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { windResourcesAction } from './windResourcesAction.js';
import AllStations from '../../../../components/StatisticalAnalysis/DataAnalysisTool/WindResources/AllStations.jsx';
import HandleSearch from '../../../../components/StatisticalAnalysis/DataAnalysisTool/WindResources/HandleSearch.jsx';
import ResourcesTabs from '../../../../components/StatisticalAnalysis/DataAnalysisTool/WindResources/ResourcesTabs.jsx';
import Footer from '../../../../components/Common/Footer';
import styles from './windResources.scss';

class WindResources extends Component{
  static propTypes = {
    theme: PropTypes.string,
    resetStore: PropTypes.func,
    showPage: PropTypes.string,
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render(){
    const breadCrumbData = { breadData: [{ name: '风资源' }] };
    const { theme, showPage } = this.props;
    return(
      <div className={styles.windResources}>
        <CommonBreadcrumb {...breadCrumbData} style={{ marginLeft: '38px' }} theme={theme} />
        <div className={styles.resourcesMain}>
          {showPage === 'allStation' && <AllStations {...this.props} />}
          {showPage === 'singleStation' && [
            <HandleSearch key="HandleSearch" {...this.props} />,
            <ResourcesTabs key="ResourcesTabs" {...this.props} />,
            ]}
        </div>
        <Footer theme={theme} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.windResourcesReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeWindResourcesStore: payload => dispatch({ type: windResourcesAction.changeWindResourcesStore, payload }),
  resetStore: payload => dispatch({ type: windResourcesAction.resetStore, payload }),
  getFrequency: payload => dispatch({ type: windResourcesAction.getFrequency, payload }),
  getDirections: payload => dispatch({ type: windResourcesAction.getDirections, payload }),
  getStationDevice: payload => dispatch({ type: windResourcesAction.getStationDevice, payload }),
  getBigFrequency: payload => dispatch({ type: windResourcesAction.getBigFrequency, payload }),
  getBigDirections: payload => dispatch({ type: windResourcesAction.getBigDirections, payload }),
  getFrequencyMax: payload => dispatch({ type: windResourcesAction.getFrequencyMax, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WindResources);
