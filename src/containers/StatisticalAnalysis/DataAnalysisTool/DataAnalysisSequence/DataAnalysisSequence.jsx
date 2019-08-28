import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dataAnalysisSequence.scss';
import { dataAnalysisSequenceAction } from './dataAnalysisSequenceAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import SequenceAllStation from '../../../../components/StatisticalAnalysis/DataAnalysisTool/DataAnalysisSequence/SequenceAllStation';
import SequenceSingleStation from '../../../../components/StatisticalAnalysis/DataAnalysisTool/DataAnalysisSequence/SequenceSingleStation';

class DataAnalysisSequence extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    showPage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {
    this.props.resetStore();
  }
  render() {
    const breadCrumbData = { breadData: [{ name: '时序图' }] };
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.dataAnalysisSequence} ${styles[theme]}`} >
        <CommonBreadcrumb {...breadCrumbData} style={{ marginLeft: '38px' }} theme={theme} />
        <div className={styles.sequenceMain}>
          {showPage === 'allStation' && <SequenceAllStation {...this.props} />}
          {showPage === 'singleStation' && <SequenceSingleStation {...this.props} />}
        </div>
        <Footer theme={theme} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // const tets = { ...state.statisticalAnalysisReducer.dataAnalysisSequenceReducer.toJS() };
  // console.log('tets: ', tets);

  return {
    ...state.statisticalAnalysisReducer.dataAnalysisSequenceReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),

  };
};
const mapDispatchToProps = (dispatch) => ({
  changeSquenceStore: payload => dispatch({ type: dataAnalysisSequenceAction.changeSquenceStore, payload }),
  resetStore: payload => dispatch({ type: dataAnalysisSequenceAction.resetStore, payload }),
  getStationDevice: payload => dispatch({ type: dataAnalysisSequenceAction.getStationDevice, payload }),
  getSequenceName: payload => dispatch({ type: dataAnalysisSequenceAction.getSequenceName, payload }),
  getSequenceOtherName: payload => dispatch({ type: dataAnalysisSequenceAction.getSequenceOtherName, payload }),
  getSequenceData: payload => dispatch({ type: dataAnalysisSequenceAction.getSequenceData, payload }),
  getBigSequenceData: payload => dispatch({ type: dataAnalysisSequenceAction.getBigSequenceData, payload }),
  getxyLimitValue: payload => dispatch({ type: dataAnalysisSequenceAction.getxyLimitValue, payload }),

});
export default connect(mapStateToProps, mapDispatchToProps)(DataAnalysisSequence);
